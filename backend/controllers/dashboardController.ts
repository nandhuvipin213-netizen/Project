
import type { RequestHandler } from "express";
import VehicleModel from "../models/vehicle.js";
import UserModel from "../models/user.js";
import shipmentModel from "../models/shipment.js";

export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    // Vehicle statistics
    const totalVehicles = await VehicleModel.countDocuments();

    const availableVehicles = await VehicleModel.countDocuments({
      status: "available",
      isActive: true,
    });

    const vehiclesInUse = await VehicleModel.countDocuments({
      status: "in-use",
      isActive: true,
    });

    const vehiclesInMaintenance = await VehicleModel.countDocuments({
      status: "maintenance",
    });

    // Driver statistics
    const totalDrivers = await UserModel.countDocuments({
      role: "driver",
    });

    const activeDrivers = await UserModel.countDocuments({
      role: "driver",
      isActive: true,
    });

    // Shipment statistics
    const totalShipments = await shipmentModel.countDocuments();

    const pendingShipments = await shipmentModel.countDocuments({
      status: "pending",
    });

    const activeDeliveries = await shipmentModel.countDocuments({
      status: { $in: ["picked-up", "in-transit"] },
    });

    const deliveredShipments = await shipmentModel.countDocuments({
      status: "delivered",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalVehicles,
        totalDrivers,
        activeDrivers,
        totalShipments,
        pendingShipments,
        activeDeliveries,
        deliveredShipments,
        fleetAvailability: {
          available: availableVehicles,
          inUse: vehiclesInUse,
          maintenance: vehiclesInMaintenance,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard statistics",
    });
  }
};
