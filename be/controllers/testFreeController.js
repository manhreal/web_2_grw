// controllers/testFreeController.js

import TestFree from '../models/testFree.js';
import mongoose from 'mongoose';
import { clearTestCache } from '../middlewares/cache.js';

export const getFreeTestById = async (req, res) => {
    try {
        const { id } = req.params;

        const test = await TestFree.findById(id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        const transformedTest = {
            _id: test._id,
            title: test.title,
            readingPassage: test.readingPassage,
            questions: test.questions.map(q => {
                const transformedQuestion = {
                    id: q.id,
                    type: q.type,
                    questionText: q.questionText,
                    options: q.options.map(opt => ({
                        id: opt.id,
                        text: opt.text,
                        underlinedIndexes: opt.underlinedIndexes || []
                    })),
                    correctAnswer: q.correctAnswer
                };

                if (q.type === 'error_identification') {
                    if (q.underlinedIndexes && Array.isArray(q.underlinedIndexes)) {
                        transformedQuestion.underlinedIndexes = q.underlinedIndexes;
                    }
                    else {
                        const errorPositions = [];
                        q.options.forEach((opt, index) => {
                            const optionText = opt.text;
                            const startPos = q.questionText.indexOf(optionText);
                            if (startPos !== -1) {
                                errorPositions.push([startPos, startPos + optionText.length - 1]);
                            }
                        });

                        if (errorPositions.length > 0) {
                            transformedQuestion.underlinedIndexes = errorPositions;
                        }
                    }
                }

                return transformedQuestion;
            })
        };

        return res.sendTestCache(transformedTest);

    } catch (error) {
        console.error('Error fetching test:', error);
        return res.status(500).json({ message: 'Failed to fetch test', error: error.message });
    }
};

export const updateQuestionInFreeTest = async (req, res) => {
    try {
        const { id, questionId } = req.params;
        const updatedQuestion = req.body.question;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid test ID' });
        }

        const test = await TestFree.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        const questionIndex = test.questions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) {
            return res.status(404).json({
                message: 'Question not found',
                availableIds: test.questions.map(q => q.id)
            });
        }

        const updatedQuestionData = {
            ...updatedQuestion,
            _id: test.questions[questionIndex]._id 
        };
        test.questions[questionIndex] = updatedQuestionData;
        const options = { runValidators: true, context: 'query' };
        await test.save(options);
        clearTestCache(id);
        return res.status(200).json({
            message: 'Question updated successfully',
            updatedQuestion: updatedQuestionData
        });

    } catch (error) {
        console.error('Detailed error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            errors: error.errors
        });
        return res.status(500).json({
            message: 'Failed to update question',
            error: error.message,
            errorType: error.name
        });
    }
};
export const addQuestionToFreeTest = async (req, res) => {
    try {
        const { id } = req.params;
        const newQuestion = req.body.question;

        // Validate the test ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid test ID' });
        }

        // Find the test
        const test = await TestFree.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if question ID already exists in the test
        const questionExists = test.questions.some(q => q.id === newQuestion.id);
        if (questionExists) {
            return res.status(400).json({
                message: 'Question ID already exists in this test',
                existingIds: test.questions.map(q => q.id)
            });
        }

        // Prepare the question data
        // Create a new mongoose _id for the question document
        const questionData = {
            ...newQuestion,
            _id: new mongoose.Types.ObjectId()
        };

        // Add the new question to the questions array
        test.questions.push(questionData);

        // Save the updated test document
        const options = { runValidators: true, context: 'query' };
        await test.save(options);
        clearTestCache(id);
        return res.status(201).json({
            message: 'Question added successfully',
            addedQuestion: questionData
        });

    } catch (error) {
        console.error('Detailed error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            errors: error.errors
        });

        return res.status(500).json({
            message: 'Failed to add question',
            error: error.message,
            errorType: error.name
        });
    }
};

export const deleteQuestionFromFreeTest = async (req, res) => {
    try {
        const { id, questionId } = req.params;

        // Validate the test ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid test ID' });
        }

        // Find the test
        const test = await TestFree.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Find the index of the question to delete
        const questionIndex = test.questions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) {
            return res.status(404).json({
                message: 'Question not found',
                availableIds: test.questions.map(q => q.id)
            });
        }

        // Remove the question from the array
        test.questions.splice(questionIndex, 1);

        // Save the updated test document
        const options = { runValidators: true, context: 'query' };
        await test.save(options);
        clearTestCache(id);
        return res.status(200).json({
            message: 'Question deleted successfully',
            deletedQuestionId: questionId
        });

    } catch (error) {
        console.error('Detailed error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            errors: error.errors
        });

        return res.status(500).json({
            message: 'Failed to delete question',
            error: error.message,
            errorType: error.name
        });
    }
};

export const updateFreeTestBasicInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, readingPassage } = req.body;

        // Validate the test ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid test ID' });
        }

        // Find the test
        const test = await TestFree.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Update fields if they exist in the request
        if (title !== undefined) {
            test.title = title;
        }

        if (readingPassage !== undefined) {
            test.readingPassage = readingPassage;
        }

        // Save the updated test document
        const options = { runValidators: true, context: 'query' };
        await test.save(options);
        clearTestCache(id);
        return res.status(200).json({
            message: 'Test information updated successfully',
            updatedTest: {
                _id: test._id,
                title: test.title,
                readingPassage: test.readingPassage
            }
        });

    } catch (error) {
        console.error('Detailed error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            errors: error.errors
        });

        return res.status(500).json({
            message: 'Failed to update test information',
            error: error.message,
            errorType: error.name
        });
    }
};