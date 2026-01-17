import express from "express";
import { Router } from "express";
import { getFoodPartnerById } from "../controllers/food-partner.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
const app = express()
const router = Router()







// GET /api/food/food-partner/:id
router.route('/food-partner/:id').get(authenticateUser, getFoodPartnerById)


export default router