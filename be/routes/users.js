// routes/users.js

import express from "express";
import { googleLogin, getUserProfile, logout } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js"; 
import { cacheMiddlewareProfile } from "../middlewares/cache.js";

const router = express.Router();

router.post("/auth/google", googleLogin);

router.get("/profile", verifyToken, cacheMiddlewareProfile(), getUserProfile);

router.post("/logout", logout);

export default router;
