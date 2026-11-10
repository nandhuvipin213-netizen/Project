
import { Schema, model } from "mongoose";
import type { InferSchemaType } from "mongoose";

const driverSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    licenseExpiryDate: {
      type: Date,
      required: [true, "License expiry date is required"],
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "on-duty", "off-duty"],
      default: "available",
    },
    currentLocation: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
      updatedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type Driver = InferSchemaType<typeof driverSchema>;

const DriverModel = model("Driver", driverSchema);

export default DriverModel;
