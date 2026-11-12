import type { RequestHandler } from "express";
import vehicleLocationModel from "../models/vehicleLocation.js";
import VehicleModel from "../models/vehicle.js";
import shipmentModel from "../models/shipment.js";
import { isValidObjectId } from "mongoose";
import UserModel from "../models/user.js";

export const updateVehicleLocation: RequestHandler = async (req, res) => {
    try {
        const driverId = res.locals.authUser.userId;

        const { vehicleId, shipmentId, latitude, longitude, accuracy, speed, heading } = req.body

        if (!vehicleId || !shipmentId ||
            latitude === undefined ||
            longitude === undefined
        ) {
            res.status(400).json({
                success: false,
                message: "Vehicle ID, shipment ID, latitude and longitude are required"
            })
            return;
        }

        if (!isValidObjectId(vehicleId) || !isValidObjectId(shipmentId)) {
            res.status(400).json({
                success: false,
                message: "Invalid vehicle ID or shipment ID"

            })
            return;
        }

        if (typeof latitude !== "number" ||
            typeof longitude !== "number"||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ){
            res.status(400).json({
                success: false,
                message: "Invalid latitude or longitude"
            });
            return
        }

         const vehicle = await VehicleModel.findOne({
      _id: vehicleId,
      isActive: true,
      status: "in-use",
    });

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: "Active vehicle not found or vehicle is not in use",
      });
      return;
    }

    const shipment = await shipmentModel.findOne({
      _id: shipmentId,
      assignedDriver: driverId,
      assignedVehicle: vehicleId,
      status: { $in: ["assigned", "picked-up", "in-transit"] },
    });

    if (!shipment) {
      res.status(403).json({
        success: false,
        message: "You are not assigned to this shipment and vehicle",
      });
      return;
    }
    const location = await vehicleLocationModel.create({
      vehicle: vehicleId,
      driver: driverId,
      shipment: shipmentId,
      latitude,
      longitude,
      accuracy,
      speed,
      heading,
      recordedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Vehicle location updated successfully",
      location,
    });

  } catch (error) {
    console.error("Vehicle location update error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update vehicle location",
    });
  }
}  



export const getLatestVehicleLocations: RequestHandler = async (
    req,
    res
) => {
    try {
        // Find all active vehicles currently in use
        const vehicles = await VehicleModel.find({
            isActive: true,
            status: "in-use",
        });

        // Get the latest GPS location for each vehicle
        const locations = await Promise.all(
            vehicles.map(async (vehicle) => {
                return await vehicleLocationModel
                    .findOne({ vehicle: vehicle._id })
                    .sort({ recordedAt: -1 })
                    .populate("vehicle", "registrationNumber vehicleType")
                    .populate("driver", "name email phone")
                    .populate(
                        "shipment",
                        "status pickupAddress deliveryAddress"
                    );
            })
        );

        // Remove vehicles that have no GPS location yet
        const activeLocations = locations.filter(
            (location) => location !== null
        );

        res.status(200).json({
            success: true,
            count: activeLocations.length,
            locations: activeLocations,
        });

    } catch (error) {
        console.error("Get vehicle locations error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch vehicle locations",
        });
    }
};
