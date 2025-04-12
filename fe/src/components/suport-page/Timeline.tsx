import React from 'react';
import { MapPin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

type TimelineStep = {
    step: string;
    label: string;
    pinColor: string;
    textColor: string;
    darkPinColor?: string;    // Optional pin color for dark mode
    darkTextColor?: string;   // Optional text color for dark mode
    circleColor?: string;     // Background color for the circle (optional)
    circleBorderColor?: string; // Border color for the circle (optional)
    darkCircleColor?: string; // Optional circle color for dark mode
    darkCircleBorderColor?: string; // Optional circle border for dark mode
};

type TimelineProps = {
    steps: TimelineStep[];
    className?: string;
};

export const Timeline: React.FC<TimelineProps> = ({ steps, className = "" }) => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`p-8 w-full ${className} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center relative">
                {/* Timeline steps */}
                {steps.map((item, index) => (
                    <div key={index} className="flex flex-col items-center z-10">
                        <div className="mb-2">
                            <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                {item.step}
                            </div>
                        </div>
                        <div style={{ color: isDarkMode && item.darkPinColor ? item.darkPinColor : item.pinColor }}>
                            <MapPin
                                size={36}
                                color={isDarkMode && item.darkPinColor ? item.darkPinColor : item.pinColor}
                                fill={isDarkMode ? '#1f2937' : 'white'}
                            />
                        </div>
                        <div
                            className="mt-2 w-6 h-6 rounded-full border-2 relative z-20"
                            style={{
                                backgroundColor: isDarkMode ? (item.darkCircleColor || '#1f2937') : (item.circleColor || 'white'),
                                borderColor: isDarkMode ? (item.darkCircleBorderColor || '#4b5563') : (item.circleBorderColor || '#d1d5db')
                            }}
                        ></div>
                        <div className={`mt-2 text-center ${isDarkMode && item.darkTextColor ? item.darkTextColor : item.textColor} font-bold`}>
                            {item.label}
                        </div>
                    </div>
                ))}

                {/* Connecting line now positioned at the white circles */}
                <div className={`absolute top-[87px] left-0 right-0 h-0.5 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            </div>
        </div>
    );
};

// Example for how to use with dark mode colors
const EnglishLearningTimeline = () => {
    const englishSteps = [
        {
            step: 'Step 1',
            label: 'Tiếng anh mất gốc',
            pinColor: '#1d4ed8',      // blue-700
            darkPinColor: '#3b82f6',  // blue-500
            textColor: 'text-blue-600',
            darkTextColor: 'text-blue-400'
        },
        {
            step: 'Step 2',
            label: 'Tiếng anh giao tiếp',
            pinColor: '#dc2626',      // red-600
            darkPinColor: '#ef4444',  // red-500
            textColor: 'text-red-600',
            darkTextColor: 'text-red-400'
        },
        {
            step: 'Step 3',
            label: 'IELTS 0 - 3.0+',
            pinColor: '#16a34a',      // green-600
            darkPinColor: '#22c55e',  // green-500
            textColor: 'text-green-600',
            darkTextColor: 'text-green-400'
        },
        {
            step: 'Step 4',
            label: 'IELTS 3.0 - 5.0+',
            pinColor: '#d97706',      // amber-600
            darkPinColor: '#f59e0b',  // amber-500
            textColor: 'text-amber-500',
            darkTextColor: 'text-amber-400'
        },
        {
            step: 'Step 5',
            label: 'IELTS 6.5+',
            pinColor: '#7c3aed',      // purple-600
            darkPinColor: '#8b5cf6',  // purple-500
            textColor: 'text-purple-600',
            darkTextColor: 'text-purple-400'
        }
    ];

    return <Timeline steps={englishSteps} />;
};

export default EnglishLearningTimeline;