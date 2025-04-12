import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCourses } from '@/api/home-show/view';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVER_URL } from '@/api/server_url';
import { useTheme } from '@/context/ThemeContext';
import { BookOpen, Award, Users, ChevronRight, X } from 'lucide-react';

export interface Course {
    _id: string;
    image: string;
    title: string;
    link: string;
    createdAt: string;
}

interface CourseGroup {
    name: string;
    courses: Course[];
}

const ModernCourseSection: React.FC = () => {
    const { isDarkMode } = useTheme();
    const [, setAllCourses] = useState<Course[]>([]);
    const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [visibleCourses, setVisibleCourses] = useState<Course[]>([]);

    // --- Fetch và Organize Data ---
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await getCourses();
                if (response.success) {
                    setAllCourses(response.data);
                    organizeCoursesByCategory(response.data);
                } else {
                    setError('Không thể tải dữ liệu khóa học');
                }
            } catch (err) {
                setError('Đã xảy ra lỗi khi tải dữ liệu');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const organizeCoursesByCategory = (courses: Course[]) => {
        const ielts = courses.filter(course => course.title.toLowerCase().includes('ielts'));
        const toeic = courses.filter(course => course.title.toLowerCase().includes('toeic'));
        const others = courses.filter(course =>
            !course.title.toLowerCase().includes('ielts') && !course.title.toLowerCase().includes('toeic')
        );

        const groups: CourseGroup[] = [];

        if (ielts.length > 0) {
            groups.push({ name: 'IELTS', courses: ielts });
        }
        if (toeic.length > 0) {
            groups.push({ name: 'TOEIC', courses: toeic });
        }
        if (others.length > 0) {
            groups.push({ name: 'Liên quan', courses: others });
        }

        setCourseGroups(groups);
        setVisibleCourses([]);
        setSelectedCategory(null);
    };

    // --- Xử lý chọn Category ---
    const handleCategorySelect = (categoryName: string) => {
        if (selectedCategory === categoryName) {
            setSelectedCategory(null);
            setVisibleCourses([]);
        } else {
            const group = courseGroups.find(g => g.name === categoryName);
            setSelectedCategory(categoryName);
            setVisibleCourses(group ? group.courses : []);
        }
    };

    // --- Helper lấy URL ảnh ---
    const getImageUrl = (imagePath: string): string => {
        if (!imagePath) return '/images/placeholder.png';
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        try {
            const decodedPath = decodeURIComponent(imagePath);
            return `${SERVER_URL}/${decodedPath.replace(/^\//, '')}`;
        } catch {
            return `${SERVER_URL}/${imagePath.replace(/^\//, '')}`;
        }
    };

    // --- Render States ---
    if (loading) {
        return (
            <div className={`flex justify-center items-center min-h-[400px] ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex flex-col items-center">
                    <div className={`animate-spin rounded-full h-12 w-12 border-4 border-t-transparent ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
                    <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Đang tải khóa học...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center py-10 min-h-[400px] ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <p className="text-red-500 font-medium">{error}</p>
            </div>
        );
    }

    // --- Animation Variants ---
    const bannerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const textVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } }
    };

    const featureVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.4
            }
        }
    };

    const featureItemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    const buttonGroupVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.6
            }
        }
    };

    const buttonItemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const courseGridVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const courseItemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const getBadgeColor = (title: string) => {
        if (title.toLowerCase().includes('ielts')) {
            return isDarkMode
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white'
                : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white';
        } else if (title.toLowerCase().includes('toeic')) {
            return isDarkMode
                ? 'bg-gradient-to-r from-green-600 to-green-800 text-white'
                : 'bg-gradient-to-r from-green-500 to-green-700 text-white';
        } else {
            return isDarkMode
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
                : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white';
        }
    };

    // --- Render Component ---
    return (
        <div className={`py-20 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            <div className="container mx-auto px-4 sm:px-6">
                <motion.div
                    className="flex flex-col md:flex-row items-center rounded-md overflow-hidden shadow-xl"
                    initial="hidden"
                    animate="visible"
                    variants={bannerVariants}
                >
                    {/* Fixing the image aspect ratio with proper object-fit */}
                    <div className="w-full md:w-5/12 h-72 md:h-[480px] relative">
                        <Image
                            src="/images/review/t1.jpg"
                            alt="Banner Khóa Học"
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 42vw"
                            priority
                        />
                    </div>
                    <motion.div
                        className="w-full md:w-7/12 p-6 md:p-12"
                        variants={textVariants}
                    >
                        {/* Fixed title spacing and padding */}
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-8 leading-tight py-2">
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                NÂNG TẦM TIẾNG ANH !
                            </span>
                        </h2>

                        <p className={`mb-8 text-base md:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-xl leading-relaxed`}>
                            Khám phá lộ trình học tập cá nhân hóa, hiệu quả với đội ngũ giáo viên chuyên môn cao
                            và tài liệu học tập độc quyền được thiết kế riêng cho mọi trình độ.
                        </p>
                        <motion.div
                            className="space-y-4 mb-10"
                            variants={featureVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className="flex items-center gap-4"
                                variants={featureItemVariants}
                            >
                                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                                    <BookOpen size={20} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
                                </div>
                                <span className="font-medium">Phương pháp học hiện đại</span>
                            </motion.div>

                            <motion.div
                                className="flex items-center gap-4"
                                variants={featureItemVariants}
                            >
                                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-600/20' : 'bg-purple-100'}`}>
                                    <Award size={20} className={isDarkMode ? "text-purple-400" : "text-purple-600"} />
                                </div>
                                <span className="font-medium">Cam kết đầu ra</span>
                            </motion.div>

                            <motion.div
                                className="flex items-center gap-4"
                                variants={featureItemVariants}
                            >
                                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-600/20' : 'bg-green-100'}`}>
                                    <Users size={20} className={isDarkMode ? "text-green-400" : "text-green-600"} />
                                </div>
                                <span className="font-medium">Cộng đồng học viên năng động</span>
                            </motion.div>
                        </motion.div>
                        {/* Fixed button alignment */}
                        <motion.div
                            className="flex flex-wrap justify-start gap-3 md:gap-4"
                            variants={buttonGroupVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {courseGroups.map((group) => (
                                <motion.button
                                    key={group.name}
                                    variants={buttonItemVariants}
                                    onClick={() => handleCategorySelect(group.name)}
                                    className={`px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2
                                        ${selectedCategory === group.name
                                            ? (isDarkMode
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30')
                                            : (isDarkMode
                                                ? `${group.name === 'IELTS'
                                                    ? 'bg-gray-800 text-purple-300 border border-purple-500/40'
                                                    : group.name === 'TOEIC'
                                                        ? 'bg-gray-800 text-green-300 border border-green-500/40'
                                                        : 'bg-gray-800 text-blue-300 border border-blue-500/40'} hover:bg-gray-700 hover:shadow-gray-700/30`
                                                : `${group.name === 'IELTS'
                                                    ? 'bg-white text-purple-600 border border-purple-300'
                                                    : group.name === 'TOEIC'
                                                        ? 'bg-white text-green-600 border border-green-300'
                                                        : 'bg-white text-blue-600 border border-blue-300'} hover:bg-gray-100 hover:shadow-gray-300/40`)
                                        }`}
                                >
                                    {selectedCategory === group.name ? (
                                        <>
                                            Đóng
                                            <X size={16} />
                                        </>
                                    ) : (
                                        group.name
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
                <AnimatePresence mode="wait">
                    {selectedCategory && (
                        <motion.div
                            key={`header-${selectedCategory}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="text-center my-10"
                        >
                            <h3 className={`text-2xl md:text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {selectedCategory === 'IELTS' && "Khóa học IELTS"}
                                {selectedCategory === 'TOEIC' && "Khóa học TOEIC"}
                                {selectedCategory === 'Liên quan' && "Các khóa học khác"}
                            </h3>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    {selectedCategory && visibleCourses.length > 0 && (
                        <motion.div
                            key={`courses-${selectedCategory}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
                                variants={courseGridVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {visibleCourses.map((course) => {
                                    return (
                                        <motion.div
                                            key={course._id}
                                            variants={courseItemVariants}
                                            className={`flex flex-col rounded-md overflow-hidden transition-all duration-300 group
                                                ${isDarkMode
                                                    ? 'bg-gray-800/80 shadow-lg shadow-blue-900/10 hover:shadow-blue-700/20'
                                                    : 'bg-white shadow-md hover:shadow-xl'
                                                }`}
                                        >
                                            {/* Fixed image aspect ratio */}
                                            <div className="relative w-full pt-[75%] overflow-hidden">
                                                <Image
                                                    src={getImageUrl(course.image)}
                                                    alt={course.title}
                                                    fill
                                                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    className="brightness-95"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(course.title)}`}>
                                                        {course.title.toLowerCase().includes('ielts')
                                                            ? 'IELTS'
                                                            : course.title.toLowerCase().includes('toeic')
                                                                ? 'TOEIC'
                                                                : 'Tiếng Anh'}
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            </div>

                                            <div className="p-5 flex flex-col flex-grow">
                                                <h4 className={`text-lg font-semibold mb-3 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                                    KHÓA: {course.title}
                                                </h4>
                                                <div className="mt-auto text-right">
                                                    <Link
                                                        href={`/course/course-page?id=${course._id}`}
                                                        className={`inline-flex items-center gap-1 cursor-pointer font-medium underline 
                                                        ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                                    >
                                                        Xem chi tiết
                                                        <ChevronRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {selectedCategory && visibleCourses.length === 0 && !loading && (
                        <motion.div
                            key={`${selectedCategory}-empty`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`text-center py-16 mt-8 rounded-xl ${isDarkMode
                                ? 'bg-gray-800/50 text-gray-400 border border-gray-700'
                                : 'bg-gray-50 text-gray-600 border border-gray-100'
                                }`}
                        >
                            <div className="flex flex-col items-center justify-center max-w-md mx-auto px-4">
                                <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Chưa có khóa học
                                </h3>
                                <p>Hiện chưa có khóa học nào trong danh mục &quot;{selectedCategory}&quot;. Vui lòng quay lại sau.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ModernCourseSection;