'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { fetchUserProfile } from '@/api/users';
import type { User } from '@/api/users';
import { DesktopNavigation } from './DesktopNavigationProps';
import { MobileNavigation } from './MobileNavigationProps';
import { getNavItems } from './navConfig';
import Image from 'next/image';

const HeaderBar: React.FC = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const { isDarkMode } = useTheme();

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navItems = getNavItems();

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                setIsLoading(true);
                const userData = await fetchUserProfile();

                if (userData) {
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        getUserProfile();
    }, []);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-b from-slate-800 to-slate-600 text-white' : 'bg-gradient-to-b from-blue-50 to-white text-gray-800'} shadow-md`}>
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="inline-block">
                        <div className={`${isDarkMode ? 'bg-white p-1 rounded-md' : ''}`}>
                            <Image
                                src="/images/logo.png"
                                alt="Logo"
                                layout="intrinsic"
                                width={631}
                                height={312}
                                className="w-24 h-auto"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <DesktopNavigation
                        navItems={navItems}
                        pathname={pathname}
                        user={user}
                        isLoading={isLoading}
                        setUser={setUser}
                    />

                    {/* Mobile menu button */}
                    <button
                        id="mobile-menu-button"
                        className={`md:hidden p-2 rounded-md ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}transition-colors`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile navigation drawer */}
            <MobileNavigation
                navItems={navItems}
                user={user}
                setUser={setUser}
                setIsMenuOpen={setIsMenuOpen}
                isMenuOpen={isMenuOpen}
            />
        </header>
    );
}

export default HeaderBar;