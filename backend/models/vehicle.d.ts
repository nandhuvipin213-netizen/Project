import { Schema } from "mongoose";
import type { InferSchemaType } from "mongoose";
declare const vehicleSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps" | "versionKey"> & {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type Vehicle = InferSchemaType<typeof vehicleSchema>;
declare const VehicleModel: import("mongoose").Model<{
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps" | "versionKey"> & {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
    volumeCapacity: number;
    status: string;
    isActive: boolean;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & Required<{
    _id: import("mongoose").Types.ObjectId;
}>>;
export default VehicleModel;
//# sourceMappingURL=vehicle.d.ts.map