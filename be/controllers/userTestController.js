// controllers/userTestController.js

import UserTest from "../models/userTest.js";

// Register a new user test
export const registerUserTest = async (req, res) => {
    try {
        const { fullName, email, phone, address } = req.body;
        const existingUser = await UserTest.findOne({ email });

        if (existingUser) {
            existingUser.fullName = fullName;
            existingUser.phone = phone;
            existingUser.address = address;

            await existingUser.save();
            return res.status(200).json({ userId: existingUser._id, message: 'User test info updated' });
        }
        const newUser = new UserTest({
            fullName,
            email,
            phone,
            address
        });

        await newUser.save();

        res.status(201).json({ userId: newUser._id, message: 'User test registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user test', error });
    }
};

export const saveTestResult = async (req, res) => {
    try {
        const { email, testId, score, totalQuestions, timeTaken } = req.body;
        const user = await UserTest.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const percentage = Math.round((score / totalQuestions) * 100);
        const existingTests = user.testHistory.filter(test =>
            test.totalQuestions === totalQuestions
        );

        if (existingTests.length === 0) {
            const newTest = {
                testId,
                score,
                totalQuestions,
                percentage,
                timeTaken,
                submittedAt: new Date()
            };

            user.testHistory.push(newTest);
            await user.save();
            return res.status(200).json({
                message: 'Test result saved successfully',
                savedTest: newTest
            });
        }

        // Find the best existing test
        let bestExistingTest = existingTests[0];
        for (let i = 1; i < existingTests.length; i++) {
            if (existingTests[i].score > bestExistingTest.score ||
                (existingTests[i].score === bestExistingTest.score &&
                    existingTests[i].timeTaken < bestExistingTest.timeTaken)) {
                bestExistingTest = existingTests[i];
            }
        }

        // Compare the new test result with the best existing test
        if (score > bestExistingTest.score ||
            (score === bestExistingTest.score && timeTaken < bestExistingTest.timeTaken)) {
            // Update the best existing test with the new result
            bestExistingTest.score = score;
            bestExistingTest.percentage = percentage;
            bestExistingTest.timeTaken = timeTaken;
            bestExistingTest.submittedAt = new Date();
            if (testId && !bestExistingTest.testId) {
                bestExistingTest.testId = testId;
            }

            await user.save();
            return res.status(200).json({
                message: 'Test result updated successfully',
                updatedTest: bestExistingTest
            });
        }

        // If no update is needed
        return res.status(200).json({
            message: 'No update needed as current result is not better',
            currentBest: bestExistingTest,
            newResult: { score, totalQuestions, percentage, timeTaken }
        });

    } catch (error) {
        console.error('Error in saveTestResult:', error);
        res.status(500).json({ message: 'Error saving test result', error: error.message });
    }
};

// Get top users
export const getTopUsers = async (req, res) => {
    try {
        const users = await UserTest.aggregate([
            {
                $match: {
                    "testHistory.percentage": { $exists: true }
                }
            },
            { $unwind: "$testHistory" },
            { $match: { "testHistory.percentage": { $exists: true } } },
            {
                $group: {
                    _id: "$email",
                    userId: { $first: "$_id" },
                    fullName: { $first: "$fullName" },
                    bestResult: { $max: "$testHistory.percentage" },
                    testHistory: { $push: "$testHistory" }
                }
            },
            { $sort: { bestResult: -1 } },
            { $limit: 5 },
            {
                $project: {
                    userId: 1,
                    email: "$_id",
                    fullName: 1,
                    bestResult: 1,
                    bestScore: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$testHistory",
                                    as: "test",
                                    cond: { $eq: ["$$test.percentage", "$bestResult"] }
                                }
                            },
                            0
                        ]
                    }
                }
            }
        ]);

        const formattedTopUsers = users.map(user => ({
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            bestScore: user.bestScore.score,
            totalQuestions: user.bestScore.totalQuestions,
            percentage: user.bestScore.percentage,
            timeTaken: user.bestScore.timeTaken,
            submittedAt: user.bestScore.submittedAt
        }));
        return res.sendProfileCache(formattedTopUsers);



    } catch (error) {
        res.status(500).json({
            message: 'Error fetching top users',
            error: error.message
        });
    }
};

// Get user test data by email
export const getUserTestByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const userTest = await UserTest.findOne({ email });

        if (!userTest) {
            return res.status(404).json({ message: 'User test data not found' });
        }

        res.status(200).json({ userTest });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user test data', error });
    }
};

// Get all test users
export const getAllTestUsers = async (req, res) => {
    try {
        const users = await UserTest.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all test users', error: error.message });
    }
};

// Get user test statistics
export const getUserTestStats = async (req, res) => {
    try {
        const totalUsers = await UserTest.countDocuments();
        const usersWithTests = await UserTest.countDocuments({ "testHistory.0": { $exists: true } });

        // Calculate average percentage across all tests
        const result = await UserTest.aggregate([
            { $unwind: "$testHistory" },
            {
                $group: {
                    _id: null,
                    avgPercentage: { $avg: "$testHistory.percentage" },
                    avgTimeTaken: { $avg: "$testHistory.timeTaken" }
                }
            }
        ]);

        const stats = {
            totalUsers,
            usersWithTests,
            testsTaken: 0,
            avgPercentage: 0,
            avgTimeTaken: 0
        };

        if (result.length > 0) {
            stats.avgPercentage = Math.round(result[0].avgPercentage * 10) / 10; 
            stats.avgTimeTaken = Math.round(result[0].avgTimeTaken);
        }

        // Count total tests taken
        const testCountResult = await UserTest.aggregate([
            { $unwind: "$testHistory" },
            { $count: "testCount" }
        ]);

        if (testCountResult.length > 0) {
            stats.testsTaken = testCountResult[0].testCount;
        }

        res.status(200).json({ stats });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching test statistics', error: error.message });
    }
};