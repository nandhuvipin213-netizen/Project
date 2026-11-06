import { Schema, model } from "mongoose";
const vehicleSchema = new Schema({
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
        upperCase: true,
        trim: true
    },
    vehicleType: {
        type: String,
        enm: ["truck", "van", "mini-truck", "container"],
        required: true
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
        enm: ["maintanance", "in-use", "available"],
        default: "available"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});
const VehicleModel = model("Vehicle", vehicleSchema);
export default VehicleModel;
//# sourceMappingURL=vehicle.js.map