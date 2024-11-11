import express from 'express';
import { UserModel } from '../models/user.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: "../config/.env" });

const Register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
        // Check if the user already exists
        const userExist = await UserModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                errors: [{ msg: 'User already exists' }],
            });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel({ name, email, password: hashPassword });
        const result = await newUser.save();
        
        // Don't include password in the response
        result._doc.password = undefined;
        return res.status(201).json({ success: true, ...result._doc });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

const Login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        // Check if the user exists
        const userExist = await UserModel.findOne({ email });
        if (!userExist) {
            return res.status(400).json({
                errors: [{ msg: 'User not registered' }],
            });
        }

        // Compare password
        const isPasswordOk = await bcrypt.compare(password, userExist.password);
        if (!isPasswordOk) {
            return res.status(400).json({
                errors: [{ msg: "Wrong password" }],
            });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET_KEY, { expiresIn: "3y" });

        // Return user data without password
        const user = { ...userExist._doc, password: undefined };
        return res.status(200).json({ success: true, user, token });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

const Auth=(req,res) =>{
    return res.status(200).json({success:true, user: {...req.user._doc}})
}

export { Register, Login ,Auth};
