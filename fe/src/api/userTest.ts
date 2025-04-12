// api/userTest.ts

import { SERVER_URL } from "./server_url";

// UserTest interface
export interface UserTest {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
}

// TestResult interface
export interface TestResult {
    email: string;
    score: number;
    totalQuestions: number;
    timeTaken: {
        minutes: number;
        seconds: number;
        totalSeconds: number;
    };
}

// TopPerformer interface
export interface TopPerformer {
    userId: string;
    fullName: string;
    email: string;
    bestScore: number;
    bestPercentage: number;
    timeTaken: number;
    testId: string;
    submittedAt: string;
}

// TestHistoryItem interface
export interface TestHistoryItem {
    _id?: string;
    testId?: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    timeTaken: number; // seconds
    submittedAt: string;
}

// UserTestData interface
export interface UserTestData {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    registeredAt?: string;
    testHistory: TestHistoryItem[];
}

// Function to register a user test
export const registerUserTest = async (userData: UserTest) => {
    const response = await fetch(`${SERVER_URL}/testFree/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        // Check if this is a rate limit error
        if (data && data.message && typeof data.message === 'string' &&
            data.message.includes('Quá nhiều yêu cầu đến')) {
            throw new Error(data.message);
        }
        throw new Error(data.message || 'Failed to register user');
    }

    return data;
};

// Function save test result
export const saveTestResult = async (resultData: TestResult) => {
    const response = await fetch(`${SERVER_URL}/testFree/save-result`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
    });

    if (!response.ok) {
        throw new Error('Failed to save test result');
    }

    return await response.json();
};

// Function to fetch top performers
export const getTopPerformers = async (): Promise<TopPerformer[]> => {
    const response = await fetch(`${SERVER_URL}/testFree/top-test`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch top performers');
    }

    return await response.json();
};

// Function to fetch test history for a specific user by email
export const fetchTestHistory = async (email: string) => {
    const response = await fetch(`${SERVER_URL}/userTest/${email}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user test history');
    }
    const data = await response.json();
    return data;
};

// Function to fetch all test users
export const fetchAllTestUsers = async () => {
    const response = await fetch(`${SERVER_URL}/userTest`);
    if (!response.ok) {
        throw new Error('Failed to fetch test users');
    }
    const data = await response.json();
    return data;
};

// Function to fetch top performing users
export const fetchTopUsers = async () => {
    const response = await fetch(`${SERVER_URL}/userTest/top`);
    if (!response.ok) {
        throw new Error('Failed to fetch top users');
    }
    const data = await response.json();
    return data;
};