import express from "express";
import { Router } from "express";
import { authenticateFoodPartner } from "../middlewares/auth.middleware";
import {createFood } from "../controllers/food.controller.js";
import multer from "multer";
const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
})

// food routes will be added here in future
router.route('/').post(authenticateFoodPartner, upload.single("video"), createFood)


export default router; 