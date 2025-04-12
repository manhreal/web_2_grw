// api/advising.ts

import { SERVER_URL } from "./server_url";

// Advising interface
export interface Advising {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
    createdAt?: Date;
    _id?: string;
}

// Helper function to get request headers
const getRequestHeaders = () => {
    return {
        'Content-Type': 'application/json'
    };
};

// Function to get all advisings
export const getAllAdvisings = async (): Promise<{ count: number; data: Advising[] }> => {
    const response = await fetch(`${SERVER_URL}/advising`, {
        method: 'GET',
        headers: getRequestHeaders(),
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Không thể lấy danh sách đơn tư vấn');
    }

    return await response.json();
};

// Function to create an advising
export const createAdvising = async (advisingData: Omit<Advising, '_id' | 'createdAt'>) => {
    const response = await fetch(`${SERVER_URL}/advising`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(advisingData),
    });

    const data = await response.json();

    if (!response.ok) {
        // Check if this is a rate limit error
        if (data && data.message && typeof data.message === 'string' &&
            data.message.includes('Too many requests')) {
            throw new Error(data.message);
        }
        throw new Error(data.message || 'Cannot create advising');
    }

    return data;
};

// Function to delete an advising by ID
export const deleteAdvising = async (id: string) => {
    const response = await fetch(`${SERVER_URL}/advising/${id}`, {
        method: 'DELETE',
        headers: getRequestHeaders(),
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Cannot delete advising');
    }

    return await response.json();
};

// Function to get a single advising by ID
export const getAdvisingById = async (id: string): Promise<{ data: Advising }> => {
    const response = await fetch(`${SERVER_URL}/advising/${id}`, {
        method: 'GET',
        headers: getRequestHeaders(),
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Cannot fetch advising');
    }

    return await response.json();
};