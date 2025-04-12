// middlewares/authMiddleware.js

import admin from "../firebaseAdmin.js";
import User from '../models/userModel.js';

// Veerify token and set user in request object
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized: No token" });
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; 
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(403).json({ error: "Unauthorized: Invalid token" });
    }
};

// Check if user is admin
export const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        console.log("Token:", token);
        if (!token) {
            return res.status(401).json({ error: "Missing token" });
        }

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            const { uid } = decodedToken;
            const user = await User.findOne({ uid });

            if (!user) {
                return res.status(404).json({ error: "Cannnot find user" });;
            }

            if (user.role !== "admin") {
                return res.status(403).json({ error: "Forbidden: User is not an admin" });
            }
            req.user = user;

            next();
        } catch (error) {
            console.error("Error verify token:", error);
            return res.status(401).json({ error: "Invalid token" });
        }
    } catch (error) {
        console.error("Error while verify admin", error);
        return res.status(500).json({ error: "Server error" });
    }
};