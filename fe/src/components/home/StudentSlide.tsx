import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import Image from 'next/image';
import { getStudents } from '@/api/home-show/view';
import { motion } from 'framer-motion';
import { SERVER_URL } from '@/api/server_url';
import { useTheme } from '@/context/ThemeContext';
import { Crown, Megaphone } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

interface Student {
    _id: string;
    image: string;
    name: string;
    achievement: string;
    description: string;
    createdAt: string;
}

const StudentSlide: React.FC = () => {
    const { isDarkMode } = useTheme();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);
    const swiperRef = useRef(null);

    useEffect(() => {
        // Set window width on client-side only
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);

            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await getStudents();
                if (response.success) {
                    setStudents(response.data);
                } else {
                    setError('Không thể tải dữ liệu học viên');
                }
            } catch (err) {
                setError('Đã xảy ra lỗi khi tải dữ liệu');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Hàm xử lý URL ảnh
    const getImageUrl = (imagePath: string): string => {
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        const decodedPath = decodeURIComponent(imagePath);
        return `${SERVER_URL}/${decodedPath.replace(/^\//, '')}`;
    };

    // Xử lý khi slide thay đổi
    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
    };

    const isMobile = windowWidth < 640;
    const isTablet = windowWidth >= 640 && windowWidth < 1024;

    if (loading) {
        return (
            <div className={`flex justify-center items-center h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
            </div>
        );
    }

    if (error) {
        return <div className={`text-red-500 text-center py-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>{error}</div>;
    }

    return (
        <div className={` px-2 md:px-4 transition-colors duration-300 ${isDarkMode ? ' text-gray-100' : ' text-gray-800'}`}>
            <div className="container mx-auto px-2 md:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className={`text-2xl md:text-3xl lg:text-4xl py-2 font-bold mb-3 ${isDarkMode ? 'text-rose-500' : 'text-rose-600'}`}>
                        NIỀM TỰ HÀO CỦA UNI CENTER
                    </h2>
                </motion.div>

                <div className="relative">
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        loop={true}
                        initialSlide={2}
                        slidesPerView={isMobile ? 1 : (isTablet ? 2 : 3)}
                        coverflowEffect={{
                            rotate: isMobile ? 0 : 50,
                            stretch: isMobile ? 0 : 0,
                            depth: isMobile ? 100 : 500,
                            modifier: 1,
                            slideShadows: false,
                        }}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
                        className="student-swiper"
                        onSlideChange={handleSlideChange}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                coverflowEffect: {
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 50,
                                    modifier: 1,
                                }
                            },
                            640: {
                                slidesPerView: 2,
                                coverflowEffect: {
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                }
                            },
                            1024: {
                                slidesPerView: 3,
                                coverflowEffect: {
                                    rotate: 50,
                                    stretch: 0,
                                    depth: 500,
                                    modifier: 1,
                                }
                            }
                        }}
                    >
                        {students.map((student, index) => (
                            <SwiperSlide key={student._id}>
                                <motion.div
                                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                                    className="flex flex-col items-center mx-auto"
                                >
                                    {/* Tên và mô tả với hiệu ứng dựa trên activeIndex */}
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            x: activeIndex === index ? 0 : activeIndex > index ? -10 : 10,
                                            opacity: activeIndex === index ? 1 : 0.7,
                                        }}
                                        transition={{ duration: 0.5 }}
                                        className="w-full text-center mb-3"
                                    >
                                        <h3 className={`text-xl md:text-2xl pt-2 font-bold ${isDarkMode
                                            ? 'text-red-400 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-300'
                                            : 'text-red-600 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600'
                                            } mb-2`}>
                                            {student.name.toUpperCase()}
                                        </h3>
                                        <div className={`w-16 md:w-20 h-1 ${isDarkMode
                                            ? 'bg-gradient-to-r from-red-400 to-orange-300'
                                            : 'bg-gradient-to-r from-red-600 to-orange-600'
                                            } mx-auto`}></div>
                                    </motion.div>

                                    {/* Khung ảnh */}
                                    <div className={`relative rounded-t-lg overflow-hidden ${isDarkMode ? 'shadow-lg shadow-blue-900/20' : 'shadow-xl'}`}>
                                        <div className="relative h-60 md:h-72 lg:h-80 w-64 md:w-80 lg:w-96">
                                            <Image
                                                src={getImageUrl(student.image)}
                                                alt={student.name}
                                                fill
                                                style={{ objectFit: 'fill' }}
                                                className="transition-transform duration-500"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                priority={false}
                                                placeholder="blur"
                                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2NjYyI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4="
                                            />
                                        </div>
                                    </div>

                                    {/* Badge cho achievement - Thích ứng với dark/light mode */}
                                    <div className={`w-64 md:w-80 lg:w-96 py-2 px-2 md:px-4 text-center rounded-b-sm shadow-md flex items-center justify-center transition-colors ${isDarkMode
                                        ? 'bg-yellow-500'
                                        : 'bg-yellow-400'
                                        }`}>
                                        <span className={`font-semibold text-xl md:text-2xl lg:text-3xl flex items-center gap-2 ${isDarkMode ? 'text-rose-600' : 'text-rose-600'}`}>
                                            <Crown className="w-5 h-5 md:w-6 md:h-6" />
                                            {student.achievement}
                                        </span>
                                    </div>

                                    {/* Mô tả với hiệu ứng */}
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            x: activeIndex === index ? 0 : activeIndex > index ? -10 : 10,
                                            opacity: activeIndex === index ? 1 : 0.7,
                                        }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        className="w-full text-center mt-4"
                                    >
                                        <p className={`flex gap-2 text-base md:text-lg pb-2 max-w-60 mx-auto ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            <Megaphone className='text-red-500 w-4 h-4 md:w-5 md:h-5' />  {student.description}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

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
                
                .student-swiper {
                    padding: 40px 0 60px; /* Thêm padding bottom để đủ chỗ cho pagination */
                    overflow: visible !important;
                }
                
                .student-swiper .swiper-slide {
                    transition: all 0.4s ease;
                    opacity: 0.5;
                    transform: scale(0.85);
                }
                
                .student-swiper .swiper-slide-active {
                    opacity: 1;
                    transform: scale(${isMobile ? '1.05' : (isTablet ? '1.1' : '1.15')});
                    z-index: 10;
                }
                
                .student-swiper .swiper-slide-prev,
                .student-swiper .swiper-slide-next {
                    opacity: 0.8;
                    transform: scale(${isMobile ? '0.9' : '0.95'});
                    z-index: 5;
                }
                
                .student-swiper .swiper-pagination {
                    position: absolute;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                }
                
                .student-swiper .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    transition: all 0.3s ease;
                    background-color: ${isDarkMode ? '#4b5563' : '#d1d5db'};
                    margin: 0 2px;
                    opacity: 0.7;
                }
                
                .student-swiper .swiper-pagination-bullet-active {
                    background: ${isDarkMode
                    ? 'linear-gradient(to right, #60a5fa, #a78bfa)'
                    : 'linear-gradient(to right, #3b82f6, #8b5cf6)'
                };
                    opacity: 1;
                    width: 20px;
                    border-radius: 8px;
                }
                
                .student-swiper .swiper-button-next:after,
                .student-swiper .swiper-button-prev:after {
                    font-size: 14px;
                }
                
                .student-swiper .swiper-button-next:hover,
                .student-swiper .swiper-button-prev:hover {
                    transform: scale(1.1);
                }
                
                /* Hiệu ứng đặc biệt cho dark mode */
                ${isDarkMode ? `
                .student-swiper .swiper-slide-active {
                    box-shadow: 0 0 20px rgba(96, 165, 250, 0.2);
                }
                ` : ''}
                
                /* Style cho mobile */
                @media (max-width: 640px) {
                    .student-swiper {
                        padding-bottom: 50px;
                    }
                    .student-swiper .swiper-pagination {
                        bottom: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default StudentSlide;