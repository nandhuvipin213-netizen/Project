import type { RequestHandler } from "express";
import shipmentModel from "../models/shipment.js";
import DriverModel from "../models/driver.js";
import VehicleModel from "../models/vehicle.js";
import vehicleLocationModel from "../models/vehicleLocation.js";
import { geocodeAddress } from "../utils/geocode.js";
import NotificationModel from "../models/Notification.js";
import { getRouteDistance } from "../utils/getRouteDistance.js";
import razorpay from "../config/razorpay.js";
import { createHmac, timingSafeEqual } from "crypto";



export const createShipment: RequestHandler = async (req, res) => {
  try {
    const {
      pickupAddress,
      deliveryAddress,
      goodsType,
      goodsDescription,
      packageCount,
      weight,
      pickupDate,
      pickupTime,
      isFragile,
    } = req.body;

    const customerId = res.locals.authUser.userId;

    // Validate required addresses
    if (!pickupAddress || !deliveryAddress) {
      res.status(400).json({
        success: false,
        message: "Pickup and delivery addresses are required",
      });
      return;
    }

    // Convert pickup address into coordinates
    const pickupCoordinates = await geocodeAddress(pickupAddress);

    if (!pickupCoordinates) {
      res.status(400).json({
        success: false,
        message: "Unable to find the pickup location. Please enter a more specific address.",
      });
      return;
    }
    if (!goodsType) {
      res.status(400).json({
        success: false,
        message: "Goods type is required",
      });
      return;
    }
    if (!packageCount || Number(packageCount) < 1 || !pickupDate || !pickupTime) {
      res.status(400).json({
        success: false,
        message: "Package count, pickup date and pickup time are required",
      });
      return;
    }

    // Respect Nominatim's public service rate limit
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Convert delivery address into coordinates
    const deliveryCoordinates = await geocodeAddress(deliveryAddress);

    if (!deliveryCoordinates) {
      res.status(400).json({
        success: false,
        message: "Unable to find the delivery location. Please enter a more specific address.",
      });
      return;
    }

    const distanceKm = await getRouteDistance(
      pickupCoordinates,
      deliveryCoordinates
    );

    const advanceRatePerKm = 5;

    const advanceAmount = Number(
      (distanceKm * advanceRatePerKm).toFixed(2)
    )

    // Save shipment with both coordinate sets
    const shipment = await shipmentModel.create({
      customer: customerId,
      pickupAddress,
      deliveryAddress,
      pickupCoordinates,
      deliveryCoordinates,
      goodsType,
      goodsDescription,
      packageCount: Number(packageCount),
      pickupDate: new Date(pickupDate),
      pickupTime,
      weight: weight ? Number(weight) : null,
      volume: 0,
      isFragile,

      distanceKm,
      advanceAmount,
      advanceRatePerKm,

      statusHistory: [
        {
          status: "pending",
          updatedBy: customerId,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      shipment,
    });
  } catch (error) {
    console.error("Create shipment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create shipment",
    });
  }
};


export const getsShipment: RequestHandler = async (req, res) => {
  try {
    const authUser = res.locals.authUser
    let shipments;

    if (authUser.role === "admin") {
      shipments = await shipmentModel
        .find()
        .populate("customer", "name email")
        .populate("assignedDriver", "name email")
        .populate("assignedVehicle", "registrationNumber vehicleType")
        .sort({ createdAt: -1 });
    }
    else {
     shipments = await shipmentModel
    .find({
        customer: authUser.userId,
    })
    .populate("assignedDriver", "name email")
    .populate("assignedVehicle", "registrationNumber vehicleType")
    .sort({ createdAt: -1 })
    .lean();
    }
    res.status(200).json({
      success: true,
      count: shipments.length,
      shipments,
    });
  } catch (error) {
    console.error("Get shipments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve shipments",
    });
  }
};

export const updateShipmentStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "assigned",
      "picked-up",
      "in-transit",
      "delivered",
      "cancelled",
    ];


    if (!allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid shipment status",
      });
      return;
    }


    const shipment = await shipmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!shipment) {
      res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Shipment status updated successfully",
      shipment,
    });
  } catch (error) {
    console.error("Update shipment status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update shipment status",
    });
  }
};

