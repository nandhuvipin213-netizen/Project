import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minlength: 2,
        maxlength: 80
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 250
    },
    phone: {
        type: String,
        required: [true, "phone is required"],
        trim: true,
        maxlength: 20
    },
    passwordHash: {
        type: String,
        required: [true, "password Hash is required"],
        select: false
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
}, {
    timestamps: true,
    versionKey: false,
});
const UserModel = model("User", userSchema);
export default UserModel;
//# sourceMappingURL=user.js.map