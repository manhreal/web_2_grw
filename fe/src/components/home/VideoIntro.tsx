"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface VideoIntroProps {
    isDarkMode: boolean;
    youtubeVideoId?: string;
    thumbnailUrl?: string;
    title?: string;
    subtitle?: string;
    companyName?: string;
    authorName?: string;
    authorTitle?: string;
    autoplay?: boolean;
}

export default function VideoIntro({
    isDarkMode,
    youtubeVideoId = "RJKukVGYdty",
    title = "UNI ENGLISH CENTER",
    subtitle = "TỰ TIN TIẾNG ANH, SÁNH TẦM QUỐC TẾ",
    companyName = "UNI ENGLISH CENTER",
    authorName = "Mrs. Nguyen Hoang Yen",
    authorTitle = "Giám đốc Uni English Center.",
    autoplay = false
}: VideoIntroProps) {
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [isClient, setIsClient] = useState(false);

    // Effect để xử lý việc client-side rendering và theo dõi kích thước màn hình
    useEffect(() => {
        setIsClient(true);

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // --- Calculate safe URL ---
    let embedUrl = '';
    if (youtubeVideoId && typeof youtubeVideoId === 'string') {
        embedUrl = youtubeVideoId.includes('youtube.com/embed') || youtubeVideoId.includes('youtu.be')
            ? youtubeVideoId
            : `https://www.youtube.com/embed/${youtubeVideoId}`;
    } else {
        console.warn("VideoIntro: prop 'youtubeVideoId' is missing or invalid.");
    }

    const autoplayParam = autoplay ? '1' : '0';
    const fullEmbedUrl = `${embedUrl}?autoplay=${autoplayParam}&rel=0`;

    // Animations
    const slideFromBottomVariant = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
    };

    const fadeInVariant = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1.2 } }
    };

    // Thiết kế responsive cho layout
    const isTablet = isClient && windowWidth >= 640 && windowWidth < 1024;
    const isDesktop = isClient && windowWidth >= 1024;

    return (
        <section className={`py-4 sm:py-6 md:py-8 lg:py-12 xl:py-16 ${isDarkMode ? 'text-gray-200 bg-gray-900' : 'text-gray-800 bg-white'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop & Tablet layout */}
                <div className={`hidden sm:flex flex-col lg:flex-row ${isTablet ? 'gap-8' : 'gap-12'}`}>
                    {/* Text Section */}
                    <div className={`${isDesktop ? 'w-3/5' : 'w-full'} flex flex-col justify-center`}>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={fadeInVariant}
                        >
                            <div className={`mb-2 sm:mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} italic text-base sm:text-lg`}>Về chúng tôi</div>
                            <h2 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4 text-red-600`}>
                                {title}
                            </h2>
                            <div className="mb-4 sm:mb-6 italic text-blue-600 font-semibold text-lg sm:text-xl lg:text-2xl">{subtitle}</div>
                            <div className="border-l-4 border-red-600 pl-4 sm:pl-6 mb-6 sm:mb-8">
                                <p className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                                    &quot;Tự hào với đội ngũ giảng viên chuyên môn cao, dày dặn kinh nghiệm. Phương châm: Tâm - Tầm - Trí - Tín, cam kết đồng hành cùng học viên. Vinh dự Top 10 Thương hiệu nổi tiếng đất Việt 2021. Thương hiệu đào tạo Tiếng Anh tiêu biểu tại Việt Nam trong ASEAN 2021.&quot;
                                </p>
                                <div>
                                    <p className="font-semibold italic text-base sm:text-lg">{authorName}</p>
                                    <p className={`text-sm sm:text-md italic ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{authorTitle}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Video Section */}
                    <div className={`${isDesktop ? 'w-2/5' : 'w-full'} flex items-center justify-center`}>
                        <motion.div
                            className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-red-500 shadow-lg w-full max-w-xl"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={slideFromBottomVariant}
                        >
                            <div className="relative w-full">
                                <div className="relative aspect-video w-full overflow-hidden">
                                    {embedUrl && (
                                        <iframe
                                            src={fullEmbedUrl}
                                            title={`${companyName} Introduction`}
                                            className="absolute top-0 left-0 w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    )}
                                </div>
                            </div>
                            {/* Video info bar at bottom */}
                            <div className={`flex items-center px-3 sm:px-4 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <div className="flex-shrink-0 mr-2 sm:mr-3">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center overflow-hidden">
                                        <Image
                                            src="/images/logo_circle.jpg"
                                            alt={companyName}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/placeholder_logo.jpg';
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="text-xs sm:text-sm font-medium">{companyName || "UNI ENGLISH CENTER"}</div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile layout - Stacked */}
                <div className="sm:hidden space-y-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInVariant}
                    >
                        <div className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} text-sm italic`}>Về chúng tôi</div>
                        <h2 className={`text-2xl font-bold mb-2 text-red-600`}>
                            {title}
                        </h2>
                        <div className="mb-4 italic text-blue-600 font-semibold text-base">{subtitle}</div>
                    </motion.div>

                    {/* Video component on mobile */}
                    <motion.div
                        className="relative rounded-lg overflow-hidden border border-red-500 shadow-md mx-auto w-full"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={slideFromBottomVariant}
                    >
                        <div className="relative w-full">
                            <div className="relative aspect-video w-full overflow-hidden">
                                {embedUrl && (
                                    <iframe
                                        src={fullEmbedUrl}
                                        title={`${companyName} Introduction`}
                                        className="absolute top-0 left-0 w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>
                        </div>
                        {/* Video controls bar at bottom */}
                        <div className={`flex items-center px-3 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                            <div className="flex-shrink-0 mr-2">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden">
                                    <Image
                                        src="/images/logo_circle.jpg"
                                        alt={companyName}
                                        width={30}
                                        height={30}
                                        className="rounded-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/images/placeholder_logo.jpg';
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="text-xs font-medium">{companyName || "UNI ENGLISH CENTER"}</div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="border-l-4 border-red-600 pl-4 my-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInVariant}
                    >
                        <p className="mb-4 text-sm leading-relaxed">
                            &quot;Tự hào với đội ngũ giảng viên chuyên môn cao, dày dặn kinh nghiệm. Phương châm: Tâm - Tầm - Trí - Tín, cam kết đồng hành cùng học viên. Vinh dự Top 10 Thương hiệu nổi tiếng đất Việt 2021. Thương hiệu đào tạo Tiếng Anh tiêu biểu tại Việt Nam trong ASEAN 2021.&quot;
                        </p>
                        <div>
                            <p className="font-semibold text-sm italic">{authorName}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-700'} italic`}>{authorTitle}</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}