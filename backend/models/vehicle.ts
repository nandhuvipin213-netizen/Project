import { Schema, model } from "mongoose"
import type { InferSchemaType } from "mongoose";

const vehicleSchema = new Schema({
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },

    vehicleType: {
        type: String,
        enum: ["truck", "van", "mini-truck", "container"],
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    volumeCapacity: {
        type: Number,
        required: true,
        min: 0.1
    },
    status: {
        type: String,
        enum: ["maintenance", "in-use", "available"],
        default: "available",
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
}
)

export type Vehicle = InferSchemaType<typeof vehicleSchema>;

const VehicleModel = model("Vehicle", vehicleSchema);

export default VehicleModel;