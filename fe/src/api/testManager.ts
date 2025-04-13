// api/testManager.ts

import { SERVER_URL } from "./server_url";

// Option interface
export interface Option {
    text: string;
    underlinedIndexes?: number[];
}

// Question interface
export interface Question {
    id: string;
    type: string;
    questionText: string;
    options: Option[];
    correctAnswer: string;
    underlinedIndexes?: number[][];
}

// FreeTest interface
export interface FreeTest {
    _id: string;
    title: string;
    readingPassage: string;
    questions: Question[];
}

// Function to fetch a test
export async function fetchTest(testId: string): Promise<FreeTest> {
    const response = await fetch(`${SERVER_URL}/testFree/${testId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch test');
    }

    return await response.json();
}

const getRequestHeaders = () => {
    return {
        'Content-Type': 'application/json'
    };
};

// Function to add a question to a test
export async function addQuestion(testId: string, question: Question): Promise<unknown> {
    console.log('Adding question:', question);
    const response = await fetch(`${SERVER_URL}/testFree/${testId}/questions`, {
        method: 'POST',
        headers: getRequestHeaders(),
        credentials: 'include',
        body: JSON.stringify({ question })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to add question');
    }

    return data;
}

// Function to update a question
export async function updateQuestion(testId: string, questionId: string, question: Question): Promise<unknown> {
    console.log('Updating question:', question);
    const response = await fetch(`${SERVER_URL}/testFree/${testId}/questions/${questionId}`, {
        method: 'PUT',
        headers: getRequestHeaders(),
        credentials: 'include',
        body: JSON.stringify({ question })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update question');
    }

    return data;
}

// Function to delete a question
export async function deleteQuestion(testId: string, questionId: string): Promise<unknown> {
    console.log('Deleting question with ID:', questionId);
    const response = await fetch(`${SERVER_URL}/testFree/${testId}/questions/${questionId}`, {
        method: 'DELETE',
        headers: getRequestHeaders(),
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete question');
    }

    return true;
}

// Function to validate a question
export function validateQuestion(question: Question): { valid: boolean; errorMessage?: string } {
    // Check required fields
    if (!question.id) {
        return { valid: false, errorMessage: 'Question ID is required' };
    }

    if (!question.questionText) {
        return { valid: false, errorMessage: 'Question text is required' };
    }

    if (!question.correctAnswer) {
        return { valid: false, errorMessage: 'Correct answer is required' };
    }

    // Check for duplicate options
    const optionTexts = question.options.map(option => option.text);
    const uniqueOptions = new Set(optionTexts.filter(text => text.trim() !== ''));

    if (uniqueOptions.size < optionTexts.filter(text => text.trim() !== '').length) {
        return { valid: false, errorMessage: 'Options must be unique' };
    }

    // Check that at least one option is provided
    if (question.options.length === 0) {
        return { valid: false, errorMessage: 'At least one option is required' };
    }

    // Check that the correct answer is one of the options
    const correctAnswerExists = question.options.some(option => option.text === question.correctAnswer);
    if (!correctAnswerExists) {
        return { valid: false, errorMessage: 'Correct answer must match one of the options' };
    }

    return { valid: true };
}

// Function to update the basic information of a test
export const updateTestBasicInfo = async (testId, updatedInfo) => {
    try {
        const response = await fetch(`${SERVER_URL}/testFree/${testId}/basic-info`, {
            method: 'PATCH',
            headers: getRequestHeaders(),
            credentials: 'include',
            body: JSON.stringify(updatedInfo),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update test information');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating test information:', error);
        throw error;
    }
};