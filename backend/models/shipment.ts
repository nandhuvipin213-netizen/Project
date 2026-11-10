
import { model, Schema, type InferSchemaType } from "mongoose";

const shipmentSchema = new Schema(
  {
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
      default: null,
      min: 0.1,
    },

    volume: {
      type: Number,
      default: 0,
      min: 0,
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
    goodsDescription: {
      type: String,
      trim: true,
      default: "",
    },
    distanceKm: {
      type: Number,
      default: 0,
      min: 0,
    },

    advanceRatePerKm: {
      type: Number,
      default: 5,
      min: 0,
    },

    advanceAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    advancePaymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    advancePaidAt: {
      type: Date,
      default: null,
    },

    advancePaymentId: {
      type: String,
      default: null,
    },

    packageCount: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    pickupDate: {
      type: Date,
      required: true,
    },

    pickupTime: {
      type: String,
      required: true,
    },
    pickupCoordinates: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },

    deliveryCoordinates: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type Shipment = InferSchemaType<typeof shipmentSchema>;

const shipmentModel = model("shipment", shipmentSchema);

export default shipmentModel;
