// components/ScrollToTop.tsx
"use client";

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScrollToTopProps {
    isDarkMode: boolean;
}

export default function ScrollToTop({ isDarkMode }: ScrollToTopProps) {
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Handle scroll to show/hide back to top button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <motion.button
            onClick={scrollToTop}
            className={`fixed bottom-24 left-6 z-50 p-3 ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-full shadow-lg`}
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: showScrollTop ? 1 : 0,
                scale: showScrollTop ? 1 : 0.5,
                y: showScrollTop ? 0 : 20
            }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <ArrowUp size={24} />
        </motion.button>
    );
}