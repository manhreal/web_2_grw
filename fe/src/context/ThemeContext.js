// context/ThemeContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();  // Create context to share theme state
export function ThemeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);  // Save current theme
    useEffect(() => { 
        const savedTheme = localStorage.getItem('theme'); // Get the theme saved
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode); // Invert dark/light state
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light'); // Save new theme
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');// Save new theme
        }
    };
    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}