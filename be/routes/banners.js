// routes/banners.js

import express from 'express';
import {
    getBanners,
    getBanner,
    createBanner,
    updateBanner,
    deleteBanner,
    uploadBannerImage
} from '../controllers/bannerController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import { createRateLimiter } from '../middlewares/rateLimit.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();
const limiter = createRateLimiter(10);

router.get('/', limiter, cacheMiddleware('banners'), getBanners);

router.get('/:id', getBanner);

router.post('/', verifyAdmin, createBanner);

router.put('/:id', verifyAdmin, updateBanner);

router.delete('/:id', verifyAdmin, deleteBanner);

router.post('/upload', verifyAdmin, uploadBannerImage);

export default router;
