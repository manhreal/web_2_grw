// api/testFree.ts

import { SERVER_URL } from "./server_url";

// TestOption interface
export interface TestOption {
    _id: string;
    text: string;
    underlinedIndexes?: number[];
}

// TestQuestion interface
export interface TestQuestion {
    _id: string;
    id: string;
    type: 'pronunciation' | 'stress' | 'fill_in_blank' | 'error_identification' | 'reading_comprehension';
    questionText: string;
    options: TestOption[];
    correctAnswer?: string;
    underlinedIndexes?: number[][];
}

// FreeTest interface
export interface FreeTest {
    _id: string;
    title: string;
    readingPassage?: string;
    questions: TestQuestion[];
}

// Function to fetch a free test
export async function getFreeTest(): Promise<FreeTest> {
    try {
        const response = await fetch(`${SERVER_URL}/testFree/67e79f28f9e4c1541848651a`);

        if (!response.ok) {
            throw new Error('Failed to fetch test');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching test:', error);
        throw error;
    }
}
