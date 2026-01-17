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
    try {
        const { foodId } = req.body;
        const user = req.user;

        const isAlreadyLiked = await Like.findOne({
            user: user._id,
            food: foodId
        });

        if (isAlreadyLiked) {
            await Like.deleteOne({ user: user._id, food: foodId });
            await Food.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });
            return res.status(200).json({ message: "Food unliked", like: false });
        }

        await Like.create({ user: user._id, food: foodId });
        await Food.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

        res.status(201).json({ message: "Food liked", like: true });
    } catch (error) {
        console.error("Error liking food:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// Add this temporarily to fix your database
export const fixLikeCounts = async (req, res) => {
    try {
        // Set ALL food items' likeCount to 0
        await Food.updateMany({}, { $set: { likeCount: 0 } });
        
        // Optional: Delete all likes to start completely fresh
        await Like.deleteMany({}); 

        res.json({ message: "All like counts reset to 0 and history cleared." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const saveFood = async (req, res) => {
  try {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
      user: user._id,
      food: foodId
    });

    // UNSAVE
    if (isAlreadySaved) {
      await saveModel.deleteOne({
        user: user._id,
        food: foodId
      });

      const food = await Food.findByIdAndUpdate(
        foodId,
        { $inc: { saveCount: -1 } },
        { new: true }
      );

      return res.status(200).json({
        isSaved: false,
        saveCount: food.saveCount
      });
    }

    // SAVE
    await saveModel.create({
      user: user._id,
      food: foodId
    });

    const food = await Food.findByIdAndUpdate(
      foodId,
      { $inc: { saveCount: 1 } },
      { new: true }
    );

    return res.status(200).json({
      isSaved: true,
      saveCount: food.saveCount
    });

  } catch (error) {
    console.error("Error saving food:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getSaveFood = async (req, res) => {
    try {
        const user = req.user; // Define user from request
        const saveFoods = await saveModel.find({ user: user._id }).populate('food');

        if (!saveFoods) {
            return res.status(200).json({ message: "No saved foods", saveFoods: [] });
        }

        res.status(200).json({ message: "Saved foods retrieved", saveFoods });
    } catch (error) {
        console.error("Error fetching saved foods:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const clearAllSavedFoods = async (req, res) => {
  try {
    const user = req.user;

    // get all saved foods of user
    const savedFoods = await saveModel.find({ user: user._id });

    if (!savedFoods.length) {
      return res.status(200).json({
        message: "No saved foods to clear",
      });
    }

    // decrease saveCount for each food
    const foodIds = savedFoods.map((s) => s.food);

    await Food.updateMany(
      { _id: { $in: foodIds } },
      { $inc: { saveCount: -1 } }
    );

    // delete all saved records
    await saveModel.deleteMany({ user: user._id });

    return res.status(200).json({
      message: "All saved foods cleared successfully",
    });

  } catch (error) {
    console.error("Clear saved error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
