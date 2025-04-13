'use client';

import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '@/api/server_url';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useTheme } from '@/context/ThemeContext';

// Type definition for user data
interface TopUser {
    userId: string;
    fullName: string;
    email: string;
    bestScore: number;
    totalQuestions: number;
    percentage: number;
    timeTaken: {
        minutes: number;
        seconds: number;
        totalSeconds: number;
    };
    submittedAt: string;
}

export default function TopUsersLeaderboard() {
    // State and context hooks
    const { isDarkMode } = useTheme();
    const [topUsers, setTopUsers] = useState<TopUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data once when component mounts
    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${SERVER_URL}/testFree/top-users`);

                // Parse the response data early to check for rate limit message
                const data = await response.json();

                if (!response.ok) {
                    // Check if this is a rate limit error
                    if (data && data.message && typeof data.message === 'string' &&
                        data.message.includes('Too many requests')) {
                        throw new Error(data.message);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setTopUsers(data.topUsers || []);
                setError(null);
            } catch (err) {
                console.error('Fetch error:', err);

                // Check if the error is about rate limiting
                if (err instanceof Error && err.message.includes('Too many requests')) {
                    setError('Too many requests. Please try again after 1 minute.');

                    // Show specific rate limit error alert
                    Swal.fire({
                        title: 'Request Limit',
                        text: 'Too many requests. Please try again after 1 minute.',
                        icon: 'warning',
                        confirmButtonText: 'Close',
                        confirmButtonColor: '#3085d6',
                        background: isDarkMode ? '#1F2937' : '#FFFFFF',
                        color: isDarkMode ? '#F3F4F6' : '#000000'
                    });
                } else {
                    setError('Failed to load leaderboard data');
                    showErrorAlert(); // Use the existing general error alert function
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTopUsers();
    }, []); // Empty dependency array

    // Helper function to display error alert
    const showErrorAlert = () => {
        Swal.fire({
            title: 'Error!',
            text: 'Failed to load leaderboard data. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3B82F6',
            background: isDarkMode ? '#1F2937' : '#FFFFFF',
            color: isDarkMode ? '#F3F4F6' : '#000000'
        });
    };

    // Helper function for time formatting
    const formatTime = (timeTaken: { minutes: number, seconds: number }) => {
        return `${timeTaken.minutes}m ${timeTaken.seconds}s`;
    };

    // Helper function for date formatting
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.05,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12
            }
        }
    };

    const tableHeaderVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.4
            }
        }
    };

    const tipBoxVariants = {
        hidden: { x: 30, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                delay: 0.5,
                duration: 0.6
            }
        }
    };

    // Helper function for theme-based classes
    const getThemeClass = (darkClass: string, lightClass: string) => {
        return isDarkMode ? darkClass : lightClass;
    };

    // Loading state component
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center p-6 ${getThemeClass('bg-gray-800', 'bg-white')} rounded-xl shadow-lg flex flex-col items-center justify-center h-64`}
            >
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-blue-600 font-medium">Loading leaderboard information...</p>
            </motion.div>
        );
    }

    // Error state component
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center p-6 ${getThemeClass('bg-gray-800', 'bg-white')} rounded-xl shadow-lg`}
            >
                <div className="mb-3 text-4xl">⚠️</div>
                <div className={`text-lg font-medium mb-4 ${getThemeClass('text-gray-200', 'text-gray-800')}`}>{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className={`${getThemeClass('bg-blue-600 hover:bg-blue-700', 'bg-blue-500 hover:bg-blue-600')} text-white px-6 py-2 rounded-lg transition-colors font-medium`}
                >
                    Try Again
                </button>
            </motion.div>
        );
    }

    // Main component render
    return (
        <motion.div
            key={`container-${isDarkMode ? 'dark' : 'light'}`}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={`p-5 md:p-6 h-full max-w-full overflow-hidden`}
        >
            {/* Header section with title and tips */}
            <motion.div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <motion.h2
                    variants={itemVariants}
                    className="text-2xl font-bold flex items-center"
                >
                    <span className="mr-2 text-yellow-500">🏆</span>
                    <span className={getThemeClass('text-white', 'text-gray-800')}>Leaderboard</span>
                </motion.h2>

                <motion.div
                    variants={tipBoxVariants}
                    className={`p-3 rounded-lg border ${getThemeClass(
                        'bg-blue-900/40 border-blue-800 text-blue-200',
                        'bg-blue-50 border-blue-100 text-blue-800'
                    )} md:max-w-md text-sm`}
                >
                    <div className={`flex items-center mb-2 font-semibold ${getThemeClass('text-white', 'text-blue-800')}`}>
                        <span className="mr-2">💡</span> Test Tips
                    </div>
                    <ul className={`space-y-1 pl-5 list-disc ${getThemeClass('text-gray-100', 'text-blue-700')}`}>
                        <li>Make sure you can set aside at least 45 minutes for the test</li>
                        <li>Read questions carefully and choose the correct answers</li>
                        <li>You'll receive results and answers immediately after completing the test</li>
                    </ul>
                </motion.div>
            </motion.div>

            {/* Table section with leaderboard data */}
            <div className="overflow-x-auto -mx-5 px-5">
                {topUsers.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-center ${getThemeClass('text-gray-400', 'text-gray-500')} py-12 rounded-lg border ${getThemeClass('border-gray-700', 'border-gray-200')}`}
                    >
                        <div className="text-4xl mb-3">📊</div>
                        <p className={`text-lg font-medium ${getThemeClass('text-gray-300', 'text-gray-700')}`}>No data available yet</p>
                        <p className={`text-sm mt-2 max-w-md mx-auto ${getThemeClass('text-gray-400', 'text-gray-500')}`}>Be the first to complete the test and claim the top spot on the leaderboard!</p>
                    </motion.div>
                ) : (
                    <div className={`relative overflow-hidden rounded-xl border shadow-sm 
                        before:absolute before:inset-0 before:z-0
                        before:rounded-xl
                        before:bg-gradient-to-r 
                        before:from-transparent 
                        before:via-transparent 
                        before:to-transparent 
                        before:transition-colors
                        before:duration-300
                        hover:before:from-transparent 
                        hover:before:via-transparent 
                        hover:before:to-transparent
                        ${getThemeClass('border-gray-700', 'border-gray-200')}`}
                    >
                        <div className='overflow-x-auto'>
                            <table className={`min-w-full relative z-10 ${getThemeClass('bg-gray-800', 'bg-white')}`}>
                                <motion.thead variants={tableHeaderVariants}>
                                    <tr className={`${getThemeClass('bg-blue-900/70 text-blue-100', 'bg-blue-50 text-blue-800')}`}>
                                        <th className="py-3 px-3 md:px-4 text-left font-semibold">Rank</th>
                                        <th className="py-3 px-3 md:px-4 text-left font-semibold">Name</th>
                                        <th className="py-3 px-3 md:px-4 text-right font-semibold">Score</th>
                                        <th className="py-3 px-3 md:px-4 text-right font-semibold sm:table-cell">Time</th>
                                        <th className="py-3 px-3 md:px-4 text-right font-semibold sm:table-cell">Date</th>
                                    </tr>
                                </motion.thead>
                                <motion.tbody>
                                    {topUsers.map((user, index) => (
                                        <motion.tr
                                            key={`${user.email}-${isDarkMode ? 'dark' : 'light'}`}
                                            variants={itemVariants}
                                            className={`border-b ${getThemeClass(
                                                'border-gray-700 hover:bg-gray-700/50',
                                                'border-gray-200 hover:bg-blue-50/50'
                                            )} transition-colors`}
                                        >
                                            <td className={`py-3 px-3 md:px-4 ${getThemeClass('text-gray-300', 'text-gray-700')}`}>
                                                <motion.div
                                                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                                                    ${index === 0
                                                            ? 'bg-yellow-400 text-yellow-900' :
                                                            index === 1
                                                                ? 'bg-gray-300 text-gray-800' :
                                                                index === 2
                                                                    ? 'bg-amber-600 text-white'
                                                                    : getThemeClass(
                                                                        'bg-gray-700 text-gray-300',
                                                                        'bg-gray-100 text-gray-600'
                                                                    )
                                                        }`}
                                                >
                                                    {index + 1}
                                                </motion.div>
                                            </td>
                                            <td className={`py-3 px-3 md:px-4 font-medium truncate max-w-24 md:max-w-none ${getThemeClass('text-gray-200', 'text-gray-700')}`}>
                                                {user.fullName}
                                            </td>
                                            <td className={`py-3 font-semibold px-3 md:px-4 text-right whitespace-nowrap ${getThemeClass('text-rose-500', 'text-red-500')}`}>
                                                <span className="font-medium">{user.bestScore}</span>
                                                <span className={`${getThemeClass('text-gray-400', 'text-gray-500')} font-medium text-xs`}>/{user.totalQuestions}</span>
                                            </td>
                                            <td className={`py-3 px-3 md:px-4 text-right whitespace-nowrap sm:table-cell ${getThemeClass('text-gray-300', 'text-gray-700')}`}>
                                                {formatTime(user.timeTaken)}
                                            </td>
                                            <td className={`py-3 px-3 md:px-4 text-right text-sm whitespace-nowrap sm:table-cell ${getThemeClass('text-gray-400', 'text-gray-500')}`}>
                                                {formatDate(user.submittedAt)}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </motion.tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}