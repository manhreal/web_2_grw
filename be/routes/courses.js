// routes/courses.js

import express from 'express';
import {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadCourseImage
} from '../controllers/courseController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import { createRateLimiter } from '../middlewares/rateLimit.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();
const limiter = createRateLimiter(10);

router.get('/', limiter, cacheMiddleware('courses'), getCourses);

router.get('/:id', getCourse);

router.post('/', verifyAdmin, createCourse);

router.put('/:id', verifyAdmin, updateCourse);

router.delete('/:id', verifyAdmin, deleteCourse);

router.post('/upload', verifyAdmin, uploadCourseImage);

export default router;