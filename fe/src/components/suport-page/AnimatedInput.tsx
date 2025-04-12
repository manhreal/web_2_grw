'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface AnimatedInputProps {
    id: string;
    name: string;
    label: string;
    value: string;
    type: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
    
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
    id,
    name,
    label,
    value,
    type,
    required = false,
    onChange,
    onBlur,
    error
}) => {
    const { isDarkMode } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isLabelFloating, setIsLabelFloating] = useState(false);

    // Check initially and whenever value changes if label should float
    useEffect(() => {
        setIsLabelFloating(isFocused || Boolean(value));
    }, [isFocused, value]);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!value) {
            setIsFocused(false);
        }
        if (onBlur) {
            onBlur(e); 
        }
    };

    return (
        <div className="relative mb-4">
            <div className="relative">
                {/* Base border container */}
                <div
                    className={`absolute inset-0 border rounded-md transition-colors duration-200 ${isFocused
                            ? isDarkMode
                                ? 'border-blue-400'
                                : 'border-blue-500'
                            : isDarkMode
                                ? 'border-gray-600'
                                : 'border-gray-300'
                        }`}
                />

                {/* Animated border gap for label */}
                {isLabelFloating && (
                    <div
                        className={`absolute top-0 left-3 h-0.5 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
                        style={{
                            width: `${Math.min(label.length * 7 + (required ? 15 : 0), 150)}px`
                        }}
                    />
                )}

                <motion.label
                    htmlFor={id}
                    initial={value ? {
                        y: -10,
                        x: 0,
                        scale: 0.8
                    } : {
                        y: 0,
                        x: 12,
                        scale: 1
                    }}
                    animate={{
                        y: isLabelFloating ? -10 : 0,
                        x: isLabelFloating ? 10 : 12,
                        scale: isLabelFloating ? 0.8 : 1
                    }}
                    transition={{ duration: 0.2 }}
                    className={`absolute px-1 pointer-events-none origin-left z-10 transition-colors duration-200 ${isFocused
                            ? isDarkMode
                                ? 'text-blue-400'
                                : 'text-blue-600'
                            : isDarkMode
                                ? 'text-gray-300'
                                : 'text-gray-500'
                        }`}

                    style={{
                        top: isLabelFloating ? '0px' : '12px',
                        left: '4px',
                        transformOrigin: 'left top'
                    }}
                >
                    {label} {required && <span className={`${isDarkMode ? "text-read-400" : "text-red-500"}`}>*</span>}
                </motion.label>

                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required={required}
                    className={`w-full p-3 outline-none bg-transparent z-10 rounded-md border-transparent relative ${isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                    style={{ paddingTop: isLabelFloating ? '16px' : '12px' }}
                />
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`${isDarkMode ? "text-read-400" : "text-red-500"} text-sm mt-1`}
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedInput;