'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    Eye,
    Phone,
    Mail,
    Calendar,
    ClipboardList,
    Users,
    Trash,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { fetchTestHistory, fetchAllTestUsers } from '../../api/userTest';
import {
    getAllAdvisings,
    Advising,
    deleteAdvising
} from '../../api/advising';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import AdminGuard from '@/components/AdminGuard';

// Type definitions
interface TimeTaken {
    minutes: number;
    seconds: number;
    totalSeconds?: number;
}

interface TestHistoryItem {
    testId: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    timeTaken: TimeTaken;
    submittedAt: string;
}

interface UserTestData {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    testHistory: TestHistoryItem[];
}

type TabType = 'advisory' | 'test-users';

// Animation variants
const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            staggerChildren: 0.05
        }
    }
};

const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
};

const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4 }
    }
};

const ITEMS_PER_PAGE = 5;

const AdvisoryManagement = () => {
    // State declarations
    const [activeTab, setActiveTab] = useState<TabType>('advisory');
    const [advisingData, setAdvisingData] = useState<Advising[]>([]);
    const [testUsers, setTestUsers] = useState<UserTestData[]>([]);
    const [loading, setLoading] = useState({
        advising: false,
        testUsers: false
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState({
        advisory: 1,
        testUsers: 1
    });

    // Data fetching functions
    const fetchAdvisingData = useCallback(async () => {
        setLoading(prev => ({ ...prev, advising: true }));
        try {
            const response = await getAllAdvisings();
            setAdvisingData(response.data);
        } catch (error) {
            console.error('Error fetching advising data:', error);
        } finally {
            setLoading(prev => ({ ...prev, advising: false }));
        }
    }, []);

    const fetchTestUsers = useCallback(async () => {
        setLoading(prev => ({ ...prev, testUsers: true }));
        try {
            const response = await fetchAllTestUsers();
            setTestUsers(response.users);
        } catch (error) {
            console.error('Error loading test user list:', error);
        } finally {
            setLoading(prev => ({ ...prev, testUsers: false }));
        }
    }, []);

    // Initial data load
    useEffect(() => {
        fetchAdvisingData();
        fetchTestUsers();
    }, [fetchAdvisingData, fetchTestUsers]);

    // Reset pagination when search term changes
    useEffect(() => {
        setCurrentPage({
            advisory: 1,
            testUsers: 1
        });
    }, [searchTerm]);

    // Utility functions
    const formatTimeTaken = (timeTaken: TimeTaken | number): string => {
        if (typeof timeTaken === 'number') {
            const minutes = Math.floor(timeTaken / 60);
            const seconds = Math.floor(timeTaken % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${timeTaken.minutes}:${timeTaken.seconds.toString().padStart(2, '0')}`;
    };

    const getBestTest = (user: UserTestData): TestHistoryItem | null => {
        if (!user.testHistory.length) return null;

        return user.testHistory.reduce((best, current) =>
            current.percentage > best.percentage ? current : best,
            user.testHistory[0]
        );
    };

    const getFilteredData = <T extends { fullName?: string; email?: string; phone?: string }>(
        data: T[],
        term: string
    ): T[] => {
        if (!term.trim()) return data;

        const lowerTerm = term.toLowerCase();
        return data.filter(item =>
            (item.fullName && item.fullName.toLowerCase().includes(lowerTerm)) ||
            (item.email && item.email.toLowerCase().includes(lowerTerm)) ||
            (item.phone && item.phone.includes(term))
        );
    };

    const getPaginatedData = <T,>(data: T[], page: number): T[] => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const getTotalPages = (itemsCount: number): number => {
        return Math.ceil(itemsCount / ITEMS_PER_PAGE);
    };

    // Event handlers
    const handleDeleteAdvising = async (id: string, name: string) => {
        if (!id) return;

        Swal.fire({
            title: 'Confirm Deletion',
            text: `Are you sure you want to delete the advisory request from ${name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteAdvising(id);
                    fetchAdvisingData();
                    Swal.fire(
                        'Deleted!',
                        'The advisory request has been successfully deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting advisory request:', error);
                    Swal.fire(
                        'Error!',
                        'Cannot delete advisory request. Please try again later.',
                        'error'
                    );
                }
            }
        });
    };

    const handlePageChange = (tab: TabType, page: number) => {
        setCurrentPage(prev => ({
            ...prev,
            [tab]: page
        }));
    };

    // Modal display functions
    const viewUserDetails = async (email: string) => {
        try {
            const response = await fetchTestHistory(email);
            const userTest = response.userTest;

            let testHistoryHtml = '<div class="overflow-x-auto"><table class="w-full text-left border-collapse">';
            testHistoryHtml += '<thead class="bg-gray-100"><tr><th class="p-2">Test ID</th><th class="p-2">Score</th><th class="p-2">Percentage</th><th class="p-2">Time Taken</th><th class="p-2">Date</th></tr></thead><tbody>';

            if (userTest.testHistory && userTest.testHistory.length > 0) {
                userTest.testHistory.forEach(test => {
                    const timeTaken = formatTimeTaken(test.timeTaken);
                    testHistoryHtml += `<tr class="border-b">
                        <td class="p-2">${test.testId}</td>
                        <td class="p-2">${test.score}/${test.totalQuestions}</td>
                        <td class="p-2">${test.percentage}%</td>
                        <td class="p-2">${timeTaken}</td>
                        <td class="p-2">${new Date(test.submittedAt).toLocaleString()}</td>
                    </tr>`;
                });
            } else {
                testHistoryHtml += '<tr><td colspan="5" class="p-2 text-center">No test history found for this user.</td></tr>';
            }

            testHistoryHtml += '</tbody></table></div>';

            Swal.fire({
                title: `${userTest.fullName}`,
                html: `
                    <div class="text-left">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <h4 class="text-sm font-medium text-gray-500 mb-1">Email</h4>
                                <p>${userTest.email}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                                <p>${userTest.phone}</p>
                            </div>
                            <div class="md:col-span-2">
                                <h4 class="text-sm font-medium text-gray-500 mb-1">Address</h4>
                                <p>${userTest.address || 'No address provided'}</p>
                            </div>
                        </div>
                        
                        <h4 class="font-semibold text-lg mb-3">Test History</h4>
                        ${testHistoryHtml}
                    </div>
                `,
                width: '800px',
                confirmButtonText: 'Close',
                confirmButtonColor: '#007BFF',
            });
        } catch (error) {
            console.error('Error fetching details:', error);
            Swal.fire(
                'Error!',
                'Cannot retrieve user details.',
                'error'
            );
        }
    };

    const viewAdvisingDetails = (item: Advising) => {
        Swal.fire({
            title: `${item.fullName}`,
            html: `
                <div class="text-left">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <h4 class="text-sm font-medium text-gray-500 mb-1">Email</h4>
                            <p>${item.email}</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                            <p>${item.phone}</p>
                        </div>
                        <div class="md:col-span-2">
                            <h4 class="text-sm font-medium text-gray-500 mb-1">Address</h4>
                            <p>${item.address || 'No address provided'}</p>
                        </div>
                        <div class="md:col-span-2">
                            <h4 class="text-sm font-medium text-gray-500 mb-1">Created Date</h4>
                            <p>${new Date(item.createdAt).toLocaleString()}</p>
                            
                        </div>
                        <div class="md:col-span-2">
                            <h4 class="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                            <p>${item.notes || 'No notes'}</p>
                        </div>
                    </div>
                </div>
            `,
            width: '600px',
            confirmButtonText: 'Close',
            confirmButtonColor: '#007BFF',
        });
    };

    // Derived state
    const filteredAdvisingData = getFilteredData(advisingData, searchTerm);
    const filteredTestUsers = getFilteredData(testUsers, searchTerm);
    const paginatedAdvisingData = getPaginatedData(filteredAdvisingData, currentPage.advisory);
    const paginatedTestUsers = getPaginatedData(filteredTestUsers, currentPage.testUsers);

    // Pagination component
    const Pagination = ({ currentPage, totalPages, onPageChange }: {
        currentPage: number,
        totalPages: number,
        onPageChange: (page: number) => void
    }) => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-center space-x-2 mt-4">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`h-8 w-8 rounded-md flex items-center justify-center ${currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        );
    };

    // Render component
    return (
        <AdminGuard>
            <div className="container mx-auto p-4">
                {/* Tab selection */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="flex border-b border-gray-200">
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('advisory')}
                            className={`flex items-center px-4 py-2 border-b-2 ${activeTab === 'advisory' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
                        >
                            <ClipboardList className="w-4 h-4 mr-2" />
                            Advisory Requests
                        </motion.button>
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('test-users')}
                            className={`flex items-center px-4 py-2 border-b-2 ${activeTab === 'test-users' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Test Advisory
                        </motion.button>
                    </div>
                </motion.div>

                {/* Search bar */}
                <motion.div
                    className="bg-white rounded-lg shadow mb-6 p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone..."
                            className="pl-8 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </motion.div>

                {/* Content area */}
                <motion.div
                    className="bg-white rounded-lg shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <AnimatePresence mode="wait">
                        {/* Advisory tab content */}
                        {activeTab === 'advisory' && (
                            <motion.div
                                key="advisory"
                                className="p-6"
                                variants={tabVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                <h2 className="text-xl font-semibold mb-4">Advisory Requests</h2>

                                {loading.advising ? (
                                    <div className="text-center py-4">Loading data...</div>
                                ) : filteredAdvisingData.length > 0 ? (
                                    <>
                                        <motion.div
                                            className="overflow-x-auto"
                                            variants={tableVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {paginatedAdvisingData.map((item, index) => (
                                                        <motion.tr
                                                            key={item._id}
                                                            variants={rowVariants}
                                                            custom={index}
                                                            whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.fullName}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex flex-col space-y-1">
                                                                    <div className="flex items-center text-sm">
                                                                        <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                                                        <span>{item.email}</span>
                                                                    </div>
                                                                    <div className="flex items-center text-sm">
                                                                        <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                                                        <span>{item.phone}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate">{item.address}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                <div className="flex items-center">
                                                                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                                                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end gap-2">
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        onClick={() => viewAdvisingDetails(item)}
                                                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                                    >
                                                                        <Eye className="h-4 w-4" /> View
                                                                    </motion.button>
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        onClick={() => item._id && handleDeleteAdvising(item._id, item.fullName)}
                                                                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                                    >
                                                                        <Trash className="h-4 w-4" /> Delete
                                                                    </motion.button>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </motion.div>
                                        <Pagination
                                            currentPage={currentPage.advisory}
                                            totalPages={getTotalPages(filteredAdvisingData.length)}
                                            onPageChange={(page) => handlePageChange('advisory', page)}
                                        />

                                        {/* Pagination info */}
                                        <div className="text-sm text-gray-500 mt-2 text-center">
                                            Showing {Math.min((currentPage.advisory - 1) * ITEMS_PER_PAGE + 1, filteredAdvisingData.length)} to {Math.min(currentPage.advisory * ITEMS_PER_PAGE, filteredAdvisingData.length)} of {filteredAdvisingData.length} entries
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4">No advisory requests found</div>
                                )}
                            </motion.div>
                        )}

                        {/* Test Users Tab */}
                        {activeTab === 'test-users' && (
                            <motion.div
                                key="test-users"
                                className="p-6"
                                variants={tabVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                <h2 className="text-xl font-semibold mb-4">Test Advisory Requests</h2>

                                {loading.testUsers ? (
                                    <div className="text-center py-4">Loading data...</div>
                                ) : filteredTestUsers.length > 0 ? (
                                    <>
                                        <motion.div
                                            className="overflow-x-auto"
                                            variants={tableVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Score</th>
                                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {paginatedTestUsers.map((user, index) => {
                                                        const bestTest = getBestTest(user);

                                                        return (
                                                            <motion.tr
                                                                key={user._id}
                                                                variants={rowVariants}
                                                                custom={index}
                                                                whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.fullName}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex flex-col space-y-1">
                                                                        <div className="flex items-center text-sm">
                                                                            <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                                                            <span>{user.email}</span>
                                                                        </div>
                                                                        <div className="flex items-center text-sm">
                                                                            <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                                                            <span>{user.phone}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate">{user.address || '—'}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    {bestTest ? (
                                                                        <div className="flex items-center space-x-1">
                                                                            <span className="font-semibold">{bestTest.percentage}%</span>
                                                                            <span className="text-xs text-gray-500">
                                                                                ({bestTest.score}/{bestTest.totalQuestions})
                                                                            </span>
                                                                        </div>
                                                                    ) : '—'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        onClick={() => viewUserDetails(user.email)}
                                                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-auto"
                                                                    >
                                                                        <Eye className="h-4 w-4" /> View Details
                                                                    </motion.button>
                                                                </td>
                                                            </motion.tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </motion.div>
                                        <Pagination
                                            currentPage={currentPage.testUsers}
                                            totalPages={getTotalPages(filteredTestUsers.length)}
                                            onPageChange={(page) => handlePageChange('test-users', page)}
                                        />
                                        <div className="text-sm text-gray-500 mt-2 text-center">
                                            Showing {Math.min((currentPage.testUsers - 1) * ITEMS_PER_PAGE + 1, filteredTestUsers.length)} to {Math.min(currentPage.testUsers * ITEMS_PER_PAGE, filteredTestUsers.length)} of {filteredTestUsers.length} entries
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4">No data found</div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </AdminGuard>
    );
};

export default AdvisoryManagement;