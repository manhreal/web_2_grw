// middleware/rateLimit.js

import rateLimit from "express-rate-limit";

// Create a rate limiter middleware
export const createRateLimiter = (maxRequests = 10, windowMs = 60 * 1000) => {
    return rateLimit({
        windowMs, // 1 minute
        max: maxRequests, // limit each IP to 10 (default) requests per windowMs
        message: {
            success: false,
            message: 'Too many requests. Please try again after 1 minute.'
        },
        standardHeaders: true, // turn on new headers
        legacyHeaders: false, // turn off deprecated headers
        keyGenerator: (req) => { // custom key generator
            return `${req.ip}-${req.originalUrl}`;
        }
    });
};