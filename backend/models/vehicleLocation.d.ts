import { Schema, type InferSchemaType } from "mongoose";
export declare const vehicleLocationSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps" | "versionKey"> & {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type vehicleLocation = InferSchemaType<typeof vehicleLocationSchema>;
declare const vehicleLocationModel: import("mongoose").Model<{
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps" | "versionKey"> & {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    vehicle: import("mongoose").Types.ObjectId;
    driver: import("mongoose").Types.ObjectId;
    shipment?: import("mongoose").Types.ObjectId | null;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recordedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & Required<{
    _id: import("mongoose").Types.ObjectId;
}>>;
export default vehicleLocationModel;
//# sourceMappingURL=vehicleLocation.d.ts.map