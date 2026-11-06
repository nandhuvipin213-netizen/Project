import { Schema, type InferSchemaType } from "mongoose";
declare const shipmentSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps" | "versionKey"> & {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type Shipment = InferSchemaType<typeof shipmentSchema>;
declare const shipmentModel: import("mongoose").Model<{
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: false;
}, {
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps" | "versionKey"> & {
    timestamps: true;
    versionKey: false;
}> & Omit<{
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    customer: import("mongoose").Types.ObjectId;
    assignedDriver?: import("mongoose").Types.ObjectId | null;
    assignedVehicle?: import("mongoose").Types.ObjectId | null;
    pickupAddress: string;
    deliveryAddress: string;
    goodsType: string;
    weight: number;
    volume: number;
    isFragile: boolean;
    status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
    statusHistory: import("mongoose").Types.DocumentArray<{
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }, {}, {}> & {
        status: "assigned" | "cancelled" | "delivered" | "in-transit" | "pending" | "picked-up";
        changedAt: NativeDate;
        updatedBy?: import("mongoose").Types.ObjectId | null;
    }>;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & Required<{
    _id: import("mongoose").Types.ObjectId;
}>>;
export default shipmentModel;
//# sourceMappingURL=shipment.d.ts.map