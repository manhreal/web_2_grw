// api/users.ts

import { SERVER_URL } from "./server_url";

// User interface
export interface User {
    uid?: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    photoURL?: string;
}

// TimeTaken interface
export interface TimeTaken {
    minutes: number;
    seconds: number;
    totalSeconds: number;
}

// TestResult interface
export interface TestResult {
    score: number;
    totalQuestions: number;
    percentage: number;
    timeTaken: TimeTaken;
    submittedAt: string;
    _id: string;
}

// UserTest interface
export interface UserTest {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    registeredAt: string;
    testHistory: TestResult[];
}

// Function to fetch user profile
export const fetchUserProfile = async (): Promise<User | null> => {
    try {
        console.log('Fetching user profile...');
        const response = await fetch(`${SERVER_URL}/users/profile`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check if the response is unauthorized (401) or forbidden (403)
        if (response.status === 401 || response.status === 403) {
            console.log('Unauthorized access');
            return null;
        }

        //  Check if the response is not OK
        if (!response.ok) {
            console.log('Response not OK');
            return null;
        }

        const data = await response.json();

        // Check data structure
        if (data.success && data.data) {
            // If data.success is true and data.data exists, return data.data
            return data.data;
        } else if (data.user) {
            // If data.user exists, return data.user
            return data.user;
        } else {
            // If neither condition is met, return data
            console.log('Unexpected data structure:', data);
            return data; 
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null; 
    }
};

// Function to login with Google
export const googleLogin = async (idToken: string, recaptchaToken: string | null): Promise<User | null> => {
    try {
        console.log('Sending Google Login with Token:', idToken);
        console.log('reCAPTCHA Token:', recaptchaToken);

        const response = await fetch(`${SERVER_URL}/auth/google`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idToken,
                recaptchaToken
            })
        });

        // Check if the response is unauthorized (401) or forbidden (403)
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Login failed:', errorData);
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Google login error:', error);
        throw error; 
    }
};

// Function to logout
export const logout = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${SERVER_URL}/users/logout`, {
            method: 'POST',
            credentials: 'include' 
        });
        return response.ok;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};

// Function to check authentication status
export const checkAuthStatus = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${SERVER_URL}/protected`, {
            method: 'GET',
            credentials: 'include'
        });

        return response.ok;
    } catch (error) {
        console.error('Auth status check error:', error);
        return false;
    }
};

// Function to fetch user test history
export const fetchTestHistory = async (email: string): Promise<UserTest | null> => {
    try {
        console.log('Fetching user test history...');
        const response = await fetch(`${SERVER_URL}/testFree/user-test/${email}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Test history response status:', response.status);

        if (response.status === 401 || response.status === 403) {
            console.log('Unauthorized access to test history');
            return null;
        }

        if (!response.ok) {
            console.log('Test history response not OK');
            return null;
        }

        const data = await response.json();
        console.log('User test history data:', data);
        return data.userTest;
    } catch (error) {
        console.error('Error fetching test history:', error);
        return null;
    }
};