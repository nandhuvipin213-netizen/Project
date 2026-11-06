import mongoose from "mongoose";
import { Schema } from "mongoose";
import type { InferSchemaType } from "mongoose";
declare const userSchema: Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps" | "versionKey"> & {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export type User = InferSchemaType<typeof userSchema>;
declare const UserModel: mongoose.Model<{
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps" | "versionKey"> & {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "admin" | "customer" | "driver";
    isActive: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & Required<{
    _id: mongoose.Types.ObjectId;
}>>;
export default UserModel;
//# sourceMappingURL=user.d.ts.map