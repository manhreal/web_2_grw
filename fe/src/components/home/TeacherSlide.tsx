// Import necessary dependencies
import React, { useEffect, useState, useRef, TouchEvent, useCallback } from 'react';
import Image from 'next/image';
import { getTeachers } from '@/api/home-show/view';
import { motion } from 'framer-motion';
import { SERVER_URL } from '@/api/server_url';
import { useTheme } from '@/context/ThemeContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Award } from 'lucide-react';

// Teacher interface definition
export interface Teacher {
    _id: string;
    name: string;
    experience: string;
    image: string;
    graduate: string;
    achievements: string;
    createdAt: string;
}

const TeacherSlide: React.FC = () => {
    // Theme and state declarations
    const { isDarkMode } = useTheme();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Refs
    const thumbnailSliderRef = useRef<HTMLDivElement>(null);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch teacher data
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoading(true);
                const response = await getTeachers();
                if (response.success) {
                    setTeachers(response.data);
                } else {
                    setError('Unable to load teacher data');
                }
            } catch (err) {
                setError('An error occurred while loading data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    // Image URL processing function
    const getImageUrl = useCallback((imagePath: string): string => {
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        const decodedPath = decodeURIComponent(imagePath);
        return `${SERVER_URL}/${decodedPath.replace(/^\//, '')}`;
    }, []);

    // Navigation functions with looping
    const goToPrevious = useCallback(() => {
        setActiveIndex((prev) => (prev === 0 ? teachers.length - 1 : prev - 1));
    }, [teachers.length]);

    const goToNext = useCallback(() => {
        setActiveIndex((prev) => (prev === teachers.length - 1 ? 0 : prev + 1));
    }, [teachers.length]);

    const goToSlide = useCallback((index: number) => {
        setActiveIndex(index);
        resetAutoplay();
    }, []);

    // Thumbnail slider navigation functions
    const scrollThumbnailsLeft = useCallback(() => {
        if (!thumbnailSliderRef.current) return;

        const containerWidth = thumbnailSliderRef.current.offsetWidth;
        const scrollAmount = containerWidth / 2; // Scroll half container width

        if (thumbnailSliderRef.current.scrollLeft <= 0) {
            // If already at the beginning, loop to the end
            thumbnailSliderRef.current.scrollTo({
                left: thumbnailSliderRef.current.scrollWidth,
                behavior: 'smooth'
            });
        } else {
            thumbnailSliderRef.current.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
    }, []);

    const scrollThumbnailsRight = useCallback(() => {
        if (!thumbnailSliderRef.current) return;

        const containerWidth = thumbnailSliderRef.current.offsetWidth;
        const scrollAmount = containerWidth / 2; // Scroll half container width
        const maxScrollLeft = thumbnailSliderRef.current.scrollWidth - thumbnailSliderRef.current.offsetWidth;

        if (thumbnailSliderRef.current.scrollLeft >= maxScrollLeft - 10) {
            // If at the end, loop back to the beginning
            thumbnailSliderRef.current.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        } else {
            thumbnailSliderRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }, []);

    // Autoplay functionality
    const stopAutoplay = useCallback(() => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
    }, []);

    const startAutoplay = useCallback(() => {
        stopAutoplay(); // Clear existing timeout first
        if (teachers.length <= 1) return; // Don't start autoplay if there's only one teacher

        autoplayRef.current = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex === teachers.length - 1 ? 0 : prevIndex + 1));
        }, 3000); // Increased from 2000ms to 3000ms for better user experience
    }, [teachers.length, stopAutoplay]);

    const resetAutoplay = useCallback(() => {
        stopAutoplay();
        startAutoplay();
    }, [stopAutoplay, startAutoplay]);

    // Mouse event handlers
    const handleMouseEnter = useCallback(() => {
        stopAutoplay();
    }, [stopAutoplay]);

    const handleMouseLeave = useCallback(() => {
        startAutoplay();
    }, [startAutoplay]);

    // Drag functionality handlers
    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!thumbnailSliderRef.current) return;

        setIsDragging(true);
        setStartX(e.pageX - thumbnailSliderRef.current.offsetLeft);
        setScrollLeft(thumbnailSliderRef.current.scrollLeft);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !thumbnailSliderRef.current) return;

        e.preventDefault();
        const x = e.pageX - thumbnailSliderRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        thumbnailSliderRef.current.scrollLeft = scrollLeft - walk;
    }, [isDragging, startX, scrollLeft]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseLeaveSlider = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Touch event handlers for mobile
    const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
        if (!thumbnailSliderRef.current) return;

        setIsDragging(true);
        setStartX(e.touches[0].pageX - thumbnailSliderRef.current.offsetLeft);
        setScrollLeft(thumbnailSliderRef.current.scrollLeft);
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
        if (!isDragging || !thumbnailSliderRef.current) return;

        const x = e.touches[0].pageX - thumbnailSliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        thumbnailSliderRef.current.scrollLeft = scrollLeft - walk;
    }, [isDragging, startX, scrollLeft]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Start autoplay when component mounts or teachers data changes
    useEffect(() => {
        if (teachers.length > 0) {
            startAutoplay();
        }

        return () => {
            stopAutoplay();
        };
    }, [teachers.length, startAutoplay, stopAutoplay]);

    // Scroll active thumbnail into view
    useEffect(() => {
        if (!thumbnailSliderRef.current || teachers.length === 0) return;

        const thumbnails = thumbnailSliderRef.current.children;
        if (!thumbnails[activeIndex]) return;

        const thumbnail = thumbnails[activeIndex] as HTMLElement;
        const containerWidth = thumbnailSliderRef.current.offsetWidth;
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;

        // Calculate the center position for the thumbnail
        const scrollPosition = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);

        thumbnailSliderRef.current.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }, [activeIndex, teachers.length]);

    // Loading state UI
    if (loading) {
        return (
            <div className={`flex justify-center items-center h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
            </div>
        );
    }

    // Error state UI
    if (error) {
        return <div className={`text-red-500 text-center py-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>{error}</div>;
    }

    // Empty state
    if (teachers.length === 0) {
        return null;
    }

    // Get active teacher and parse achievements
    const activeTeacher = teachers[activeIndex];
    const achievements = activeTeacher.achievements ? activeTeacher.achievements.split('/').filter(item => item.trim()) : [];

    // Main component render
    return (
        <div className={`pb-20 px-4 overflow-hidden transition-colors duration-300 ${isDarkMode ? ' text-gray-100' : ' text-gray-800'}`}>
            <div className="container mx-auto px-4 md:px-6 relative">
                {/* Main Content */}
                <div className="relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold mb-3 py-2 ${isDarkMode ? 'text-gradient-dark' : 'text-gradient-light'}`}>
                            ACCOMPANIED BY HIGHLY SKILLED FACULTY
                        </h2>
                    </motion.div>

                    {/* Main Feature Teacher */}
                    <div
                        className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-16"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Teacher Image */}
                        <div className="relative w-full lg:w-1/2 flex justify-center">
                            <motion.div
                                key={`image-${activeTeacher._id}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative"
                            >
                                {/* Desktop image */}
                                <div className="relative hidden lg:block">
                                    <div className="relative h-[30rem] w-[30rem] flex items-center justify-center">
                                        <Image
                                            src={getImageUrl(activeTeacher.image)}
                                            alt={activeTeacher.name}
                                            width={480}
                                            height={0}
                                            style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                                            className="rounded-lg"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            priority
                                        />
                                    </div>
                                </div>

                                {/* Mobile image */}
                                <div className="block lg:hidden relative">
                                    <div className="relative h-64 w-64 mx-auto">
                                        <Image
                                            src={getImageUrl(activeTeacher.image)}
                                            alt={activeTeacher.name}
                                            width={256}
                                            height={256}
                                            style={{ objectFit: 'contain' }}
                                            className="rounded-lg"
                                            sizes="(max-width: 640px) 256px"
                                            priority
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={() => {
                                    goToPrevious();
                                    resetAutoplay();
                                }}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 text-blue-600 shadow-lg transition-all duration-300"
                                aria-label="Previous teacher"
                            >
                                <FaChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => {
                                    goToNext();
                                    resetAutoplay();
                                }}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 text-blue-600 shadow-lg transition-all duration-300"
                                aria-label="Next teacher"
                            >
                                <FaChevronRight size={20} />
                            </button>
                        </div>

                        {/* Teacher Info */}
                        <motion.div
                            key={`info-${activeTeacher._id}`}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-full lg:w-1/2 max-w-lg z-10"
                        >
                            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white'} shadow-lg`}>
                                <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-4`}>
                                    {activeTeacher.name}
                                </h3>
                                <div className={`h-1 w-24 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} mb-6`}></div>

                                <p className={`text-xl font-medium mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    {activeTeacher.experience}
                                </p>

                                <div className="mb-4">
                                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {activeTeacher.graduate}
                                    </p>
                                </div>

                                {achievements.length > 0 && (
                                    <div>
                                        <ul className="space-y-3">
                                            {achievements.map((achievement, index) => (
                                                <li key={index} className="flex items-start">
                                                    <Award size={24} className="mr-2 mt-1 text-amber-500" />
                                                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {achievement}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Teacher Thumbnails Slider */}
                            <div className="mt-8 relative">
                                <h4 className={`text-center text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Other Faculty
                                </h4>

                                {/* Thumbnail Slider Navigation Buttons */}
                                <button
                                    onClick={scrollThumbnailsLeft}
                                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-1 shadow-md 
                                    ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-blue-600 hover:bg-gray-100'}`}
                                    aria-label="Scroll thumbnails left"
                                >
                                    <FaChevronLeft size={14} />
                                </button>

                                <button
                                    onClick={scrollThumbnailsRight}
                                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-1 shadow-md 
                                    ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-white text-blue-600 hover:bg-gray-100'}`}
                                    aria-label="Scroll thumbnails right"
                                >
                                    <FaChevronRight size={14} />
                                </button>

                                {/* Scrollable Thumbnail Container with Drag Support */}
                                <div
                                    ref={thumbnailSliderRef}
                                    className={`flex overflow-x-auto px-6 pb-2 scrollbar-hide snap-x scroll-smooth cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseLeaveSlider}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    {teachers.map((teacher, index) => (
                                        <div
                                            key={teacher._id}
                                            className={`flex-shrink-0 mx-2 transition-all duration-200 snap-center`}
                                            onClick={() => {
                                                if (!isDragging) {
                                                    goToSlide(index);
                                                }
                                            }}
                                        >
                                            <div className={`${index === activeIndex ? 'border-2 border-blue-500' : 'border-2 border-gray-200'} relative h-16 w-16 rounded-full overflow-hidden`}>
                                                <Image
                                                    src={getImageUrl(teacher.image)}
                                                    alt={teacher.name}
                                                    fill
                                                    style={{ objectFit: 'contain' }}
                                                    className={`transition-all`}
                                                    sizes="64px"
                                                />
                                            </div>
                                            <p className="text-center mt-1 text-xs font-medium max-w-16 truncate">{teacher.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CSS Styles */}
            <style jsx global>{`
                .text-gradient-dark {
                    background: linear-gradient(to right, #60a5fa, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                .text-gradient-light {
                    background: linear-gradient(to right, #2563eb, #7c3aed);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                /* Hide scrollbar for Chrome, Safari and Opera */
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                
                /* Hide scrollbar for IE, Edge and Firefox */
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                
                /* Responsive image containers */
                @media (min-width: 1024px) {
                    .teacher-image-container {
                        height: auto;
                        max-height: 32rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default TeacherSlide;