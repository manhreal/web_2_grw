import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import admin from "./firebaseAdmin.js";
import teacherRoutes from "./routes/teachers.js";
import userRoutes from "./routes/users.js";
import User from "./models/userModel.js";
import testFreeRouter from "./routes/testFree.js";
import rateLimit from 'express-rate-limit';
import coursesRoutes from './routes/courses.js';
import studentsRoutes from './routes/students.js';
import newsRoutes from './routes/news.js';
import partnersRoutes from './routes/partners.js';
import bannersRoutes from './routes/banners.js';
import advisingRoutes from './routes/advising.js';
import userTestRoutes from "./routes/userTest.js";
import axios from 'axios'; 

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;
const RECAPTCHA = process.env.RECAPTCHA_SECRET_KEY;

const loginRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 2, // limit each IP to 2 requests per windowMs
    message: {
        error: "rate_limit_exceeded",
        message: "Too many login request. Please try again after 2 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://realvn.top', 'http://realvn.top'],
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
// MongoDB connection
mongoose
    .connect(process.env.ATLAS_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// reCAPTCHA middleware
const verifyRecaptchaToken = async (token) => {
    if (!token) return false;

    try {
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: RECAPTCHA,
                    response: token
                }
            }
        );

        return response.data.success;
    } catch (error) {
        console.error('Error while verify ReCaptcha', error);
        return false;
    }
};

// Login with google account and verify reCAPTCHA, then save token to cookie
app.post("/auth/google", loginRateLimiter, async (req, res) => {
    try {
        const { idToken, recaptchaToken } = req.body; // get token from client
        // verify reCAPTCHA
        const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken);
        if (!isRecaptchaValid) {
            return res.status(400).json({
                error: "invalid_recaptcha",
                message: "Xác thực reCAPTCHA không hợp lệ. Vui lòng thử lại."
            });
        }

        // Verify token with firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name } = decodedToken;

        // Check if user exists in mongoDB
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ uid, email, name });
            await user.save();
        }

        // Save token to cookie HttpOnly
        res.cookie("token", idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
            sameSite: "strict",
        });

        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login error:", error);

        // Check if the error is due to rate limiting
        if (error.message && error.message.includes('rate limit')) {
            return res.status(429).json({
                error: "rate_limit_exceeded",
                message: "You have exceeded the maximum number of login attempts. Please try again after 1 minute.",
            });
        }

        res.status(500).json({
            error: "server_error",
            message: "An error occurred while logging in. Please try again later.",
        });
    }
});


// Route default
app.get("/", (req, res) => {
    res.send("API is running !");
});

app.use("/teachers", teacherRoutes);
app.use("/users", userRoutes);
app.use("/testFree", testFreeRouter);
app.use('/courses', coursesRoutes);
app.use('/students', studentsRoutes);
app.use('/news', newsRoutes);
app.use('/partners', partnersRoutes);
app.use('/banners', bannersRoutes);
app.use('/advising', advisingRoutes);
app.use('/userTest', userTestRoutes);

// Run server
app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});