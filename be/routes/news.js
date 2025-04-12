// routes/news.js

import express from 'express';
import {
    getAllNews,
    getNews,
    createNews,
    updateNews,
    deleteNews,
    uploadNewsImage
} from '../controllers/newController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import { createRateLimiter } from '../middlewares/rateLimit.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();
const limiter = createRateLimiter(10);

router.get('/', limiter, cacheMiddleware('news'), getAllNews);

router.get('/:id', getNews);

router.post('/', verifyAdmin, createNews);

router.put('/:id', verifyAdmin, updateNews);

router.delete('/:id', verifyAdmin, deleteNews);

router.post('/upload', verifyAdmin, uploadNewsImage);

export default router;