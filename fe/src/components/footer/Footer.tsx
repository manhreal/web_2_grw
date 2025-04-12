'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Type definitions
type FooterLink = {
    name: string;
    href: string;
};

type FooterSection = {
    title: string;
    links: FooterLink[];
};

// Address list data
export const addressLists = [
    "Số 44 ngõ 40, Tạ Quang Bửu, Bách Khoa, Hà Nội",
    "Số 9C8 ngõ 261 Trần Quốc Hoàn, Cầu Giấy, Hà Nội",
    "Lô 2 Khu BTLK 96 Nguyễn Huy Tưởng, Thanh Xuân, Hà Nội",
    "470 Bạch Mai, Hai Bà Trưng, Hà Nội",
    "172 Trần Vỹ, Cầu Giấy",
];

const Footer: React.FC = () => {
    const { isDarkMode } = useTheme();

    // Footer sections data
    const footerSections: FooterSection[] = [
        {
            title: "Giới thiệu",
            links: [
                { name: "Về chúng tôi", href: "/about" },
                { name: "Đội ngũ giảng viên", href: "/teachers" },
                { name: "Vinh danh học viên", href: "/facilities" },
                { name: "Tin tức", href: "/careers" }
            ]
        },
        {
            title: "Khóa học",
            links: [
                { name: "Tiếng Anh mất gốc", href: "/courses/children" },
                { name: "Tiếng Anh giao tiếp", href: "/courses/teenagers" },
                { name: "Luyện thi IELTS", href: "/courses/adults" },
                { name: "Luyện thi TOEIC", href: "/courses/certificates" }
            ]
        },
        {
            title: "Hỗ trợ",
            links: [
                { name: "Câu hỏi thường gặp", href: "/faq" },
                { name: "Chính sách học phí", href: "/tuition-policy" },
                { name: "Lịch khai giảng", href: "/schedule" },
                { name: "Liên hệ", href: "/contact" }
            ]
        }
    ];

    const currentYear = new Date().getFullYear();

    // Dynamic color styles based on theme
    const primaryColor = isDarkMode ? 'text-red-500' : 'text-blue-700';
    const primaryColorHover = isDarkMode ? 'hover:text-red-400' : 'hover:text-blue-600';
    const primaryBgGradient = isDarkMode
        ? 'bg-gradient-to-r from-red-900 to-red-700'
        : 'bg-gradient-to-r from-blue-600 to-blue-800';
    const primaryBorderColor = isDarkMode ? 'border-red-800' : 'border-blue-100';
    const primaryIconColor = isDarkMode ? 'text-red-500' : 'text-blue-600';
    const primaryButtonBg = isDarkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600';
    const secondaryButtonTextColor = isDarkMode ? 'text-red-600' : 'text-blue-600';
    const secondaryButtonHoverBg = isDarkMode ? 'hover:bg-red-50' : 'hover:bg-blue-50';

    return (
        <footer className={`${isDarkMode ? 'bg-gradient-to-b from-slate-800 to-slate-600' : 'bg-gradient-to-b from-blue-50 to-white'} pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-8`}>
            <div className="container mx-auto px-4 sm:px-6">
                {/* Main footer content */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
                    {/* Logo and brief description */}
                    <div className="flex flex-col space-y-4 sm:space-y-6">
                        <div className="flex justify-center sm:justify-start">
                            <Image
                                src="/images/logo_footer.jpg"
                                alt="Uni English Center Logo"
                                width={250}
                                height={50}
                                className="rounded-lg max-w-full h-auto"
                                sizes="(max-width: 640px) 80vw, (max-width: 768px) 40vw, 25vw"
                            />
                        </div>

                        <p className={`${primaryColor} font-semibold text-lg sm:text-xl leading-relaxed text-center sm:text-left`}>
                            Trung tâm Anh ngữ hàng đầu
                        </p>
                    </div>

                    {/* Footer Sections with links */}
                    {footerSections.map((section, index) => (
                        <div key={index} className="mt-6 lg:mt-0">
                            <h3 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${primaryColor} pb-2 border-b ${primaryBorderColor} text-center sm:text-left`}>
                                {section.title}
                            </h3>
                            <ul className="space-y-2 sm:space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex} className="text-center sm:text-left">
                                        <Link
                                            href={link.href}
                                            className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ${primaryColorHover} transition-colors flex items-center justify-center sm:justify-start text-sm sm:text-base`}
                                        >
                                            <span className="hover:translate-x-1 transition-transform duration-200">
                                                {link.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Address section */}
                <div className={`mt-10 sm:mt-12 pt-6 sm:pt-8 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${primaryColor} text-center sm:text-left`}>
                        Các cơ sở
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {addressLists.map((address, index) => (
                            <div key={index} className="flex items-start space-x-2 mx-auto sm:mx-0 max-w-xs sm:max-w-none">
                                <MapPin className={`${primaryIconColor} shrink-0 mt-1`} size={18} />
                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm`}>{address}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact and social media section - Responsive redesign */}
                <div className={`mt-10 sm:mt-12 pt-5 sm:pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
                        {/* Social links */}
                        <div className="space-y-3 sm:space-y-4 flex flex-col items-center sm:items-start">
                            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} pb-1 sm:pb-2`}>Theo dõi chúng tôi:</p>
                            <div className="flex space-x-4 mb-2 sm:mb-4">
                                <Link href="https://www.facebook.com/UniLanguageCenter"
                                    className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
                                    aria-label="Facebook">
                                    <Facebook size={20} className="sm:w-6 sm:h-6" />
                                </Link>
                                <Link href="#"
                                    className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-pink-600 hover:text-pink-800'} transition-colors`}
                                    aria-label="Instagram">
                                    <Instagram size={20} className="sm:w-6 sm:h-6" />
                                </Link>
                                <Link href="#"
                                    className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} transition-colors`}
                                    aria-label="Youtube">
                                    <Youtube size={20} className="sm:w-6 sm:h-6" />
                                </Link>
                            </div>
                        </div>

                        {/* Contact information */}
                        <div className="space-y-2 sm:space-y-3 flex flex-col items-center sm:items-start">
                            <div className="flex items-center sm:items-start space-x-2 sm:space-x-3">
                                <Phone className={`${primaryIconColor} shrink-0 mt-0 sm:mt-1`} size={16} />
                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm sm:text-base`}>0347.876.804</span>
                            </div>
                            <div className="flex items-center sm:items-start space-x-2 sm:space-x-3">
                                <Mail className={`${primaryIconColor} shrink-0 mt-0 sm:mt-1`} size={16} />
                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm sm:text-base`}>contact@unienglish.edu.vn</span>
                            </div>
                        </div>

                        {/* Facebook page call-to-action */}
                        <div className={`${primaryBgGradient} rounded-lg p-3 sm:p-4 flex flex-row items-center justify-between w-full gap-3 sm:gap-4`}>
                            <div className="flex items-center">
                                <div className="bg-white p-1 sm:p-2 rounded-lg mr-3 sm:mr-4">
                                    <Image
                                        src="/images/logo_circle.jpg"
                                        alt="Uni English Center Logo"
                                        width={32}
                                        height={32}
                                        className="rounded w-6 h-6 sm:w-8 sm:h-8"
                                    />
                                </div>
                                <div className="text-white">
                                    <h4 className="font-semibold text-sm sm:text-base">Uni English Center</h4>
                                    <p className="text-xs sm:text-sm text-blue-100">Trang giáo dục</p>
                                </div>
                            </div>
                            <div className="flex space-x-2 items-center mt-2 sm:mt-0">
                                <Link href="/"
                                    className={`bg-white ${secondaryButtonTextColor} ${secondaryButtonHoverBg} py-1 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm font-medium transition-colors flex items-center h-8 sm:h-10`}>
                                    <Facebook size={14} className="mr-1 sm:w-4 sm:h-4" />
                                    Follow
                                </Link>
                                <Link href="/"
                                    className={`${primaryButtonBg} text-white py-1 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm font-medium transition-colors h-8 sm:h-10 flex items-center`}>
                                    Chia sẻ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar with copyright */}
                <div className={`mt-6 pt-4 sm:pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col md:flex-row justify-between items-center`}>
                    <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        © {currentYear} Uni English Center. All rights reserved.
                    </p>

                    {/* Designer credit */}
                    <div className="flex items-center mt-3 md:mt-0 space-x-1 sm:space-x-2">
                        <span className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Website designed by</span>
                        <Link
                            href="https://zalo.me/0347876804"
                            className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-blue-600 hover:text-blue-800'} transition-colors flex items-center space-x-1 text-xs sm:text-sm`}
                        >
                            <span>@Duc-Manh Nguyen</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;