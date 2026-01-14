import { FoodPartner } from "../models/foodpartner.model";
import jwt from "jsonwebtoken";

export const authenticateFoodPartner = async (req, res, next) => {
    try {
        
    const token = req.cookies.token;

    if(!token) return res.status(401).json({ message: "Unauthorized: No token provided"})

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const foodPartner = await FoodPartner.findById(decoded.id)

            req.foodPartner = foodPartner;
            
            next();
            
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized: Invalid token"}); 
        }

    } catch (error) {
        console.log("Error in food partner authentication middleware:", error);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}
