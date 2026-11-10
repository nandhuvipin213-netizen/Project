
import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.js";
import DriverModel from "../models/driver.js";
import shipmentModel from "../models/shipment.js";
import vehicleLocationModel from "../models/vehicleLocation.js";
// CREATE DRIVER
export const createDriver: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      licenseNumber,
      licenseExpiryDate,
      address,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !licenseNumber ||
      !licenseExpiryDate ||
      !address
    ) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    // Check existing email
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }

    // Check existing license
    const existingDriver = await DriverModel.findOne({
      licenseNumber: licenseNumber.toUpperCase(),
    });

    if (existingDriver) {
      res.status(409).json({
        success: false,
        message: "License number already exists",
      });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create driver user account
    const user = await UserModel.create({
      name,
      email,
      phone,
      passwordHash,
      role: "driver",
    });

    try {
      // Create driver profile
      const driver = await DriverModel.create({
        user: user._id,
        licenseNumber,
        licenseExpiryDate,
        address,
      });

      res.status(201).json({
        success: true,
        message: "Driver created successfully",
        driver: {
          id: driver._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          licenseNumber: driver.licenseNumber,
          licenseExpiryDate: driver.licenseExpiryDate,
          address: driver.address,
          availabilityStatus: driver.availabilityStatus,
        },
      });
    } catch (error) {
      // Roll back user if profile creation fails
      await UserModel.findByIdAndDelete(user._id);
      throw error;
    }
  } catch (error) {
    console.error("Create driver error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create driver",
    });
  }
};

// GET ALL DRIVERS
export const getAllDrivers: RequestHandler = async (req, res) => {
  try {
    const drivers = await DriverModel.find()
      .populate("user", "name email phone isActive")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    console.error("Get drivers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch drivers",
    });
  }
};

export const getDriverById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await DriverModel.findById(id)
      .populate("user", "name email phone isActive");

    if (!driver) {
      res.status(404).json({
        success: false,
        message: "Driver not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      driver,
    });

  } catch (error) {
    console.error("Get driver error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch driver",
    });
  }
};

export const updateDriver: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      licenseNumber,
      licenseExpiryDate,
      address,
      availabilityStatus,
    } = req.body;

    // Find driver
    const driver = await DriverModel.findById(id);

    if (!driver) {
      res.status(404).json({
        success: false,
        message: "Driver not found",
      });
      return;
    }

    // Find linked user
    const user = await UserModel.findById(driver.user);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Driver user account not found",
      });
      return;
    }

    // Check duplicate email
    if (email && email.toLowerCase() !== user.email) {
      const existingEmail = await UserModel.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id },
      });

      if (existingEmail) {
        res.status(409).json({
          success: false,
          message: "Email already exists",
        });
        return;
      }
    }

    // Check duplicate license
    if (licenseNumber &&
      licenseNumber.toUpperCase() !== driver.licenseNumber) {
      const existingLicense = await DriverModel.findOne({
        licenseNumber: licenseNumber.toUpperCase(),
        _id: { $ne: driver._id },
      });

      if (existingLicense) {
        res.status(409).json({
          success: false,
          message: "License number already exists",
        });
        return;
      }
    }

    // Validate availability status
    if (
      availabilityStatus &&
      !["available", "on-duty", "off-duty"].includes(
        availabilityStatus
      )
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid availability status",
      });
      return;
    }

    // Update user details
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    // Update driver details
    if (licenseNumber !== undefined) {
      driver.licenseNumber = licenseNumber;
    }

    if (licenseExpiryDate !== undefined) {
      driver.licenseExpiryDate = new Date(licenseExpiryDate);
    }

    if (address !== undefined) {
      driver.address = address;
    }

    if (availabilityStatus !== undefined) {
      driver.availabilityStatus = availabilityStatus;
    }

    await driver.save();

    res.status(200).json({
      success: true,
      message: "Driver updated successfully",
      driver: {
        id: driver._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        licenseNumber: driver.licenseNumber,
        licenseExpiryDate: driver.licenseExpiryDate,
        address: driver.address,
        availabilityStatus: driver.availabilityStatus,
      },
    });

  } catch (error) {
    console.error("Update driver error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update driver",
    });
  }
};

export const deactivateDriver: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await DriverModel.findById(id);

    if (!driver) {
      res.status(404).json({
        success: false,
        message: "Driver not found",
      });
      return;
    }

    const user = await UserModel.findById(driver.user);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Driver user account not found",
      });
      return;
    }

    if (!user.isActive) {
      res.status(400).json({
        success: false,
        message: "Driver is already deactivated",
      });
      return;
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Driver deactivated successfully",
    });

  } catch (error) {
    console.error("Deactivate driver error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate driver",
    });
  }
};

// REACTIVATE DRIVER
export const activateDriver: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await DriverModel.findById(id);

    if (!driver) {
      res.status(404).json({
        success: false,
        message: "Driver not found",
      });
      return;
    }

    const user = await UserModel.findById(driver.user);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Driver user account not found",
      });
      return;
    }

    if (user.isActive) {
      res.status(400).json({
        success: false,
        message: "Driver is already active",
      });
      return;
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Driver activated successfully",
    });

  } catch (error) {
    console.error("Activate driver error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to activate driver",
    });
  }
};

