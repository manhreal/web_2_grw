// models/userTest.js

import mongoose from 'mongoose';

const UserTestSchema = new mongoose.Schema(
    {
        fullName: {
            type: String, required: [true, 'Please add a full name'],
        },
        email: {
            type: String, required: [true, 'Please add a email'], unique: true
        },
        phone: {
            type: String, required: [true, 'Please add a phone number'],
        },
        registeredAt: {
            type: Date, default: Date.now
        },
        address: {
            type: String, required: [true, 'Please add a address'],
        },
        testHistory: [{
            score: Number,
            totalQuestions: Number,
            percentage: Number,
            timeTaken: {
                minutes: Number,
                seconds: Number,
                totalSeconds: Number 
            },
            submittedAt: Date
        }]
    }
);

const UserTest = mongoose.model('UserTest', UserTestSchema);

export default UserTest;