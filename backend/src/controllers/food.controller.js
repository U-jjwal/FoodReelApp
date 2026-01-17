import { Food } from "../models/food.model.js";
import { v4 as uuid } from "uuid";
import storageService from "../services/storage.service.js";
import fs from "fs";
import { Like } from "../models/like.model.js";
import { saveModel } from "../models/save.model.js";

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

export const likeFood = async (req, res) => {

    const { foodId } = req.body
    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await Like.deleteOne({
            user: user._id,
            food: foodId
        })
        return res.status(200).json({
            message : "Food unliked successfully"
        })
    }

    await Food.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 }
    })

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await Food.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })



    res.status(201).json({
        message: "Food liked successfully",
        like
    })

}

export const saveFood = async (req, res) => {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
         })
    }

    return res.status(200).json({
        message: "Food unsaved successfully"
    })
    
}