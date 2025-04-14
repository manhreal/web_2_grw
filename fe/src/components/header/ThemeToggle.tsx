import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
    isMobile?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isMobile = false }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    // Desktop version
    if (!isMobile) {
        return (
            <div className="relative w-16 h-8 flex items-center cursor-pointer" onClick={toggleTheme}>
                <div className={`w-full h-full rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-400'}`}>
                    <div className="relative w-full h-full">
                        {/* Toggle circle with icon */}
                        <div className={`absolute top-0 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${isDarkMode ? 'translate-x-8' : 'translate-x-0'}`}>
                            {isDarkMode ? (
                                <Moon size={14} className="text-blue-800" />
                            ) : (
                                <Sun size={14} className="text-orange-500" />
                            )}
                        </div>

                        {/* Day icon (small decorative sun) */}
                        <div className={`absolute top-0 right-0 flex items-center justify-center w-6 h-6 
                            transition-opacity duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="relative">
                                <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
                                <div className="absolute left-4 top-1 w-2 h-2 rounded-full bg-white"></div>
                            </div>
                        </div>

                        {/* Night icon (small decorative moon) */}
                        <div className={`absolute top-0 left-0 flex items-center justify-center w-6 h-6 
                            transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-3 h-3 rounded-full bg-yellow-200 transform translate-x-1"></div>
                            <div className="absolute top-1 left-3 w-1 h-1 rounded-full bg-white"></div>
                            <div className="absolute top-3 left-2 w-1 h-1 rounded-full bg-white"></div>
                            <div className="absolute top-2 left-4 w-1 h-1 rounded-full bg-white"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Enhanced Mobile version with similar visual style to desktop
    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full rounded-lg px-4 py-3 transition-colors duration-300"
            style={{ backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }}
            aria-label={isDarkMode ? "Change to Light mode" : "Change to Dark mode"}
        >
            <span className="font-medium">{isDarkMode ? 'Light mode' : 'Dark mode'}</span>

            {/* Enhanced toggle for mobile */}
            <div className="relative w-14 h-7 flex items-center">
                <div className={`w-full h-full rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-400'}`}>
                    <div className="relative w-full h-full">
                        {/* Toggle circle with icon */}
                        <div className={`absolute top-0 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}>
                            {isDarkMode ? (
                                <Moon size={12} className="text-blue-800" />
                            ) : (
                                <Sun size={12} className="text-orange-500" />
                            )}
                        </div>

                        {/* Day icon (small decorative sun) */}
                        <div className={`absolute top-0 right-0 flex items-center justify-center w-5 h-5 transition-opacity duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
                                <div className="absolute left-3 top-1 w-1 h-1 rounded-full bg-white"></div>
                            </div>
                        </div>

                        {/* Night icon (small decorative moon) */}
                        <div className={`absolute top-0 left-0 flex items-center justify-center w-5 h-5 transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-2 h-2 rounded-full bg-yellow-200 transform translate-x-1"></div>
                            <div className="absolute top-1 left-2 w-0.5 h-0.5 rounded-full bg-white"></div>
                            <div className="absolute top-2 left-1 w-0.5 h-0.5 rounded-full bg-white"></div>
                            <div className="absolute top-1.5 left-3 w-0.5 h-0.5 rounded-full bg-white"></div>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
};

export default ThemeToggle;