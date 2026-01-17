import express from "express";
import { Router } from "express";
import { authenticateFoodPartner, authenticateUser } from "../middlewares/auth.middleware.js";
import {clearAllSavedFoods, createFood, fixLikeCounts, getFoodItems, getSaveFood, likeFood, saveFood } from "../controllers/food.controller.js";
import multer from "multer";

const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  })
});

// food routes will be added here in future
router.route('/').post(authenticateFoodPartner, upload.single("video"), createFood)

router.route('/').get(authenticateUser, getFoodItems);

router.route('/like').post(authenticateUser,likeFood)

router.route('/save').post(authenticateUser,saveFood)

router.get('/fix-data', fixLikeCounts);

router.route('/save').get(authenticateUser,getSaveFood)

router.delete(
  "/save/clear",
  authenticateUser,
  clearAllSavedFoods
);


export default router; 