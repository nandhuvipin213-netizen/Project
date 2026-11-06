import { model, Schema } from "mongoose";
const shipmentSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignedDriver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    assignedVehicle: {
        type: Schema.Types.ObjectId,
        ref: "Vehicle",
        default: null,
    },
    pickupAddress: {
        type: String,
        required: true,
        trim: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
        trim: true,
    },
    goodsType: {
        type: String,
        required: true,
        trim: true,
    },
    weight: {
        type: Number,
        required: true,
        min: 0.1,
    },
    volume: {
        type: Number,
        required: true,
        min: 0.1,
    },
    isFragile: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: [
            "pending",
            "assigned",
            "picked-up",
            "in-transit",
            "delivered",
            "cancelled",
        ],
        default: "pending",
    },
    statusHistory: [
        {
            status: {
                type: String,
                enum: [
                    "pending",
                    "assigned",
                    "picked-up",
                    "in-transit",
                    "delivered",
                    "cancelled",
                ],
                required: true,
            },
            changedAt: {
                type: Date,
                default: Date.now,
            },
            updatedBy: {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
});
const shipmentModel = model("shipment", shipmentSchema);
export default shipmentModel;
//# sourceMappingURL=shipment.js.map