export const assignShipment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId, vehicleId } = req.body;

    // 1. Validate required fields
    if (!driverId || !vehicleId) {
      res.status(400).json({
        success: false,
        message: "Driver ID and Vehicle ID are required",
      });
      return;
    }

    // 2. Find shipment
    const shipment = await shipmentModel.findById(id);

    if (!shipment) {
      res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
      return;
    }

    // 3. Only pending shipments can be assigned
    if (shipment.status !== "pending") {
      res.status(400).json({
        success: false,
        message: "Only pending shipments can be assigned",
      });
      return;
    }

    // 4. Find driver profile and populate user
    const driver = await DriverModel.findById(driverId)
      .populate("user");

    if (!driver) {
      res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
      return;
    }

    // 5. Check driver account
    const driverUser = driver.user as any;

    if (!driverUser || !driverUser.isActive) {
      res.status(404).json({
        success: false,
        message: "Active driver not found",
      });
      return;
    }

    // 6. Check driver availability
    if (driver.availabilityStatus !== "available") {
      res.status(400).json({
        success: false,
        message: "Driver is not available",
      });
      return;
    }

    // 7. Find available vehicle
    const vehicle = await VehicleModel.findOne({
      _id: vehicleId,
      status: "available",
      isActive: true,
    });

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: "Available vehicle not found",
      });
      return;
    }

    // 8. Assign driver and vehicle
    shipment.assignedDriver = driverUser._id;
    shipment.assignedVehicle = vehicle._id;
    shipment.status = "assigned";

    // 9. Update shipment history
    shipment.statusHistory.push({
      status: "assigned",
      updatedBy: res.locals.authUser.userId,
    });

    await shipment.save();

    // 10. Update vehicle status
    vehicle.status = "in-use";
    await vehicle.save();

    // 11. Update driver availability
    driver.availabilityStatus = "on-duty";
    await driver.save();

    // 12. Create notification for assigned driver
    try {
      await NotificationModel.create({
        recipient: driverUser._id,
        title: "New Shipment Assigned",
        message: `A new shipment has been assigned to you. Shipment ID: ${shipment._id}`,
        type: "shipment",
        isRead: false,
      });
    } catch (notificationError) {
      console.error("Failed to create driver notification:", notificationError);
    }

    // 12. Response
    res.status(200).json({
      success: true,
      message: "Driver and vehicle assigned successfully",
      shipment,
    });

  } catch (error) {
    console.error("Assign shipment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to assign driver and vehicle",
    });
  }
};

export const getDriverShipments: RequestHandler = async (req, res) => {
  try {
    const driverId = res.locals.authUser.userId;

    const shipments = await shipmentModel.find({
      assignedDriver: driverId,
    })
      .populate("customer", "name email")
      .populate("assignedVehicle", "registrationNumber vehicleType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shipments.length,
      shipments,
    });
  } catch (error) {
    console.error("Get driver shipments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve driver shipments",
    });
  }
};

export const updateDriverShipmentStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const driverId = res.locals.authUser.userId;

    const allowedStatuses = ["picked-up", "in-transit", "delivered"];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid delivery status",
      });
      return;
    }


    const shipment = await shipmentModel.findOne({
      _id: id,
      assignedDriver: driverId,
    });

    if (!shipment) {
      res.status(404).json({
        success: false,
        message: "Shipment not found or not assigned to you",
      });
      return;
    }
    const allowedTransitions: Record<string, string> = {
      assigned: "picked-up",
      "picked-up": "in-transit",
      "in-transit": "delivered",
    };

    if (allowedTransitions[shipment.status] !== status) {
      res.status(400).json({
        success: false,
        message: `Cannot change status from ${shipment.status} to ${status}`,
      });
      return;
    }

    shipment.status = status;

    shipment.statusHistory.push({
      status: status,
      updatedBy: res.locals.authUser.userId,
    });

    await shipment.save();
    if (status === "delivered") {
      // Check whether the driver has other active shipments
      const otherActiveShipments = await shipmentModel.find({
        assignedDriver: driverId,
        _id: { $ne: shipment._id },
        status: { $in: ["assigned", "picked-up", "in-transit"] },
      });

      // Make driver available only if no active shipments remain
      if (otherActiveShipments.length === 0) {
        await DriverModel.findOneAndUpdate(
          { user: driverId },
          { availabilityStatus: "available" }
        );
      }

      // Release vehicle only if no other active shipment uses it
      if (shipment.assignedVehicle) {
        const vehicleInUse = await shipmentModel.findOne({
          assignedVehicle: shipment.assignedVehicle,
          _id: { $ne: shipment._id },
          status: { $in: ["assigned", "picked-up", "in-transit"] },
        });

        if (!vehicleInUse) {
          await VehicleModel.findByIdAndUpdate(
            shipment.assignedVehicle,
            { status: "available" }
          );
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Delivery status updated successfully",
      shipment,
    });

  } catch (error) {
    console.error("Driver status update error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update delivery status",
    });
  }
};

