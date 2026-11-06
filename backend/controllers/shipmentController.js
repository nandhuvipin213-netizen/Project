import shipmentModel from "../models/shipment.js";
import UserModel from "../models/user.js";
import VehicleModel from "../models/vehicle.js";
import vehicleLocationModel from "../models/vehicleLocation.js";
export const createShipment = async (req, res) => {
    try {
        const { pickupAddress, deliveryAddress, goodsType, weight, volume, isFragile, } = req.body;
        const customerId = res.locals.authUser.userId;
        const shipment = await shipmentModel.create({
            customer: customerId,
            pickupAddress,
            deliveryAddress,
            goodsType,
            weight,
            volume,
            isFragile,
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
    }
    catch (error) {
        console.error("Create shipment error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create shipment",
        });
    }
};
export const getsShipment = async (req, res) => {
    try {
        const authUser = res.locals.authUser;
        let shipments;
        if (authUser.role === "admin") {
            shipments = await shipmentModel.find()
                .populate("customer", "name email")
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
    }
    catch (error) {
        console.error("Get shipments error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve shipments",
        });
    }
};
export const updateShipmentStatus = async (req, res) => {
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
        const shipment = await shipmentModel.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
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
    }
    catch (error) {
        console.error("Update shipment status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update shipment status",
        });
    }
};
export const assignShipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverId, vehicleId } = req.body;
        const driver = await UserModel.findOne({
            _id: driverId,
            role: "driver",
            isActive: true,
        });
        if (!driver) {
            res.status(404).json({
                success: false,
                message: "Active driver not found",
            });
            return;
        }
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
        const shipment = await shipmentModel.findById(id);
        if (!shipment) {
            res.status(404).json({
                success: false,
                message: "Shipment not found",
            });
            return;
        }
        shipment.assignedDriver = driver._id;
        shipment.assignedVehicle = vehicle._id;
        shipment.status = "assigned";
        shipment.statusHistory.push({
            status: "assigned",
            updatedBy: res.locals.authUser.userId,
        });
        await shipment.save();
        vehicle.status = "in-use";
        await vehicle.save();
        res.status(200).json({
            success: true,
            message: "Driver and vehicle assigned successfully",
            shipment,
        });
    }
    catch (error) {
        console.error("Assign shipment error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to assign driver and vehicle",
        });
    }
};
export const getDriverShipments = async (req, res) => {
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
    }
    catch (error) {
        console.error("Get driver shipments error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve driver shipments",
        });
    }
};
export const updateDriverShipmentStatus = async (req, res) => {
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
        const allowedTransitions = {
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
        if (status === "delivered" && shipment.assignedVehicle) {
            await VehicleModel.findByIdAndUpdate(shipment.assignedVehicle, { status: "available" });
        }
        res.status(200).json({
            success: true,
            message: "Delivery status updated successfully",
            shipment,
        });
    }
    catch (error) {
        console.error("Driver status update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update delivery status",
        });
    }
};
export const getShipmentTracking = async (req, res) => {
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
    }
    catch (error) {
        console.error("Shipment tracking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve shipment tracking details",
        });
    }
};
//# sourceMappingURL=shipmentController.js.map