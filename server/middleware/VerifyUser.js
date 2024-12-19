import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.js";
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' }); // Adjust the path to where your .env file is located

export const VerifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1]; // Get the token from 'Bearer <token>'

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
            if (err) {
                return res.status(401).json({ error: "Unauthorized." }); // Token is invalid or expired
            }
            
            try {
                const user = await UserModel.findOne({ _id: payload._id }).select("-password"); // Find user by _id in token payload
                if (!user) {
                    return res.status(404).json({ error: "User not found." }); // Handle case where user is not found
                }
                
                req.user = user; // Attach user info to request object
                next(); // Proceed to next middleware or route handler
            } catch (error) {
                return res.status(500).json({ error: error.message }); // Handle any other errors
            }
        });
    } else {
        return res.status(403).json({ error: "Forbidden" }); // No authorization header provided
    }
};