export const getShipmentTracking: RequestHandler = async (req, res) => {
  try {
    const shipmentId = req.params.id;
    if (typeof shipmentId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid shipment ID",
      });
      return;
    }
    const customerId = res.locals.authUser.userId;

    const shipment = await shipmentModel
      .findOne({
        _id: shipmentId,
        customer: customerId,
      })
      .populate("assignedDriver", "name email")
      .populate("assignedVehicle", "registrationNumber vehicleType")
      .populate("statusHistory.updatedBy", "name role");

    if (!shipment) {
      res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
      return;
    }

    const latestLocation = await vehicleLocationModel
      .findOne({ shipment: shipmentId })
      .sort({ recordedAt: -1 })
      .populate("vehicle", "registrationNumber vehicleType")
      .populate("driver", "name email");

    res.status(200).json({
      success: true,
      message: "Shipment tracking details retrieved successfully",
      tracking: shipment,
      latestLocation: latestLocation || null,
    });
  } catch (error) {
    console.error("Shipment tracking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve shipment tracking details",
    });
  }
};

export const deleteShipment: RequestHandler = async (req, res) => {
  try {

    // Check shipment ID
    const id = req.params.id;

    // Check shipment ID
    if (
      typeof id !== "string" ||
      !/^[a-fA-F0-9]{24}$/.test(id)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid shipment ID",
      });
      return;
    }

    const shipment = await shipmentModel.findById(id);

    if (!shipment) {
      res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
      return;
    }

    // Active shipments must be cancelled before deletion
    const activeStatuses = [
      "assigned",
      "picked-up",
      "in-transit",
    ] as const;

    const isActiveShipment = activeStatuses.some((status) => status === shipment.status);

    if (isActiveShipment) {
      res.status(400).json({
        success: false,
        message: "Please cancel this active shipment before deleting it",
      });
      return;
    }

    const vehicleId = shipment.assignedVehicle;

    // Remove tracking records associated with this shipment
    await vehicleLocationModel.deleteMany({
      shipment: shipment._id,
    });

    // Delete shipment
    await shipmentModel.findByIdAndDelete(id);

    // Release vehicle if no other active shipment uses it
    if (vehicleId) {
      const otherActiveShipments = await shipmentModel.countDocuments({
        assignedVehicle: vehicleId,
        status: { $in: activeStatuses },
      });

      if (otherActiveShipments === 0) {
        await VehicleModel.findOneAndUpdate(
          { _id: vehicleId, status: "in-use" },
          { status: "available" }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Shipment deleted successfully",
    });
  }
  catch (error) {
    console.error("Delete shipment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete shipment",
    });
  }
}



