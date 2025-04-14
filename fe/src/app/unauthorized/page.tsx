'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnauthorizedPage() {
    const { isDarkMode } = useTheme();

    return (
        <div className={` py-8 flex items-center justify-center px-4 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <motion.div
                className={`max-w-md w-full text-center p-8`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <AlertCircle className={`h-16 w-16 mx-auto mb-6 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />

                <h1 className="text-2xl font-bold mb-4">Access denied</h1>

                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    You do not have permission to access this page. Only users with administrator rights can access this page.
                </p>

                <Link
                    href="/"
                    className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home page
                </Link>
            </motion.div>
        </div>
    );
}