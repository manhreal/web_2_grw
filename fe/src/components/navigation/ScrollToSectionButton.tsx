// components/navigation/ScrollToSectionButton.tsx
"use client";

import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
    { id: 'top', label: 'Go to top' },
    { id: 'video', label: 'Intro' },
    { id: 'reviews', label: 'Information' },
    { id: 'teachers', label: 'Faculty' },
    { id: 'courses', label: 'Courses' },
    { id: 'students', label: 'Students' },
    { id: 'news', label: 'News' },
];

export default function ScrollToSectionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { isDarkMode } = useTheme();

    // Scroll to a specific section
    const scrollToSection = (id: string) => {
        if (id === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsOpen(false);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest('.navigation-menu') && !target.closest('.menu-toggle')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Animation variants
    const menuVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 20,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 20,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.2
            }
        })
    };

    // Button animation variants
    const buttonVariants = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.3, 1],
            rotate: [0, 20, -20, 0],
            transition: {
                repeat: Infinity,
                repeatType: "reverse" as const,
                duration: 2
            }
        }
    };

    return (
        <>
            {/* Navigation Button */}
            <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-4">
                {/* Menu toggle button - Changed to red color */}
                <motion.button
                    initial="initial"
                    animate="animate"
                    variants={buttonVariants}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`menu-toggle rounded-full p-3 shadow-lg transition-all ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
                        } hover:bg-red-700`}
                    aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </div>

            {/* Navigation Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="navigation-menu fixed right-6 bottom-36 z-50"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuVariants}
                    >
                        <div
                            className={`rounded-lg shadow-lg p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                                }`}
                        >
                            <ul className="space-y-2">
                                {sections.map((section, index) => (
                                    <motion.li
                                        key={section.id}
                                        custom={index}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <motion.button
                                            whileHover={{
                                                backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 1)' : 'rgba(243, 244, 246, 1)',
                                                x: 5
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => scrollToSection(section.id)}
                                            className={`w-full text-left px-4 py-2 rounded-md transition-colors group relative ${isDarkMode
                                                    ? 'hover:bg-gray-700 focus:bg-gray-700'
                                                    : 'hover:bg-gray-100 focus:bg-gray-100'
                                                }`}
                                        >
                                            {/* Arrow icon that appears on hover */}
                                            <span className="absolute left-2 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                                                <ChevronRight className="text-blue-500" size={16} />
                                            </span>

                                            {/* Text moves right and changes color on hover */}
                                            <span className="inline-block transform group-hover:translate-x-5 group-hover:text-blue-500 transition-all duration-200">
                                                {section.label}
                                            </span>
                                        </motion.button>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}