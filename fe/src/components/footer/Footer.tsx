'use client';

import React, { useMemo } from 'react';
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
    "44, Alley 40, Ta Quang Buu, Bach Khoa, Hanoi",
    "9C8, Alley 261, Tran Quoc Hoan, Cau Giay, Hanoi",
    "Lot 2, BTLK Zone 96, Nguyen Huy Tuong, Thanh Xuan, Hanoi",
    "470 Bach Mai, Hai Ba Trung, Hanoi",
    "172 Tran Vy, Cau Giay, Hanoi",
];

const Footer: React.FC = () => {
    // Theme context
    const { isDarkMode } = useTheme();

    // Footer sections data
    const footerSections: FooterSection[] = [
        {
            title: "About Us",
            links: [
                { name: "Our Story", href: "/" },
                { name: "Teaching Team", href: "/" },
                { name: "Student Achievements", href: "/" },
                { name: "News", href: "/" }
            ]
        },
        {
            title: "Courses",
            links: [
                { name: "Basic English", href: "/course/course-page" },
                { name: "Conversational English", href: "/course/course-page" },
                { name: "IELTS Preparation", href: "/course/course-page" },
                { name: "TOEIC Preparation", href: "/course/course-page" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "FAQ", href: "/" },
                { name: "Tuition Policy", href: "/" },
                { name: "Course Schedule", href: "/" },
                { name: "Contact", href: "/" }
            ]
        }
    ];

    // Calculate current year (memoized to avoid recalculation on re-renders)
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    // Dynamic theme styles (memoized to avoid recalculation on re-renders)
    const themeStyles = useMemo(() => ({
        primaryColor: isDarkMode ? 'text-red-500' : 'text-blue-700',
        primaryColorHover: isDarkMode ? 'hover:text-red-400' : 'hover:text-blue-600',
        primaryBgGradient: isDarkMode
            ? 'bg-gradient-to-r from-red-900 to-red-700'
            : 'bg-gradient-to-r from-blue-600 to-blue-800',
        primaryBorderColor: isDarkMode ? 'border-red-800' : 'border-blue-100',
        primaryIconColor: isDarkMode ? 'text-red-500' : 'text-blue-600',
        primaryButtonBg: isDarkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
        secondaryButtonTextColor: isDarkMode ? 'text-red-600' : 'text-blue-600',
        secondaryButtonHoverBg: isDarkMode ? 'hover:bg-red-50' : 'hover:bg-blue-50',
        textColor: isDarkMode ? 'text-gray-300' : 'text-gray-600',
        textColorDark: isDarkMode ? 'text-gray-300' : 'text-gray-700',
        textColorLight: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        borderColor: isDarkMode ? 'border-gray-700' : 'border-gray-200',
        footerBg: isDarkMode ? 'bg-gradient-to-b from-slate-800 to-slate-600' : 'bg-gradient-to-b from-blue-50 to-white',
        socialFacebook: isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-blue-600 hover:text-blue-800',
        socialInstagram: isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-pink-600 hover:text-pink-800',
        socialYoutube: isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800',
    }), [isDarkMode]);

    return (
        <footer className={`${themeStyles.footerBg} pt-10 sm:pt-12 md:pt-16 pb-6 sm:pb-8`}>
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
                                priority
                            />
                        </div>

                        <p className={`${themeStyles.primaryColor} font-semibold text-lg sm:text-xl leading-relaxed text-center sm:text-left`}>
                            Leading English Language Center
                        </p>
                    </div>

                    {/* Footer Sections with links */}
                    {footerSections.map((section, index) => (
                        <div key={index} className="mt-6 lg:mt-0">
                            <h3 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${themeStyles.primaryColor} pb-2 border-b ${themeStyles.primaryBorderColor} text-center sm:text-left`}>
                                {section.title}
                            </h3>
                            <ul className="space-y-2 sm:space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex} className="text-center sm:text-left">
                                        <Link
                                            href={link.href}
                                            className={`${themeStyles.textColor} ${themeStyles.primaryColorHover} transition-colors flex items-center justify-center sm:justify-start text-sm sm:text-base`}
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
                <div className={`mt-10 sm:mt-12 pt-6 sm:pt-8 border-t ${themeStyles.borderColor}`}>
                    <h3 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${themeStyles.primaryColor} text-center sm:text-left`}>
                        Our Locations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {addressLists.map((address, index) => (
                            <div key={index} className="flex items-start space-x-2 mx-auto sm:mx-0 max-w-xs sm:max-w-none">
                                <MapPin className={`${themeStyles.primaryIconColor} shrink-0 mt-1`} size={18} />
                                <span className={`${themeStyles.textColor} text-xs sm:text-sm`}>{address}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact and social media section */}
                <div className={`mt-10 sm:mt-12 pt-5 sm:pt-6 border-t ${themeStyles.borderColor}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
                        {/* Social links */}
                        <div className="space-y-3 sm:space-y-4 flex flex-col items-center sm:items-start">
                            <p className={`text-xs sm:text-sm ${themeStyles.textColorLight} pb-1 sm:pb-2`}>Follow us:</p>
                            <div className="flex space-x-4 mb-2 sm:mb-4">
                                <Link href="https://www.facebook.com/UniLanguageCenter"
                                    className={themeStyles.socialFacebook}
                                    aria-label="Facebook">
                                    <Facebook size={20} className="sm:w-6 sm:h-6" />
                                </Link>
                                <Link href="#"
                                    className={themeStyles.socialInstagram}
                                    aria-label="Instagram">
                                    <Instagram size={20} className="sm:w-6 sm:h-6" />
                                </Link>
                                <Link href="#"
                                    className={themeStyles.socialYoutube}
                                    aria-label="Youtube">
                                    <Youtube size={20} className="sm:w-6 sm:h-6" />
                                </Link>
                            </div>
                        </div>

                        {/* Contact information */}
                        <div className="space-y-2 sm:space-y-3 flex flex-col items-center sm:items-start">
                            <div className="flex items-center sm:items-start space-x-2 sm:space-x-3">
                                <Phone className={`${themeStyles.primaryIconColor} shrink-0 mt-0 sm:mt-1`} size={16} />
                                <span className={`${themeStyles.textColorDark} text-sm sm:text-base`}>0123.456.789</span>
                            </div>
                            <div className="flex items-center sm:items-start space-x-2 sm:space-x-3">
                                <Mail className={`${themeStyles.primaryIconColor} shrink-0 mt-0 sm:mt-1`} size={16} />
                                <span className={`${themeStyles.textColorDark} text-sm sm:text-base`}>contact@unienglish.edu.vn</span>
                            </div>
                        </div>

                        {/* Facebook page call-to-action */}
                        <div className={`${themeStyles.primaryBgGradient} rounded-lg p-3 sm:p-4 flex flex-row items-center justify-between w-full gap-3 sm:gap-4`}>
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
                                    <p className="text-xs sm:text-sm text-blue-100">Education Page</p>
                                </div>
                            </div>
                            <div className="flex space-x-2 items-center mt-2 sm:mt-0">
                                <Link href="https://www.facebook.com/UniLanguageCenter"
                                    className={`bg-white ${themeStyles.secondaryButtonTextColor} ${themeStyles.secondaryButtonHoverBg} py-1 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm font-medium transition-colors flex items-center h-8 sm:h-10`}>
                                    <Facebook size={14} className="mr-1 sm:w-4 sm:h-4" />
                                    Follow
                                </Link>
                                <Link href="https://www.facebook.com/UniLanguageCenter"
                                    className={`${themeStyles.primaryButtonBg} text-white py-1 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm font-medium transition-colors h-8 sm:h-10 flex items-center`}>
                                    Share
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar with copyright */}
                <div className={`mt-6 pt-4 sm:pt-6 border-t ${themeStyles.borderColor} flex flex-col md:flex-row justify-between items-center`}>
                    <p className={`text-sm sm:text-base ${themeStyles.textColorLight}`}>
                        © {currentYear} Uni English Center. All rights reserved.
                    </p>

                    {/* Designer credit */}
                    <div className="flex items-center mt-3 md:mt-0 space-x-1 sm:space-x-2">
                        <span className={`text-base ${themeStyles.textColorLight}`}>Website designed by</span>
                        <Link
                            href="https://zalo.me/0347876804"
                            className={`${themeStyles.socialFacebook} transition-colors flex items-center space-x-1 text-base`}
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