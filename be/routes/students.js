// routes/students.js

import express from 'express';
import {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    uploadImage
} from '../controllers/studentController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import { createRateLimiter } from '../middlewares/rateLimit.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();
const limiter = createRateLimiter(10);

router.get('/', limiter, cacheMiddleware('students'), getStudents);

router.get('/:id', getStudent);

router.post('/', verifyAdmin, createStudent);

router.put('/:id', verifyAdmin, updateStudent);

router.delete('/:id', verifyAdmin, deleteStudent);

router.post('/upload', verifyAdmin, uploadImage);

export default router;