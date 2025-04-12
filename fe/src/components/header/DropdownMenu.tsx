import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { NavItem } from './navConfig';

interface DropdownMenuProps {
    items: NavItem[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onItemClick?: () => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
    items,
    isOpen,
    setIsOpen,
    onItemClick
}) => {
    const { isDarkMode } = useTheme();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className={`absolute top-full left-0 mt-2 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg rounded-md py-2 min-w-[200px] z-50`}
        >
            {items.map((item) => (
                <Link
                    key={item.path}
                    href={item.path}
                    className={`block px-4 py-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    onClick={onItemClick}
                >
                    {item.name}
                </Link>
            ))}
        </div>
    );
};