import { Schema, model } from "mongoose";
import type { InferSchemaType } from "mongoose";
const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["shipment", "delivery", "success", "general"],
      default: "general",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type Notification = InferSchemaType<
  typeof notificationSchema
>;

const NotificationModel = model("Notification", notificationSchema);

export default NotificationModel;