// GET DRIVER DASHBOARD
export const getDriverDashboard: RequestHandler = async (req, res) => {
  try {
    const driverId = res.locals.authUser?.userId;

    if (!driverId) {
      res.status(401).json({
        success: false,
        message: "Driver authentication required",
      });
      return;
    }

    // Find shipments assigned to the logged-in driver
    const assignedFilter = {
      assignedDriver: driverId,
      status: { $ne: "cancelled" as const },
    };

    const [
      totalShipments,
      pendingPickups,
      activeDeliveries,
      completedDeliveries,
      recentShipments,
      activeVehicleShipment,
    ] = await Promise.all([
      // Total non-cancelled shipments
      shipmentModel.countDocuments(assignedFilter),

      // Shipments waiting for pickup
      shipmentModel.countDocuments({
        assignedDriver: driverId,
        status: "assigned" as const,
      }),

      // Shipments currently being delivered
      shipmentModel.countDocuments({
        assignedDriver: driverId,
        status: { $in: ["picked-up", "in-transit"] },
      }),

      // Completed shipments
      shipmentModel.countDocuments({
        assignedDriver: driverId,
        status: "delivered",
      }),

      // Latest five shipments
      shipmentModel
        .find(assignedFilter)
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate("customer", "name email phone")
        .populate(
          "assignedVehicle",
          "registrationNumber vehicleType capacity volumeCapacity status"
        ),

      // Latest active shipment and its assigned vehicle
      shipmentModel
        .findOne({
          assignedDriver: driverId,
          status: { $in: ["assigned", "picked-up", "in-transit"] },
          assignedVehicle: { $ne: null },
        })
        .sort({ updatedAt: -1 })
        .populate(
          "assignedVehicle",
          "registrationNumber vehicleType capacity volumeCapacity status"
        )
        .select("assignedVehicle"),
    ]);

    const completionRate =
      totalShipments > 0
        ? Math.round((completedDeliveries / totalShipments) * 100)
        : 0;

    res.status(200).json({
      success: true,
      message: "Driver dashboard data fetched successfully",

      stats: {
        totalShipments,
        pendingPickups,
        activeDeliveries,
        completedDeliveries,
        completionRate,
      },

      vehicle: activeVehicleShipment?.assignedVehicle ?? null,

      recentShipments,
    });
  } catch (error) {
    console.error("Driver dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch driver dashboard data",
    });
  }
};

// GET MY ASSIGNED SHIPMENTS
export const getMyShipments: RequestHandler = async (req, res) => {
  try {
    const driverId = res.locals.authUser?.userId;

    if (!driverId) {
      res.status(401).json({
        success: false,
        message: "Driver authentication required",
      });
      return;
    }

    const shipments = await shipmentModel
      .find({ assignedDriver: driverId })
      .populate("customer", "name email phone")
      .populate(
        "assignedVehicle",
        "registrationNumber vehicleType capacity volumeCapacity status"
      )
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: shipments.length,
      shipments,
    });
  } catch (error) {
    console.error("Get driver shipments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch assigned shipments",
    });
  }
};

// UPDATE DRIVER LIVE LOCATION
export const updateDriverLocation: RequestHandler = async (req, res) => {
  try {
    const driverId = res.locals.authUser?.userId;
    const { lat, lng } = req.body;

    if (!driverId) {
      res.status(401).json({
        success: false,
        message: "Driver authentication required",
      });
      return;
    }

    // Validate GPS coordinates
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required",
      });
      return;
    }

    // Find the logged-in driver's profile
    const driver = await DriverModel.findOne({ user: driverId });

    if (!driver) {
      res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
      return;
    }

    // Update current GPS location
    driver.currentLocation = {
      lat,
      lng,
      updatedAt: new Date(),
    };

    await driver.save();


    // Find the driver's active shipment
    const activeShipment = await shipmentModel.findOne({
      assignedDriver: driverId,
      status: { $in: ["assigned", "picked-up", "in-transit"] },
    });

    // Save GPS history linked to the shipment and vehicle
    if (activeShipment && activeShipment.assignedVehicle) {
      await vehicleLocationModel.create({
        vehicle: activeShipment.assignedVehicle,
        driver: driverId,
        shipment: activeShipment._id,
        latitude: lat,
        longitude: lng,
        recordedAt: new Date(),
      });
    }


    res.status(200).json({
      success: true,
      message: "Driver location updated successfully",
      currentLocation: driver.currentLocation,
    });
  } catch (error) {
    console.error("Update driver location error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update driver location",
    });
  }
};

export const getAllDriverLocations: RequestHandler = async (req, res) => {
  try {
    const drivers = await DriverModel.find()
      .populate("user", "name email")
      .select("user currentLocation availabilityStatus");

    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (error) {
    console.error("Get driver locations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch driver locations",
    });
  }
};

export const getMyDriverLocation: RequestHandler = async (req, res) => {
  try {
    const userId = res.locals.authUser?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Driver authentication required",
      });
      return;
    }

    const driver = await DriverModel.findOne({ user: userId })
      .select("currentLocation");

    if (!driver) {
      res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      currentLocation: driver.currentLocation,
    });
  } catch (error) {
    console.error("Get driver location error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch driver location",
    });
  }
};

export const getMyDriverProfile: RequestHandler = async (req, res) => {
  try {
    const userId = res.locals.authUser?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Driver authentication required",
      });
      return;
    }

    const driver = await DriverModel.findOne({ user: userId })
      .populate("user", "name email role");

    if (!driver) {
      res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      driver,
    });
  } catch (error) {
    console.error("Get driver profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch driver profile",
    });
  }
};