import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import  ThemeToggle  from './ThemeToggle';
import { DropdownMenu } from './DropdownMenu';
import { UserSection } from './UserSection';
import { NAV_ITEMS, NavItem } from './navConfig';
import type { User } from '@/api/users';

interface DesktopNavigationProps {
    navItems: NavItem[];
    pathname: string;
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
    pathname,
    user,
    isLoading,
    setUser
}) => {
    const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});

    const handleMouseEnter = (key: string) => {
        setDropdownOpen(prev => ({ ...prev, [key]: true }));
    };

    const handleMouseLeave = (key: string) => {
        setDropdownOpen(prev => ({ ...prev, [key]: false }));
    };

    return (
        <nav className="hidden md:flex items-center">
            <ul className="flex items-center space-x-4">
                {NAV_ITEMS.map((item) => (
                    <li
                        key={item.path}
                        className="relative group"
                        onMouseEnter={() => item.key && handleMouseEnter(item.key)}
                        onMouseLeave={() => item.key && handleMouseLeave(item.key)}
                    >
                        <Link
                            href={item.path}
                            className={`hover:text-blue-500 transition-colors ${pathname === item.path ? 'text-blue-600 font-semibold' : ''
                                }`}
                        >
                            {item.name}
                            {item.children && <ChevronDown size={16} className="inline-block ml-1" />}
                        </Link>
                        {item.children && item.key && (
                            <DropdownMenu
                                items={item.children}
                                isOpen={!!dropdownOpen[item.key]}
                                setIsOpen={(isOpen) =>
                                    setDropdownOpen(prev => ({ ...prev, [item.key!]: isOpen }))
                                }
                            />
                        )}
                    </li>
                ))}

                {/* Theme toggle */}
                <li>
                    <ThemeToggle />
                </li>

                {/* User section */}
                <li>
                    <UserSection
                        user={user}
                        isLoading={isLoading}
                        setUser={setUser}
                    />
                </li>
            </ul>
        </nav>
    );
};