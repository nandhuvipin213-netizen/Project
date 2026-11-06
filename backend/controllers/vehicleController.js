import VehicleModel from "../models/vehicle.js";
export const createVehicle = async (req, res) => {
    try {
        const { registrationNumber, vehicleType, capacity, volumeCapacity, } = req.body;
        const vehicle = await VehicleModel.create({
            registrationNumber,
            vehicleType,
            capacity,
            volumeCapacity,
        });
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            vehicle,
        });
    }
    catch (error) {
        console.error("Create vehicle error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create vehicle",
        });
    }
};
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await VehicleModel.find();
        res.status(200).json({
            success: true,
            count: vehicles.length,
            vehicles,
        });
    }
    catch (error) {
        console.error("Get vehicles error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch vehicles",
        });
    }
};
export const updatevehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { registrationNumber, vehicleType, capacity, volumeCapacity, status, isActive, } = req.body;
        const vehicle = await VehicleModel.findByIdAndUpdate(id, {
            registrationNumber,
            vehicleType, capacity,
            volumeCapacity, status,
            isActive,
        }, {
            new: true,
            runValidators: true,
        });
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
    }
    catch (error) {
        console.error("Update vehicle error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update vehicle",
        });
    }
};
export const deleteVehicle = async (req, res) => {
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
    }
    catch (error) {
        console.error("Delete vehicle error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete vehicle",
        });
    }
};
//# sourceMappingURL=vehicleController.js.map