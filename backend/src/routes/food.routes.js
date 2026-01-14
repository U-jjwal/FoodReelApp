import express from "express";
import { Router } from "express";
import { authenticateFoodPartner, authenticateUser } from "../middlewares/auth.middleware.js";
import {createFood, getFoodItems } from "../controllers/food.controller.js";
import multer from "multer";
import { get } from "mongoose";
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

export default router; 