'use client';

import React, { useEffect } from 'react';
import Advise from '@/components/advise/Advise';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { CircleDollarSign, Clock, Pencil, Lightbulb } from 'lucide-react';
import Image from 'next/image';

export default function AdvisePage() {
    const { isDarkMode } = useTheme();

    // Animation controls for each section
    const headerControls = useAnimation();
    const formSectionControls = useAnimation();
    const guideSectionControls = useAnimation();
    const faqSectionControls = useAnimation();
    const ctaSectionControls = useAnimation();

    // Intersection observers for each section with improved thresholds for mobile
    const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [formSectionRef, formSectionInView] = useInView({ threshold: 0.05, triggerOnce: true });
    const [, guideSectionInView] = useInView({ threshold: 0.05, triggerOnce: true });
    const [faqSectionRef, faqSectionInView] = useInView({ threshold: 0.05, triggerOnce: true });
    const [ctaSectionRef, ctaSectionInView] = useInView({ threshold: 0.1, triggerOnce: true });

    // Trigger animations when sections come into view
    useEffect(() => {
        if (headerInView) headerControls.start('visible');
        if (formSectionInView) formSectionControls.start('visible');
        if (guideSectionInView) guideSectionControls.start('visible');
        if (faqSectionInView) faqSectionControls.start('visible');
        if (ctaSectionInView) ctaSectionControls.start('visible');
    }, [
        headerInView, headerControls,
        formSectionInView, formSectionControls,
        guideSectionInView, guideSectionControls,
        faqSectionInView, faqSectionControls,
        ctaSectionInView, ctaSectionControls
    ]);

    // Enhanced animations with responsive timing
    const fadeInLeft = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const staggerContainerLeft = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.08
            }
        }
    };

    const staggerContainerRight = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2
            }
        }
    };

    // Updated color scheme for FAQs with more vibrant icons
    const faqs = [
        {
            icon: <CircleDollarSign className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />,
            image: "/images/courses/adv1.png",
            question: "Tôi có phải trả phí để được tư vấn không?",
            answer: "Không, dịch vụ tư vấn của chúng tôi hoàn toàn miễn phí. Bạn chỉ thanh toán học phí khi quyết định đăng ký khóa học."
        },
        {
            icon: <Clock className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />,
            image: "/images/courses/adv2.png",
            question: "Mất bao lâu để nhận được phản hồi sau khi đăng ký tư vấn?",
            answer: "Đội ngũ tư vấn viên của chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ kể từ khi nhận được yêu cầu tư vấn."
        },
        {
            icon: <Pencil className={`w-5 h-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />,
            image: "/images/courses/adv3.png",
            question: "Tôi có thể thay đổi thông tin sau khi đã đăng ký tư vấn không?",
            answer: "Có, bạn có thể liên hệ với chúng tôi qua email hoặc hotline để cập nhật thông tin sau khi đã đăng ký."
        },
        {
            icon: <Lightbulb className={`w-5 h-5 ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} />,
            image: "/images/courses/adv4.png",
            question: "Tôi chưa biết nên học khóa học nào, trung tâm có thể giúp tôi không?",
            answer: "Đó chính là mục tiêu của dịch vụ tư vấn! Chúng tôi sẽ đánh giá trình độ, tìm hiểu mục tiêu của bạn và đề xuất lộ trình học tập phù hợp nhất."
        }
    ];

    // Enhanced gradient backgrounds
    const gradientBg = isDarkMode
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-gray-50 to-white';

    const cardGradient = isDarkMode
        ? 'bg-gradient-to-br from-gray-800 to-gray-700'
        : 'bg-gradient-to-br from-white to-gray-50';

    return (
        <div className={`min-h-screen ${gradientBg}`}>
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header - Improved responsive text sizes */}
                <motion.div
                    ref={headerRef}
                    initial="hidden"
                    animate={headerControls}
                    variants={fadeInUp}
                    className="text-center mb-10 sm:mb-16"
                >
                    <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>
                        Tư vấn lộ trình học <span className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}>Tiếng Anh</span>
                    </h1>
                    <p className={`text-base sm:text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed px-2`}>
                        Đội ngũ chuyên gia của chúng tôi sẽ giúp bạn chọn lộ trình học phù hợp nhất
                        với mục tiêu và khả năng của bạn.
                    </p>
                </motion.div>

                {/* Form and Guide Section - Improved responsive layout */}
                <div
                    ref={formSectionRef}
                    className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16"
                >
                    {/* Left side - Guide steps */}
                    <motion.div
                        className="lg:col-span-2 order-2 lg:order-1"
                        initial="hidden"
                        animate={formSectionControls}
                        variants={staggerContainerLeft}
                    >
                        <div className={`rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden ${cardGradient} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="p-4 sm:p-6 md:p-8">
                                <motion.ul variants={staggerContainerLeft} className="space-y-4 sm:space-y-6 lg:space-y-8">
                                    {[
                                        {
                                            title: "Điền thông tin cá nhân",
                                            description: "Cung cấp họ tên, email và số điện thoại để chúng tôi có thể liên hệ với bạn.",
                                            icon: "👤",
                                            bgColor: isDarkMode ? 'bg-indigo-900/40' : 'bg-indigo-100'
                                        },
                                        {
                                            title: "Chọn địa chỉ",
                                            description: "Chọn tỉnh/thành phố, quận/huyện và phường/xã nơi bạn đang sinh sống.",
                                            icon: "📍",
                                            bgColor: isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-100'
                                        },
                                        {
                                            title: "Nêu yêu cầu",
                                            description: "Mô tả mục tiêu học tập, trình độ hiện tại và thời gian có thể tham gia khóa học.",
                                            icon: "📝",
                                            bgColor: isDarkMode ? 'bg-amber-900/40' : 'bg-amber-100'
                                        },
                                        {
                                            title: "Gửi yêu cầu",
                                            description: "Xác nhận thông tin và gửi yêu cầu tư vấn. Chúng tôi sẽ liên hệ trong vòng 24 giờ.",
                                            icon: "✉️",
                                            bgColor: isDarkMode ? 'bg-rose-900/40' : 'bg-rose-100'
                                        }
                                    ].map((step, index) => (
                                        <motion.li
                                            key={index}
                                            variants={fadeInLeft}
                                            className={`flex items-start ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                                        >
                                            <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 ${step.bgColor} shadow-md`}>
                                                <span className="text-lg sm:text-xl">{step.icon}</span>
                                            </div>
                                            <div>
                                                <h3 className={`text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                                    {step.title}
                                                </h3>
                                                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {step.description}
                                                </p>
                                            </div>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side - Form */}
                    <motion.div
                        className="lg:col-span-3 order-1 lg:order-2"
                        initial="hidden"
                        animate={formSectionControls}
                        variants={fadeInRight}
                    >
                        <div className={`rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <Advise onClose={() => { }} />
                        </div>
                    </motion.div>
                </div>

                {/* FAQ Section - Improved responsive grid */}
                <motion.div
                    ref={faqSectionRef}
                    initial="hidden"
                    animate={faqSectionControls}
                    variants={staggerContainerRight}
                    className="mb-10 sm:mb-16"
                >
                    <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                                    className={`p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl ${cardGradient} shadow-md sm:shadow-lg border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'} transition-all hover:shadow-xl hover:scale-[1.01] sm:hover:scale-[1.02] duration-300`}
                                >
                                    {/* Mobile layout - improved spacing */}
                                    <div className="block sm:hidden">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} shadow-md`}>
                                                <Image
                                                    src={faq.image}
                                                    alt="FAQ illustration"
                                                    width={500}
                                                    height={500}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {faq.icon}
                                                    <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                                        {faq.question}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {faq.answer}
                                        </p>
                                    </div>

                                    {/* Desktop layout - improved spacing and alignment */}
                                    <div className="hidden sm:flex items-start gap-4 md:gap-5">
                                        <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} shadow-md`}>
                                            <Image
                                                src={faq.image}
                                                alt="FAQ illustration"
                                                width={500}
                                                height={500}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 md:mb-2">
                                                {faq.icon}
                                                <h3 className={`text-base md:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                                    {faq.question}
                                                </h3>
                                            </div>
                                            <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section - Improved responsive button */}
                <motion.div
                    ref={ctaSectionRef}
                    initial="hidden"
                    animate={ctaSectionControls}
                    variants={fadeInUp}
                    className="text-center pt-4 sm:pt-6 md:pt-8"
                >
                    <p className={`mb-4 sm:mb-6 text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Bạn đã sẵn sàng để bắt đầu hành trình học tiếng Anh cùng chúng tôi?
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                        <Link href="/course/course-page" legacyBehavior>
                            <a
                                className={`py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-medium transition duration-300 transform hover:scale-102 sm:hover:scale-105 shadow-md sm:shadow-lg ${isDarkMode
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                                    }`}
                            >
                                Xem Khóa Học Của Chúng Tôi
                            </a>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}