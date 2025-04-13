'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    User, UserCircle, Mail, Calendar,
    Award, Clock, CheckCircle, ArrowRight, TestTube
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { User as UserType, fetchUserProfile, fetchTestHistory, UserTest } from '@/api/users';

// Component animations
const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function ProfilePage() {
    // Hooks declarations
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const [userProfile, setUserProfile] = useState<UserType | null>(null);
    const [userTest, setUserTest] = useState<UserTest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Computed styles
    const themeClasses = useMemo(() => ({
        container: isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900',
        card: isDarkMode ? 'bg-gray-800 shadow-gray-900/70' : 'bg-white shadow-gray-200/70',
        infoBox: isDarkMode ? 'bg-gray-700' : 'bg-blue-50',
        iconColor: isDarkMode ? 'text-blue-400' : 'text-blue-600',
        tableHead: isDarkMode ? 'bg-gray-700' : 'bg-blue-50',
        tableRowHover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
        mutedText: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        tableBorder: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    }), [isDarkMode]);

    // Data fetching effect
    useEffect(() => {
        async function fetchProfileData() {
            try {
                setLoading(true);

                // Fetch user profile
                const profileData = await fetchUserProfile();

                if (!profileData) {
                    router.push('/login');
                    return;
                }

                setUserProfile(profileData);

                // Fetch test history
                const testData = await fetchTestHistory(profileData.email);
                setUserTest(testData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load profile data. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchProfileData();
    }, [router]);

    // Loading view component
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <motion.div
                    className="text-center"
                    {...fadeIn}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className={`rounded-full h-16 w-16 border-4 border-t-transparent ${isDarkMode ? 'border-blue-400' : 'border-blue-600'} mx-auto`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className={`mt-4 font-medium ${themeClasses.mutedText}`}>Loading your profile...</p>
                </motion.div>
            </div>
        );
    }

    // Error view component
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    className={`border px-4 py-3 rounded-lg relative ${isDarkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-100 border-red-400 text-red-700'}`}
                    role="alert"
                    {...fadeIn}
                >
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                </motion.div>
                <div className="mt-4">
                    <Link href="/" className={`${themeClasses.iconColor} hover:underline flex items-center`}>
                        <ArrowRight className="mr-2 h-4 w-4" /> Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Main view component
    return (
        <div className={`py-8 px-4 sm:px-6 lg:px-8 ${themeClasses.container}`}>
            <div className="max-w-7xl mx-auto">
                {/* User profile section */}
                {userProfile && (
                    <motion.div
                        className={`mb-10 rounded-xl p-6 shadow-lg ${themeClasses.card}`}
                        {...fadeIn}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Profile avatar */}
                            <div className="flex justify-center">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                                    <Image
                                        src="/avatar.jpg"
                                        alt="User avatar"
                                        fill
                                        className="object-cover"
                                        placeholder="blur"
                                        blurDataURL="data:image/jpeg;base64,iVBORw0KGgoAAA..."
                                    />
                                    {userProfile.role === 'admin' && (
                                        <div className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full">
                                            <Award size={18} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Profile details */}
                            <div className="flex-1">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {/* Name */}
                                    <div className={`flex items-center p-4 rounded-lg ${themeClasses.infoBox}`}>
                                        <div className="flex-shrink-0 mr-3">
                                            <UserCircle className={`h-6 w-6 ${themeClasses.iconColor}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm ${themeClasses.mutedText}`}>Name</p>
                                            <p className="font-medium text-lg truncate">{userProfile.name}</p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className={`flex items-center p-4 rounded-lg ${themeClasses.infoBox}`}>
                                        <div className="flex-shrink-0 mr-3">
                                            <Mail className={`h-6 w-6 ${themeClasses.iconColor}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm ${themeClasses.mutedText}`}>Email</p>
                                            <p className="font-medium text-lg truncate">{userProfile.email}</p>
                                        </div>
                                    </div>

                                    {/* Member Since */}
                                    <div className={`flex items-center p-4 rounded-lg ${themeClasses.infoBox}`}>
                                        <div className="flex-shrink-0 mr-3">
                                            <Calendar className={`h-6 w-6 ${themeClasses.iconColor}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm ${themeClasses.mutedText}`}>Member Since</p>
                                            <p className="font-medium text-lg truncate">{new Date(userProfile.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin buttons section */}
                                {userProfile.role === 'admin' && (
                                    <motion.div
                                        className="mt-6 flex flex-wrap gap-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                    >
                                        <Link
                                            href="/test-manager"
                                            className={`inline-flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition duration-200 ${isDarkMode
                                                    ? 'bg-indigo-700 hover:bg-indigo-800 text-white'
                                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                }`}
                                        >
                                            <TestTube size={18} />
                                            Test Management
                                        </Link>
                                        <Link
                                            href="/home-manager"
                                            className={`inline-flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition duration-200 ${isDarkMode
                                                    ? 'bg-green-700 hover:bg-green-800 text-white'
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                        >
                                            <User size={18} />
                                            Homepage Management
                                        </Link>
                                        <Link
                                            href="/advising-manager"
                                            className={`inline-flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition duration-200 ${isDarkMode
                                                    ? 'bg-purple-700 hover:bg-purple-800 text-white'
                                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                                                }`}
                                        >
                                            <Mail size={18} />
                                            Consultation Management
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Test history section */}
                {userTest ? (
                    <motion.div
                        className={`rounded-xl p-6 shadow-lg ${themeClasses.card}`}
                        {...fadeIn}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="flex items-center mb-4">
                            <Award className={`mr-2 h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                            <h3 className="text-xl font-semibold">Test History</h3>
                        </div>

                        {userTest.testHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className={`min-w-full rounded-lg overflow-hidden ${themeClasses.card}`}>
                                    <thead className={themeClasses.tableHead}>
                                        <tr>
                                            <th className="py-3 px-4 text-left font-medium">Date</th>
                                            <th className="py-3 px-4 text-left font-medium">Score</th>
                                            <th className="py-3 px-4 text-left font-medium">Total Questions</th>
                                            <th className="py-3 px-4 text-left font-medium">Percentage</th>
                                            <th className="py-3 px-4 text-left font-medium">Time Taken</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userTest.testHistory.map((test, index) => (
                                            <motion.tr
                                                key={test._id}
                                                className={`${themeClasses.tableRowHover} transition-colors`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.1 * Math.min(index, 5) }} // Limit delay to prevent excessive wait
                                            >
                                                <td className={`py-3 px-4 border-t ${themeClasses.tableBorder}`}>
                                                    <div className="flex items-center">
                                                        <Calendar className={`mr-2 h-4 w-4 ${themeClasses.iconColor}`} />
                                                        <span>{new Date(test.submittedAt).toLocaleString()}</span>
                                                    </div>
                                                </td>
                                                <td className={`py-3 px-4 border-t ${themeClasses.tableBorder}`}>
                                                    <div className="flex items-center">
                                                        <CheckCircle className={`mr-2 h-4 w-4 ${test.percentage >= 70
                                                                ? isDarkMode ? 'text-green-400' : 'text-green-600'
                                                                : isDarkMode ? 'text-red-400' : 'text-red-600'
                                                            }`} />
                                                        <span className="font-medium">{test.score}</span>
                                                    </div>
                                                </td>
                                                <td className={`py-3 px-4 border-t ${themeClasses.tableBorder}`}>{test.totalQuestions}</td>
                                                <td className={`py-3 px-4 border-t ${themeClasses.tableBorder}`}>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${test.percentage >= 70
                                                                    ? isDarkMode ? 'bg-green-500' : 'bg-green-600'
                                                                    : isDarkMode ? 'bg-red-500' : 'bg-red-600'
                                                                }`}
                                                            style={{ width: `${test.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm mt-1 inline-block">{test.percentage}%</span>
                                                </td>
                                                <td className={`py-3 px-4 border-t ${themeClasses.tableBorder}`}>
                                                    <div className="flex items-center">
                                                        <Clock className={`mr-2 h-4 w-4 ${themeClasses.mutedText}`} />
                                                        <span>
                                                            {test.timeTaken
                                                                ? `${test.timeTaken.minutes}m ${test.timeTaken.seconds}s`
                                                                : 'N/A'}
                                                        </span>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className={`text-center py-8 ${themeClasses.mutedText}`}>
                                <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg italic">No test history found.</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    // No test history view
                    <motion.div
                        className={`rounded-xl p-6 shadow-lg ${themeClasses.card}`}
                        {...fadeIn}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="flex items-center mb-4">
                            <TestTube className={`mr-2 h-6 w-6 ${themeClasses.iconColor}`} />
                            <h2 className="text-xl font-semibold">Test Information</h2>
                        </div>

                        <div className="flex flex-col items-center justify-center py-10">
                            <div className={`text-center ${themeClasses.mutedText}`}>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-4"
                                >
                                    <TestTube className="h-16 w-16 mx-auto opacity-60" />
                                </motion.div>
                                <p className="text-lg italic mb-6">You haven&apos;t taken any tests yet.</p>
                            </div>

                            <motion.div
                                className="mt-4"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Link
                                    href="/test/register"
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium shadow-md transition-all ${isDarkMode
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                                        }`}
                                >
                                    <ArrowRight className="h-5 w-5" />
                                    Register for a Test
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}