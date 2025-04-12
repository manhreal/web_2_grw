// routes/partners.js

import express from 'express';
import {
    getPartners,
    getPartner,
    createPartner,
    updatePartner,
    deletePartner,
    uploadPartnerImage
} from '../controllers/partnerController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import { createRateLimiter } from '../middlewares/rateLimit.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();
const limiter = createRateLimiter(10);

router.get('/', limiter, cacheMiddleware('partners'), getPartners);

router.get('/:id', getPartner);

router.post('/', verifyAdmin, createPartner);

router.put('/:id', verifyAdmin, updatePartner);

router.delete('/:id', verifyAdmin, deletePartner);

router.post('/upload', verifyAdmin, uploadPartnerImage);

export default router;
