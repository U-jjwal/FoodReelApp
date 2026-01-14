import mongoose from "mongoose";
import { FoodPartner } from "./foodpartner.model";

const foodSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
    },
    FoodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodPartner"
    }
}) 

export const Food = mongoose.model('Food', foodSchema);