import Food from "../models/food.model.js";

export const createFood = async (req, res) => {
    try {
        
      
        
    } catch (error) {
        console.error("Error in creating food item:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}