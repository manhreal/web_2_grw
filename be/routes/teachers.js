// routes/teachers.js

import express from 'express';
import {
    getTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    uploadTeacherImage
} from '../controllers/teacherController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import { cacheMiddleware } from '../middlewares/cache.js';

import { createRateLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();
const limiter = createRateLimiter(20);

router.get('/', limiter, cacheMiddleware('teachers'), getTeachers);

router.get('/:id', getTeacher);

router.post('/', verifyAdmin, createTeacher);

router.put('/:id', verifyAdmin, updateTeacher);

router.delete('/:id', verifyAdmin, deleteTeacher);

router.post('/upload', verifyAdmin, uploadTeacherImage);

export default router;