export const createAdvanceOrder: RequestHandler = async (req, res) => {
  try {
    const { shipmentId } = req.body;
    const customerId = res.locals.authUser.userId;

    // Find the shipment belonging to this customer
    const shipment = await shipmentModel.findOne({
      _id: shipmentId,
      customer: customerId,
    });

    if (!shipment) {
      res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
      return;
    }

    // Prevent duplicate payment for an already-paid advance
    if (shipment.advancePaymentStatus === "paid") {
      res.status(400).json({
        success: false,
        message: "Advance payment already completed",
      });
      return;
    }

    // Convert rupees into paise
    const amountInPaise = Math.round(
      shipment.advanceAmount * 100
    );

    if (amountInPaise <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid advance amount",
      });
      return;
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: shipment._id.toString(),
    });

    // Save Razorpay order ID in MongoDB
    shipment.advanceOrderId = order.id;
    await shipment.save();

    res.status(200).json({
      success: true,
      message: "Payment order created successfully",
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Create advance order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

export const verifyAdvancePayment: RequestHandler = async (req, res) => {
  try {
    const {
      shipmentId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    const customerId = res.locals.authUser.userId;

    if (
      !shipmentId ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
      return;
    }

    // Find shipment belonging to this customer
    const shipment = await shipmentModel.findOne({
      _id: shipmentId,
      customer: customerId,
    });

    if (!shipment) {
      res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
      return;
    }

    // Check whether this is the order created for this shipment
    if (shipment.advanceOrderId !== razorpay_order_id) {
      res.status(400).json({
        success: false,
        message: "Invalid payment order",
      });
      return;
    }

    if (shipment.advancePaymentStatus === "paid") {
      res.status(400).json({
        success: false,
        message: "Advance payment already completed",
      });
      return;
    }

    // Generate expected Razorpay signature
    const expectedSignature = createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET!
    )
      .update(`${shipment.advanceOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    // Compare signatures safely
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
      return;
    }

    // Fetch actual payment details from Razorpay
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    // Confirm payment is captured
    if (
      payment.status !== "captured" ||
      payment.order_id !== shipment.advanceOrderId ||
      payment.amount !== Math.round(shipment.advanceAmount * 100)
    ) {
      res.status(400).json({
        success: false,
        message: "Payment is not captured or details do not match",
        paymentStatus: payment.status,
      });
      return;
    }

    // Save verified payment
    shipment.advancePaymentStatus = "paid";
    shipment.advancePaymentId = razorpay_payment_id;
    shipment.advancePaidAt = new Date();

    await shipment.save();
    res.status(200).json({
      success: true,
      message: "Advance payment verified successfully",
      shipment,
    });

  } catch (error) {
    console.error("Verify advance payment error:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export const handleRazorpayWebhook: RequestHandler = async (req, res) => {
    try {
        const rawBody = (req as typeof req & {
            rawBody?: Buffer;
        }).rawBody;

        const signature = req.headers["x-razorpay-signature"];

        if (!rawBody || typeof signature !== "string") {
            res.status(400).json({
                success: false,
                message: "Missing webhook body or signature",
            });
            return;
        }

        // Generate the expected webhook signature
        const expectedSignature = createHmac(
            "sha256",
            process.env.RAZORPAY_WEBHOOK_SECRET!
        )
            .update(rawBody)
            .digest("hex");

        const expectedBuffer = Buffer.from(expectedSignature, "hex");
        const receivedBuffer = Buffer.from(signature, "hex");

        if (
            expectedBuffer.length !== receivedBuffer.length ||
            !timingSafeEqual(expectedBuffer, receivedBuffer)
        ) {
            res.status(400).json({
                success: false,
                message: "Invalid webhook signature",
            });
            return;
        }

        // Read the verified webhook event
        const event = JSON.parse(rawBody.toString("utf8"));

        const payment = event.payload?.payment?.entity;

        if (!payment) {
            res.status(200).json({ success: true });
            return;
        }

        // Find the shipment using its Razorpay order ID
        const shipment = await shipmentModel.findOne({
            advanceOrderId: payment.order_id,
        });

        if (!shipment) {
            res.status(200).json({ success: true });
            return;
        }

        // Handle successful payment capture
        if (event.event === "payment.captured") {
            if (
                payment.status !== "captured" ||
                payment.amount !== Math.round(shipment.advanceAmount * 100)
            ) {
                res.status(400).json({
                    success: false,
                    message: "Payment details do not match",
                });
                return;
            }

            // Prevent duplicate webhook processing
            if (shipment.advancePaymentStatus !== "paid") {
                shipment.advancePaymentStatus = "paid";
                shipment.advancePaymentId = payment.id;
                shipment.advancePaidAt = new Date();

                await shipment.save();
            }
        }

        // Handle failed payment
        if (
            event.event === "payment.failed" &&
            shipment.advancePaymentStatus === "pending"
        ) {
            shipment.advancePaymentStatus = "failed";
            await shipment.save();
        }

        res.status(200).json({
            success: true,
            message: "Webhook processed successfully",
        });

    } catch (error) {
        console.error("Razorpay webhook error:", error);

        res.status(500).json({
            success: false,
            message: "Webhook processing failed",
        });
    }
};