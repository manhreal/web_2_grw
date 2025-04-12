import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCards } from 'swiper/modules';
import Image from 'next/image';
import { getAllNews } from '@/api/home-show/view';
import { motion } from 'framer-motion';
import { SERVER_URL } from '@/api/server_url';
import { useTheme } from '@/context/ThemeContext';
import { Calendar, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

export interface News {
    _id: string;
    image: string;
    title: string;
    summary: string;
    link: string;
    publishedAt: string;
    createdAt: string;
}

const NewsSlide: React.FC = () => {
    const { isDarkMode } = useTheme();
    const [newsList, setNewsList] = useState<News[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(-1);
    const [showComponent, setShowComponent] = useState(false);
    const swiperRef = useRef(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await getAllNews();
                if (response.success) {
                    setNewsList(response.data);
                } else {
                    setError('Không thể tải dữ liệu tin tức');
                }
            } catch (err) {
                setError('Đã xảy ra lỗi khi tải dữ liệu tin tức');
                console.error(err);
            } finally {
                setLoading(false);
                // Show component with a slight delay after data is loaded
                setTimeout(() => setShowComponent(true), 300);
            }
        };

        fetchNews();
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

    // Format date to readable format
    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex flex-col items-center">
                    <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-green-400' : 'border-green-600'}`}></div>
                    <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Đang tải tin tức...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className={`text-red-500 text-center mb-4 text-xl`}>{error}</div>
            </div>
        );
    }

    return (
        <motion.div
            className={`transition-colors duration-300 py-8`}
            initial={{ opacity: 0 }}
            animate={{ opacity: showComponent ? 1 : 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: showComponent ? 1 : 0, y: showComponent ? 0 : 30 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <h2 className={`text-3xl md:text-4xl font-bold relative inline-block ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-green-400 to-teal-300' : 'from-green-600 to-teal-500'}`}>
                            TIN TỨC & SỰ KIỆN
                        </span>
                    </h2>
                </motion.div>

                <div className="news-slider-container relative mx-auto max-w-6xl">
                    <Swiper
                        effect={'cards'}
                        grabCursor={true}
                        centeredSlides={true}
                        loop={true}
                        initialSlide={0}
                        slidesPerView={"auto"}
                        cardsEffect={{
                            perSlideOffset: 12,
                            perSlideRotate: 2,
                            rotate: true,
                            slideShadows: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay, Pagination, EffectCards]}
                        className="news-swiper"
                        onSlideChange={handleSlideChange}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                    >
                        {newsList.map((news, index) => (
                            <SwiperSlide key={news._id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: showComponent ? 1 : 0,
                                        y: showComponent ? 0 : 20
                                    }}
                                    transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                                    className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl transition-all duration-300 ${activeIndex === index ? 'transform-none z-20' : 'scale-95 opacity-80'}`}
                                    onMouseEnter={() => setIsHovering(index)}
                                    onMouseLeave={() => setIsHovering(-1)}
                                >
                                    {/* Flex container for desktop, column for mobile */}
                                    <div className="flex flex-col md:flex-row  h-full">
                                        {/* Image container - fixed height on mobile, responsive on desktop */}
                                        <div className="relative w-full md:w-1/2 h-48 sm:h-56 md:h-96 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={getImageUrl(news.image)}
                                                    alt={news.title}
                                                    width={800}
                                                    height={450}
                                                    style={{
                                                        objectFit: 'cover',
                                                        transform: isHovering === index ? 'scale(1.05)' : 'scale(1)',
                                                        transition: 'transform 0.6s ease',
                                                        width: '100%',
                                                        height: '100%'
                                                    }}
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    priority={index < 3}
                                                    className="transition-transform duration-700"
                                                />
                                                
                                            </div>
                                            <div className="absolute top-4 left-4 z-20">
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode
                                                    ? 'bg-green-500/80 text-white'
                                                    : 'bg-green-600/90 text-white'}`}>
                                                    Mới cập nhật
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content container - improved padding on mobile */}
                                        <div className="w-full md:w-1/2 p-4 sm:p-5 md:p-8 flex flex-col justify-between">
                                            <div>
                                                {/* Date */}
                                                <div className="flex items-center mb-2 md:mb-3">
                                                    <Calendar className={`w-3 h-3 md:w-4 md:h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'} mr-2`} />
                                                    <span className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                                        {formatDate(news.publishedAt || news.createdAt)}
                                                    </span>
                                                </div>

                                                {/* Title - reduced size on mobile */}
                                                <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3 leading-tight ${isDarkMode
                                                    ? 'text-white hover:text-green-400'
                                                    : 'text-gray-800 hover:text-green-600'
                                                    } transition-colors duration-300`}>
                                                    {news.title}
                                                </h3>

                                                {/* Summary - limited height on mobile with ellipsis */}
                                                <div className="mb-4 md:mb-6 overflow-hidden">
                                                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm md:text-base line-clamp-2 sm:line-clamp-3 md:line-clamp-4`}>
                                                        {news.summary}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Button - more compact on mobile */}
                                            <div>
                                                <a
                                                    href={news.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all duration-300 ${isDarkMode
                                                        ? 'bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white shadow-lg hover:shadow-green-500/30'
                                                        : 'bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 text-white shadow-md hover:shadow-green-600/20'
                                                        } text-xs sm:text-sm md:text-base font-medium`}
                                                >
                                                    Đọc chi tiết
                                                    <ChevronRight className="ml-1 w-3 h-3 md:w-4 md:h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="mt-6 text-center">
                        <p className={`text-xs sm:text-sm md:text-base italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Vuốt sang 2 bên để xem tin tức
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .news-swiper {
                    padding: 30px 0;
                    overflow: visible !important;
                    max-width: 1100px;
                    margin: 0 auto;
                }
                
                .news-swiper .swiper-slide {
                    width: 95%;
                    max-width: 1000px;
                    transition: all 0.5s ease;
                    border-radius: 1rem;
                    overflow: hidden;
                    height: auto !important; // Đảm bảo height là auto
                    min-height: unset; // Bỏ min-height cố định
                }
                
                .news-swiper .swiper-slide-active {
                    z-index: 10;
                    transform: scale(1.02);
                }
                
                .news-swiper .swiper-pagination {
                    bottom: -15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    position: relative;
                    margin-top: 20px;
                }
                
                .news-swiper .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    transition: all 0.3s ease;
                    background-color: ${isDarkMode ? '#4b5563' : '#d1d5db'};
                    margin: 0 3px;
                    opacity: 0.7;
                }
                
                .news-swiper .swiper-pagination-bullet-active {
                    background: ${isDarkMode
                    ? 'linear-gradient(to right, #4ade80, #2dd4bf)'
                    : 'linear-gradient(to right, #16a34a, #0d9488)'
                };
                    opacity: 1;
                    width: 24px;
                    border-radius: 10px;
                }
                
                /* Ensure proper sizing of image containers */
                .news-swiper .swiper-slide .relative.w-full.md\\:w-1\\/2 {
                    min-height: 200px; /* Minimum height for mobile */
                }

                /* Ensure content doesn't get cut off on mobile */
                .news-swiper .swiper-slide {
                    height: auto !important;
                    min-height: 420px;
                }

                /* Make sure the card height adjusts properly */
                .news-swiper .swiper-slide > div {
                    height: 100%;
                }

                /* Adjust padding for content area on mobile */
                @media (max-width: 767px) {
                    .news-swiper {
                        padding: 15px 0 40px; /* Add bottom padding to make room for pagination */
                        position: relative;
                    }
                    
                    .news-swiper .swiper-slide {
                        width: 90%;
                        min-height: 450px;
                    }
                    
                    /* Ensure image has proper ratio but not too tall */
                    .news-swiper .swiper-slide .h-48 {
                        height: 180px !important;
                    }
                    
                    /* Ensure content area has sufficient height */
                    .news-swiper .swiper-slide .flex.flex-col.md\\:flex-row > div:last-child {
                        min-height: 220px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }
                    
                    /* Make sure content area stays readable */
                    .news-swiper .swiper-slide .line-clamp-2 {
                        max-height: 3em;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    
                    /* Fix pagination position for mobile */
                    .news-swiper .swiper-pagination {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        margin-top: 0;
                    }
                }
                
                @media (min-width: 768px) {
                    .news-swiper .swiper-slide .relative.w-full.md\\:w-1\\/2 {
                        min-height: 320px;
                    }
                    
                    .news-swiper .swiper-slide-active {
                        box-shadow: ${isDarkMode
                    ? '0 12px 36px rgba(0, 0, 0, 0.5)'
                    : '0 12px 36px rgba(0, 0, 0, 0.15)'};
                    }
                }
                .news-swiper .swiper-slide > div {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                @media (min-width: 768px) {
                    .news-swiper .swiper-slide > div {
                        flex-direction: row;
                    }
                    
                    .news-swiper .swiper-slide .relative.w-full.md\\:w-1\\/2 {
                        height: 100%; // Thay min-height bằng height: 100%
                    }
                }
                /* Glass effect for dark mode */
                ${isDarkMode ? `
                .news-swiper .swiper-slide-active {
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(74, 222, 128, 0.15);
                }
                ` : `
                .news-swiper .swiper-slide-active {
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                }
                `}
            `}</style>
        </motion.div>
    );
};

export default NewsSlide;