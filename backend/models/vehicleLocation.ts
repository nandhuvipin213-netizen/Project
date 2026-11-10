import { model, Schema, type InferSchemaType } from "mongoose";


export const vehicleLocationSchema=new Schema({
    vehicle:{
        type:Schema.Types.ObjectId,
        ref:"Vehicle",
        required:true
    },
    driver:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    shipment:{
        type:Schema.Types.ObjectId,
        ref:"Shipment",
        default:null
    },
    latitude:{
        type:Number,
        required:true,
        min:-90,
        max:90
    },
    longitude:{
        type:Number,
        required:true,
        min:-180,
        max:180
    },
    accuracy:{
        type:Number,
        default:null
    },
    speed:{
        type:Number,
        default:null
    },
    heading:{
        type:Number,
        default:null
    },
     recordedAt:{
        type:Date,
        default:Date.now
     }
},{
    timestamps:true,
    versionKey:false
}
);

export type vehicleLocation=InferSchemaType<typeof vehicleLocationSchema>

const vehicleLocationModel= model("vehicleLocation",vehicleLocationSchema)

export default vehicleLocationModel;