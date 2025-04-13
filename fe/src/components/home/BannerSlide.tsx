import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { getBanners } from '@/api/home-show/view';
import { SERVER_URL } from '@/api/server_url';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Type declarations
export interface Banner {
    _id: string;
    image: string;
    name: string;
    createdAt: string;
}

const BannerSlider: React.FC = () => {
    // State declarations
    const { isDarkMode } = useTheme();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Effect to track screen size for responsive UI adjustments
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initialize value
        handleResize();

        // Register event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Effect to fetch banner data
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const response = await getBanners();
                if (response.success) {
                    setBanners(response.data);
                } else {
                    setError('Unable to load banner data');
                }
            } catch (err) {
                setError('An error occurred while loading banner data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    // Function to process image URL
    const getImageUrl = (imagePath: string): string => {
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        const decodedPath = decodeURIComponent(imagePath);
        return `${SERVER_URL}/${decodedPath.replace(/^\//, '')}`;
    };

    // Memoized styling for Swiper based on theme
    const swiperStyles = useMemo(() => {
        return `
            .swiper {
                width: 100%;
                height: 100%;
            }
            
            .swiper-pagination-bullet {
                background: ${isDarkMode ? '#4b5563' : '#9ca3af'};
                opacity: 0.6;
                width: 6px;
                height: 6px;
            }
            
            @media (min-width: 768px) {
                .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                }
            }
            
            @media (min-width: 1024px) {
                .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                }
            }
            
            .swiper-pagination-bullet-active {
                background: ${isDarkMode ? '#60a5fa' : '#3b82f6'};
                opacity: 1;
            }
            
            .swiper-button-next,
            .swiper-button-prev {
                color: ${isDarkMode ? '#60a5fa' : '#3b82f6'};
                display: none;
            }
            
            @media (min-width: 768px) {
                .swiper-button-next,
                .swiper-button-prev {
                    display: flex;
                    width: 30px;
                    height: 30px;
                }
                
                .swiper-button-next:after,
                .swiper-button-prev:after {
                    font-size: 16px;
                }
            }
            
            @media (min-width: 1024px) {
                .swiper-button-next,
                .swiper-button-prev {
                    width: 40px;
                    height: 40px;
                }
                
                .swiper-button-next:after,
                .swiper-button-prev:after {
                    font-size: 20px;
                }
            }
            
            .text-shadow {
                text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
            }
            
            /* Use aspect ratio to ensure consistent image ratio */
            .aspect-video {
                aspect-ratio: 16/9;
            }
            
            /* Reduce bullet size on mobile */
            @media (max-width: 640px) {
                .swiper-pagination {
                    bottom: 5px !important;
                }
            }
            
            @media (min-width: 641px) and (max-width: 1023px) {
                .swiper-pagination {
                    bottom: 10px !important;
                }
            }
        `;
    }, [isDarkMode]);

    // Function to render banner slider content
    const renderBannerSlide = () => {
        if (loading) {
            return (
                <div className={`flex justify-center items-center h-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl shadow-lg`}>
                    <div className={`animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className={`text-red-500 text-center p-4 h-full flex items-center justify-center rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm sm:text-base md:text-lg">{error}</p>
                </div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className={`h-full rounded-md overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
            >
                <Swiper
                    grabCursor={true}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={!isMobile} // Disable navigation on mobile
                    modules={[Autoplay, Pagination, Navigation]}
                    className="h-full"
                >
                    {banners.length > 0 ? (
                        banners.map((banner) => (
                            <SwiperSlide key={banner._id} className="h-full">
                                <div className="relative h-full w-full">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={getImageUrl(banner.image)}
                                            alt={banner.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw, 80vw"
                                            priority={true}
                                            className="object-fill object-center"
                                            placeholder="blur"
                                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+"
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide className="h-full">
                            <div className={`flex justify-center items-center h-full ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                <p className="text-sm sm:text-base md:text-lg font-medium">No banners available</p>
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
            </motion.div>
        );
    };

    // Main component render
    return (
        <section className="w-full pt-2 pb-4 sm:pt-3 sm:pb-6 md:pt-4 md:pb-8 lg:pt-6 lg:pb-12">
            <div className="container mx-auto px-2 sm:px-4">
                <div className="aspect-video w-full max-h-96 lg:max-h-none lg:h-[450px] xl:h-[500px]">
                    {renderBannerSlide()}
                </div>
            </div>

            <style jsx global>{swiperStyles}</style>
        </section>
    );
};

export default BannerSlider;