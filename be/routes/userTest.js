// routes/userTest.js

import express from 'express';
import {
    registerUserTest,
    saveTestResult,
    getTopUsers,
    getUserTestByEmail,
    getAllTestUsers,
    getUserTestStats
} from '../controllers/userTestController.js';

const router = express.Router();

router.post('/register', registerUserTest);

router.post('/save-result', saveTestResult);

router.get('/top', getTopUsers);

router.get('/:email', getUserTestByEmail);

router.get('/', getAllTestUsers);

router.get('/stats/overview', getUserTestStats);

export default router;