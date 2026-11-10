import type { RequestHandler } from "express";
import shipmentModel from "../models/shipment.js";
import DriverModel from "../models/driver.js";
import VehicleModel from "../models/vehicle.js";
import vehicleLocationModel from "../models/vehicleLocation.js";
import { geocodeAddress } from "../utils/geocode.js";
import NotificationModel from "../models/Notification.js";
import { getRouteDistance } from "../utils/getRouteDistance.js";




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

    const advanceRatePerKm=5;

    const advanceAmount= Number(
      (distanceKm*advanceRatePerKm).toFixed(2)
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
      shipments = await shipmentModel.find({
        customer: authUser.userId,
      })
        .populate("assignedDriver", "name email")
        .populate("assignedVehicle", "registrationNumber vehicleType")
        .sort({ createdAt: -1 });
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