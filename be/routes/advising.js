// routes/banners.js

import express from 'express';
import {
    getAllAdvisings,
    createAdvising,
    deleteAdvising,
    getAdvisingById
} from '../controllers/advisingController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import { createRateLimiter } from '../middlewares/rateLimit.js';

const limiter = createRateLimiter(2);
const router = express.Router();

router.get('/', verifyAdmin, getAllAdvisings);

router.post('/', limiter, createAdvising);

router.get('/:id', verifyAdmin, getAdvisingById);

router.delete('/:id', verifyAdmin, deleteAdvising);

export default router;
