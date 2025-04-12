// controllers/userController.js

import admin from "../firebaseAdmin.js"; // Firebase Admin SDK
import User from "../models/userModel.js";

// Login with google account
export const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body; // get token from client
        // Verify token with firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, role } = decodedToken;

        // Check if user exists in mongoDB
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ uid, email, name, role });
            console.log("User created:", user);
            await user.save();
        }

        // Save token to cookie HttpOnly
        res.cookie("token", idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).select("-_id -__v");
        if (!user) {
            console.log('User not found for email:', req.user.email);
            return res.status(404).json({ error: "User not found" });
        }

        return res.sendProfileCache(user);

    } catch (error) {
        console.error("Fetch user error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Logout
export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
};
