import { User } from "../models/user.model.js";
import { FoodPartner } from "../models/foodpartner.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if(!fullName || !email || !password) return res.status(400).json({ message: "All fields are required" });
        
        //check if user already exists
        const userAlreadyExists = await User.findOne({ email });
        if(userAlreadyExists){
            return res.status(400).json({ message: "User already exists" });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // create new user
        const newUser = await User.create({fullName, email, password: hashedPassword});
        
        const token = jwt.sign({
            userId: newUser._id,
        }, process.env.JWT_SECRET);

        res.cookie("token", token);

        return res.status(201).json({
            message: "User registered successfully",
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
        })

    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password ) return res.status(400).json({ message: "All the fields are required"})
        
        const existingUser = await User.findOne({ email });

        if(!existingUser) return res.status(404).json({ message: "User not found"});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password"});

        const token = jwt.sign({
            userId: existingUser._id,
        }, process.env.JWT_SECRET);

        res.cookie("token", token);

        res.status(200).json({
            message: "User logged in successfully",
            _id: existingUser._id,
            email: existingUser.email,
            fullName: existingUser.fullName
        })
        
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
}

export const logoutUser = async (req, res) => {
    try {

        res.clearCookie("token");
        res.status(200).json({message: "User logged out successfully"})


    } catch (error) {
        console.error("Error in user logout:", error);
        res.status(500).json({ message: "Internal Server Error"})
    }
}

//Food Partner Auth Controller

export const registerFoodPartner = async (req, res) => {
    try {

        if (!req.body) {
        return res.status(400).json({ message: "Request body missing" });
        }
        
        const { name, email, password } = req.body;

        if(!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

        const partnerAlreadyExists = await FoodPartner.findOne({ email });

        if(partnerAlreadyExists) return res.status(400).json({ message: "Food Partner already exists"});

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create new food partner
        const newFoodPartner = await FoodPartner.create({ name, email, password: hashedPassword });

        const token = jwt.sign({
            FoodPartnerId: newFoodPartner._id
        }, process.env.JWT_SECRET);

        res.cookie("token", token);

        return res.status(201).json({
            message: "Food Partner registered Successfully",
            _id: newFoodPartner._id,
            name: newFoodPartner.name,
            email: newFoodPartner.email
        })
        
    } catch (error) {
        console.error("Error in food partner registration:", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export const loginFoodPartner = async (req, res) => {
    try {
        
        const {email, password } = req.body;
        
        if(!email || !password) return res.status(400).json({ message: "All fields are requiresd"});

        const existingFoodPartner = await FoodPartner.findOne({ email });

        if(!existingFoodPartner) return res.status(400).json({ message: "Food Partner not found"});

        const isPasswordCorrect = await bcrypt.compare(password, existingFoodPartner.password);

        if(!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password"});   
        
        const token = jwt.sign({
            FoodPartnerId: existingFoodPartner._id
        }, process.env.JWT_SECRET);

        res.cookie("token", token);

        res.status(200).json({
            message: "Food Partner logged in successfully",
            _id: existingFoodPartner._id,
            name: existingFoodPartner.name,
            email: existingFoodPartner.email
        })

    } catch (error) {
        console.error("Error in food partner login:", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export const logoutFoodPartner = async (req, res) => {
    try {
        
        res.clearCookie("token");
        res.status(200).json({ message: "Food Partner logged out successfully"});
        
    } catch (error) {
        console.log("Error in food partner logout:", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}