// src/components/Contact.tsx (or your path)
'use client';

import { useState, useRef, useEffect } from 'react';
import { PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Make sure this path is correct relative to Contact.tsx
import Advise from './advise/Advise';
// Make sure this path is correct relative to Contact.tsx
import { useTheme } from '@/context/ThemeContext'; // Import useTheme

const Contact = () => {
    const [isSupportOpen, setSupportOpen] = useState(false);
    const [isShaking, setIsShaking] = useState(true);
    const formRef = useRef<HTMLDivElement>(null); // Type the ref
    const { isDarkMode } = useTheme(); // Get theme context

    // Handle clicks outside the form to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click is outside the element referenced by formRef
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setSupportOpen(false);
            }
        };

        // Add listener only when the modal is open
        if (isSupportOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSupportOpen]); // Re-run effect when isSupportOpen changes

    // Set up shaking animation intervals
    useEffect(() => {
        if (!isSupportOpen) {
            // Initial delay before starting animation
            const initialDelay = setTimeout(() => {
                // Create interval for shake animation cycling
                const shakeInterval = setInterval(() => {
                    setIsShaking(true);

                    // Turn off shaking after 1 second
                    setTimeout(() => {
                        setIsShaking(false);
                    }, 1000);
                }, 5000); // Repeat every 5 seconds

                return () => {
                    clearInterval(shakeInterval);
                };
            }, 2000); // Start after 2 seconds

            return () => {
                clearTimeout(initialDelay);
            };
        }
    }, [isSupportOpen]);

    // Toggle function remains the same
    const toggleSupport = () => {
        setSupportOpen(!isSupportOpen);
        setIsShaking(false); // Stop shaking when opened
    };

    // Button animation variants
    const buttonVariants = {
        idle: { scale: 1, transition: { duration: 0.2 } },
        hover: { scale: 1.1, transition: { type: 'spring', stiffness: 300 } },
        tap: { scale: 0.95 },
        closed: { opacity: 1, y: 0 },
        open: { opacity: 0, y: 10, transition: { duration: 0.1 } } // Hide button slightly when form is open
    };

    // Modal animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
    };


    return (
        <> {/* Use React Fragment to return multiple elements */}
            {/* Floating Action Button */}
            <motion.button
                className={`fixed bottom-44 right-2 z-40 p-4 rounded-full shadow-lg transition-colors duration-200 
                ${isDarkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'} 
                text-white
                ${isShaking ? 'animate-[shake_0.5s_ease-in-out_infinite]' : ''}`}
                onClick={toggleSupport}
                variants={buttonVariants}
                initial="idle" // Or "closed" if you want initial state defined
                animate={isSupportOpen ? "open" : "closed"} // Control visibility/position based on state
                whileHover="hover"
                whileTap="tap"
                aria-label="Request Consultation" // Accessibility
            >
                {/* Show phone icon, increased size */}
                <PhoneCall size={30} className="text-white" />
            </motion.button>

            {/* Support Form Modal using AnimatePresence */}
            <AnimatePresence>
                {isSupportOpen && (
                    <motion.div
                        key="backdrop" // Necessary for AnimatePresence exit animations
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    // Don't add onClick here if click outside is handled by useEffect
                    >
                        {/* Modal Content Box */}
                        <motion.div
                            key="modal"
                            ref={formRef}
                            className={`relative w-full max-w-4xl rounded-lg shadow-xl p-0 md:p-0 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} // Change p-6 md:p-8 to p-0 md:p-0
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >

                            {/* Render the Advise Form Component */}
                            {/* Pass the toggleSupport function if you want an internal close action */}
                            <Advise
                                onClose={toggleSupport}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add the shake animation to Tailwind */}
            <style jsx global>{`
                @keyframes shake {
                    0% { transform: rotate(0deg); }
                    10% { transform: rotate(-10deg); }
                    20% { transform: rotate(10deg); }
                    30% { transform: rotate(-10deg); }
                    40% { transform: rotate(10deg); }
                    50% { transform: rotate(-10deg); }
                    60% { transform: rotate(10deg); }
                    70% { transform: rotate(-10deg); }
                    80% { transform: rotate(10deg); }
                    90% { transform: rotate(-10deg); }
                    100% { transform: rotate(0deg); }
                }
            `}</style>
        </>
    );
};

export default Contact;