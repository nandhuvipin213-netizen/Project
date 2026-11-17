
import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 250,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      required: [
        function (this: { role?: string; googleId?: string }) {
          return this.role !== "admin" && !this.googleId;
        },
        "phone is required",
      ],
    },

    passwordHash: {
      type: String,
      select: false,
      required: [
        function (this: { googleId?: string }) {
          return !this.googleId;
        },
        "password Hash is required",
      ],
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["admin", "driver", "customer"],
      default: "customer",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    // Password reset OTP fields
    resetOtpHash: {
      type: String,
      select: false,
    },

    resetOtpExpiresAt: {
      type: Date,
    },

    resetOtpAttempts: {
      type: Number,
      default: 0,
    },

    resetOtpLastSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type User = InferSchemaType<typeof userSchema>;

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
