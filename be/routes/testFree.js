// routes/testFree.js

import express from 'express';
import { getFreeTestById, updateQuestionInFreeTest, addQuestionToFreeTest, deleteQuestionFromFreeTest, updateFreeTestBasicInfo } from '../controllers/testFreeController.js';
import { registerUserTest, saveTestResult, getTopUsers, getUserTestByEmail } from '../controllers/userTestController.js'
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import { cacheTestMiddleware, cacheMiddlewareTopUser } from '../middlewares/cache.js';
import { createRateLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();
const limiter = createRateLimiter(2);
const limiter1 = createRateLimiter(20);

router.get('/top-users', limiter1, cacheMiddlewareTopUser(), getTopUsers);

router.get('/:id', cacheTestMiddleware(), getFreeTestById);

router.get('/user-test/:email', getUserTestByEmail);

router.put('/:id/questions/:questionId', verifyAdmin, updateQuestionInFreeTest);

router.post('/:id/questions', verifyAdmin, addQuestionToFreeTest);

router.delete('/:id/questions/:questionId', verifyAdmin, deleteQuestionFromFreeTest);

router.patch('/:id/basic-info', verifyAdmin, updateFreeTestBasicInfo);

router.post('/register', limiter, registerUserTest);

router.post('/save-result', saveTestResult);

export default router;