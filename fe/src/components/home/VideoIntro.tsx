"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';

// Component Props Interface
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
    subtitle = "CONFIDENT ENGLISH, INTERNATIONAL STANDARD",
    companyName = "UNI ENGLISH CENTER",
    authorName = "Mrs. Nguyen Hoang Yen",
    authorTitle = "Director of Uni English Center.",
    autoplay = false
}: VideoIntroProps) {
    // State declarations
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [isClient, setIsClient] = useState(false);

    // Effect for client-side rendering and window resize tracking
    useEffect(() => {
        setIsClient(true);
        setWindowWidth(window.innerWidth);

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // URL generation for YouTube embed
    const embedUrl = useMemo(() => {
        if (!youtubeVideoId || typeof youtubeVideoId !== 'string') {
            console.warn("VideoIntro: prop 'youtubeVideoId' is missing or invalid.");
            return '';
        }

        return youtubeVideoId.includes('youtube.com/embed') || youtubeVideoId.includes('youtu.be')
            ? youtubeVideoId
            : `https://www.youtube.com/embed/${youtubeVideoId}`;
    }, [youtubeVideoId]);

    const fullEmbedUrl = `${embedUrl}?autoplay=${autoplay ? '1' : '0'}&rel=0`;

    // Animation variants
    const animations = {
        slideFromBottom: {
            hidden: { y: 50, opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
        },
        fadeIn: {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 1.2 } }
        }
    };

    // Responsive layout detection
    const isTablet = isClient && windowWidth >= 640 && windowWidth < 1024;
    const isDesktop = isClient && windowWidth >= 1024;

    // Conditional classes based on theme
    const themeClasses = isDarkMode ? 'text-gray-200 bg-gray-900' : 'text-gray-800 bg-white';
    const subtextColor = isDarkMode ? 'text-gray-400' : 'text-gray-700';
    const videoBarBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';

    // Component rendering
    return (
        <section className={`py-4 sm:py-6 md:py-8 lg:py-12 xl:py-16 ${themeClasses}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop & Tablet layout */}
                <div className={`hidden sm:flex flex-col lg:flex-row ${isTablet ? 'gap-8' : 'gap-12'}`}>
                    {/* Text Section */}
                    <div className={`${isDesktop ? 'w-3/5' : 'w-full'} flex flex-col justify-center`}>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={animations.fadeIn}
                        >
                            <div className={`mb-2 sm:mb-3 ${subtextColor} italic text-base sm:text-lg`}>About Us</div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4 text-red-600">
                                {title}
                            </h2>
                            <div className="mb-4 sm:mb-6 italic text-blue-600 font-semibold text-lg sm:text-xl lg:text-2xl">{subtitle}</div>
                            <div className="border-l-4 border-red-600 pl-4 sm:pl-6 mb-6 sm:mb-8">
                                <p className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                                    &quot;Proud of our highly qualified teaching staff with extensive experience. Our philosophy: Heart - Vision - Mind - Trust, committed to accompanying students on their journey. Honored to be in the Top 10 Famous Vietnamese Brands 2021. Outstanding English Training Brand in Vietnam within ASEAN 2021.&quot;
                                </p>
                                <div>
                                    <p className="font-semibold italic text-base sm:text-lg">{authorName}</p>
                                    <p className={`text-sm sm:text-md italic ${subtextColor}`}>{authorTitle}</p>
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
                            variants={animations.slideFromBottom}
                        >
                            {/* Video Container */}
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

                            {/* Video info bar */}
                            <div className={`flex items-center px-3 sm:px-4 py-2 ${videoBarBg}`}>
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
                                <div className="text-xs sm:text-sm font-medium">{companyName}</div>
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
                        variants={animations.fadeIn}
                    >
                        <div className={`mb-2 ${subtextColor} text-sm italic`}>About Us</div>
                        <h2 className="text-2xl font-bold mb-2 text-red-600">
                            {title}
                        </h2>
                        <div className="mb-4 italic text-blue-600 font-semibold text-base">{subtitle}</div>
                    </motion.div>

                    {/* Mobile Video component */}
                    <motion.div
                        className="relative rounded-lg overflow-hidden border border-red-500 shadow-md mx-auto w-full"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={animations.slideFromBottom}
                    >
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

                        {/* Mobile video info bar */}
                        <div className={`flex items-center px-3 py-2 ${videoBarBg}`}>
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
                            <div className="text-xs font-medium">{companyName}</div>
                        </div>
                    </motion.div>

                    {/* Mobile testimonial section */}
                    <motion.div
                        className="border-l-4 border-red-600 pl-4 my-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={animations.fadeIn}
                    >
                        <p className="mb-4 text-sm leading-relaxed">
                            &quot;Proud of our highly qualified teaching staff with extensive experience. Our philosophy: Heart - Vision - Mind - Trust, committed to accompanying students on their journey. Honored to be in the Top 10 Famous Vietnamese Brands 2021. Outstanding English Training Brand in Vietnam within ASEAN 2021.&quot;
                        </p>
                        <div>
                            <p className="font-semibold text-sm italic">{authorName}</p>
                            <p className={`text-xs ${subtextColor} italic`}>{authorTitle}</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}