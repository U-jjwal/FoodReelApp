import { Food } from "../models/food.model.js";
import { v4 as uuid } from "uuid";
import storageService from "../services/storage.service.js";
import fs from "fs";

export const createFood = async (req, res) => {
    try {
        
        const fileUploadResult = await storageService.uploadFile(req.file.path, uuid());
        fs.unlinkSync(req.file.path);

        const foodData = await Food.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadResult.url,
            foodPartner: req.foodPartner._id
        })

        res.status(201).json({ message: "Food item created successfully",
            food: foodData });

    } catch (error) {
        console.error("Error in creating food item:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getFoodItems = async (req, res) => {
    try {
        const foodItems = await Food.find({})
        res.status(200).json({ message: "Food items fetched successfully",  foodItems });
        
    } catch (error) {
        console.error("Error in fetching food items:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}