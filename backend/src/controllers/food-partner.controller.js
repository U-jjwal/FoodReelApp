import { FoodPartner } from "../models/foodpartner.model.js";
import { Food } from "../models/food.model.js";

export const getFoodPartnerById = async (req, res) => {

    const foodPartnerId = req.params.id;
        
    
    const foodPartner = await FoodPartner.findById(foodPartnerId)
    const fooditemsByFoodPartner = await Food.find({ foodPartner: foodPartnerId })

    if(!foodPartner) return res.status(400).json({ message: "Food partner not found" });
    console.log(foodPartner)
    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner:{
            ...foodPartner.toObject(),
            foodItems: fooditemsByFoodPartner
        }
    });
    
}

