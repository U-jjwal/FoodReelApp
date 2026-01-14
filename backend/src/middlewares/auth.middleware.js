import { FoodPartner } from "../models/foodpartner.model.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authenticateFoodPartner = async (req, res, next) => {
    try {
        
    const token = req.cookies.token;

    if(!token) return res.status(401).json({ message: "Unauthorized: No token provided"})

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            

            const foodPartner = await FoodPartner.findById(decoded.FoodPartnerId)
            console.log("Authenticated Food Partner:", foodPartner);
            
            if(!foodPartner) {
                return res.status(401).json({ message: "Unauthorized: Food Partner not found"});
            }
            
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

export const authenticateUser = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        if(!token) return res.status(401).json({ message: "Unauthorized: No token provided"})

            try {

                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                const user = await User.findById(decoded.userId);

                // console.log("Authenticated User:", decoded);

                if(!user) return res.status(401).json({ message: "Unauthorized: User not found"});

                req.user = user;

                next();
                
            } catch (error) {
                console.log("Error in user authentication middleware inner try:", error);
                return res.status(401).json({ message: "Unauthorized: Invalid token"});
            }
        
    } catch (error) {
        console.log("Error in user authentication middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}