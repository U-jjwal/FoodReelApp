import express from "express";
import { Router } from "express";
import { registerUser, loginUser, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner} from "../controllers/auth.controller.js";

const router = Router();

// user authentication routes
router.route('/user/register').post(registerUser);
router.route('/user/login').post(loginUser);
router.route('/user/logout').post(logoutUser);

// FoodPartner authentication routes
router.route('/foodpartner/register').post(registerFoodPartner);
router.route('/foodpartner/login').post(loginFoodPartner);
router.route('/foodpartner/logout').post(logoutFoodPartner);

export default router;