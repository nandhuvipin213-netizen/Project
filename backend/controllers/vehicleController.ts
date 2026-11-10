import type { RequestHandler } from "express";
import VehicleModel from "../models/vehicle.js";
import { request } from "express";


export const createVehicle: RequestHandler = async (req, res) => {
  try {
    const { registrationNumber, vehicleType, capacity, volumeCapacity, startingPrice } = req.body;

    const vehicle = await VehicleModel.create({
      registrationNumber,
      vehicleType,
      capacity,
      volumeCapacity,
      startingPrice,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Create vehicle error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create vehicle",
    });
  }
};

export const getVehicles: RequestHandler = async (req, res) => {
  try {
    const vehicles = await VehicleModel.find();

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    console.error("Get vehicles error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
};

export const updatevehicle: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
    registrationNumber,
    vehicleType,
    capacity,
    volumeCapacity,
    startingPrice,
    status,
    isActive,
} = req.body;
const vehicle = await VehicleModel.findByIdAndUpdate(
  id,
  {
    registrationNumber,
    vehicleType,
    capacity,
    volumeCapacity,
    startingPrice, // Add this
    status,
    isActive,
  },
  {
    new: true,
    runValidators: true,
  }
);

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Update vehicle error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
    });
  }
};

export const deleteVehicle: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await VehicleModel.findByIdAndDelete(id);

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
};

