'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getFreeTest } from '@/api/testFree';
import { registerUserTest } from '@/api/userTest';
import TestDisplay from '@/components/free-test/TestDisplay';
import UserTestInfo from '@/components/free-test/UserTestInfo';
import { useTheme } from '@/context/ThemeContext';
import { showSuccessToast } from '@/components/common/notifications/SuccessToast';
import Swal from 'sweetalert2';

// Main component
export default function FreeTestPage() {
    // State declarations
    const { isDarkMode } = useTheme();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });
    const [userRegistered, setUserRegistered] = useState(false);

    // Load test data on component mount
    useEffect(() => {
        const loadTest = async () => {
            try {
                setLoading(true);
                const testData = await getFreeTest();
                setTest(testData);
            } catch (err) {
                const errorMessage = 'Failed to load test. Please try again later.';
                setError(errorMessage);
                showSuccessToast({ message: errorMessage, type: 'error' });
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadTest();
    }, []);

    // Input change handler
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // User registration handler
    const handleRegistration = useCallback(async (e) => {
        e.preventDefault();
        try {
            if (!userData.fullName || !userData.email || !userData.phone) {
                const errorMessage = 'Please fill in all required fields.';
                setError(errorMessage);
                showSuccessToast({ message: errorMessage, type: 'error' });
                return;
            }

            setLoading(true);
            await registerUserTest(userData);
            setUserEmail(userData.email);
            setUserRegistered(true);
            setError(null);
            showSuccessToast({ message: 'Registration successful!' });
        } catch (err) {
            // Check if the error contains the rate limit message
            if (err.message && err.message.includes('Too many requests')) {
                // Use SweetAlert for rate limit errors
                Swal.fire({
                    title: 'Request Limit',
                    text: 'Too many requests. Please try again after 1 minute.',
                    icon: 'warning',
                    confirmButtonText: 'Close',
                    confirmButtonColor: '#3085d6',
                    background: isDarkMode ? '#1a202c' : '#fff',
                    color: isDarkMode ? '#fff' : '#000'
                });
            } else {
                // Handle other errors with the regular toast
                const errorMessage = err.message || 'Failed to register. Please try again.';
                setError(errorMessage);
                showSuccessToast({ message: errorMessage, type: 'error' });
            }
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    }, [userData, isDarkMode]);

    // Loading state render
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Error state render
    if (error) {
        return (
            <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}>
                <div className={`${isDarkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded mb-4`}>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className={`mt-2 ${isDarkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'} text-white py-1 px-3 rounded`}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // No test available state render
    if (!test) {
        return (
            <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}>
                <div className={`${isDarkMode ? 'bg-yellow-800 border-yellow-700 text-yellow-200' : 'bg-yellow-100 border-yellow-400 text-yellow-700'} border px-4 py-3 rounded mb-4`}>
                    <p>No tests available. Please try again later.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className={`mt-2 ${isDarkMode ? 'bg-yellow-700 hover:bg-yellow-800' : 'bg-yellow-600 hover:bg-yellow-700'} text-white py-1 px-3 rounded`}
                    >
                        Reload
                    </button>
                </div>
            </div>
        );
    }

    // Main render - shows either registration form or test display
    return (
        <div className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}>
            {!userRegistered ? (
                <UserTestInfo
                    userData={userData}
                    handleInputChange={handleInputChange}
                    handleRegistration={handleRegistration}
                    loading={loading}
                    error={error}
                />
            ) : (
                <TestDisplay
                    testId={test._id}
                    userEmail={userEmail}
                />
            )}
        </div>
    );
}