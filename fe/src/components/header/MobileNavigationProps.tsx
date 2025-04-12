import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { UserSection } from './UserSection';
import { NavItem } from './navConfig';
import { useTheme } from '@/context/ThemeContext';
import type { User } from '@/api/users';
import Image from 'next/image';

interface MobileNavigationProps {
    navItems: NavItem[];
    user: User | null;
    setUser: (user: User | null) => void;
    setIsMenuOpen: (isOpen: boolean) => void;
    isMenuOpen: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
    navItems,
    user,
    setUser,
    setIsMenuOpen,
    isMenuOpen
}) => {
    const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
    const { isDarkMode } = useTheme();

    const toggleDropdown = (key: string) => {
        setDropdownOpen(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Close the drawer when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const drawer = document.getElementById('mobile-drawer');
            const menuButton = document.getElementById('mobile-menu-button');

            if (isMenuOpen && drawer && !drawer.contains(e.target as Node) &&
                menuButton && !menuButton.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            // Prevent body scrolling when drawer is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen, setIsMenuOpen]);

    return (
        <>
            {/* Dark overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 md:hidden z-40 ${isMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-out drawer */}
            <div
                id="mobile-drawer"
                className={`fixed top-0 left-0 h-full w-3/4 max-w-xs ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-4 h-full overflow-y-auto">
                    {/* Logo or header for the drawer */}
                    <div className="mb-6 pt-2">
                        <Link href="/" onClick={() => setIsMenuOpen(false)}>
                            <Image
                                src="/images/logo.png"
                                alt="Logo"
                                layout="intrinsic"
                                width={700}
                                height={300}
                                className="w-56 h-auto"
                            />
                        </Link>
                    </div>

                    <nav>
                        <ul className="space-y-4">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    {item.children && item.key ? (
                                        <div>
                                            <button
                                                onClick={() => toggleDropdown(item.key!)}
                                                className={`flex items-center w-full py-2 px-3 rounded-md transition-colors ${isDarkMode
                                                        ? 'hover:bg-gray-700'
                                                        : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                {item.name}
                                                <ChevronDown
                                                    size={16}
                                                    className={`ml-2 transition-transform duration-200 ${dropdownOpen[item.key] ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>
                                            {dropdownOpen[item.key] && (
                                                <div className="pl-4 mt-1 space-y-2">
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.path}
                                                            href={child.path}
                                                            className={`block py-2 px-3 rounded-md ${isDarkMode
                                                                    ? 'hover:bg-gray-700'
                                                                    : 'hover:bg-gray-100'
                                                                }`}
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.path}
                                            className={`block py-2 px-3 rounded-md ${isDarkMode
                                                    ? 'hover:bg-gray-700'
                                                    : 'hover:bg-gray-100'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </li>
                            ))}

                            {/* Mobile user section */}
                            <li className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <UserSection
                                    user={user}
                                    isLoading={false}
                                    setUser={setUser}
                                    isMobile={true}
                                />
                            </li>

                            {/* Mobile theme toggle */}
                            <li className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="px-2">
                                    <ThemeToggle isMobile={true} />
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};