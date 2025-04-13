import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, UserCircle, Settings } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { googleLogin, logout } from '@/api/users';
import type { User } from '@/api/users';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/./lib/firebase';
import Image from 'next/image';
import Swal from 'sweetalert2';
import ReCAPTCHA from "react-google-recaptcha";

interface UserSectionProps {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    isMobile?: boolean;
}

export const UserSection: React.FC<UserSectionProps> = ({
    user,
    isLoading,
    setUser,
    isMobile = false
}) => {
    const { isDarkMode } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    // Default avatar path
    const defaultAvatarPath = '/avatar.jpg';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const initiateGoogleLogin = () => {
        Swal.fire({
            title: 'Confirm you are not a robot',
            html: '<div id="recaptcha-container" class="flex justify-center"></div>',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#d33',
            allowOutsideClick: false,
            didOpen: () => {
                // Instead of trying to create a new instance, we'll render a React component
                // using a different approach - we'll create a temporary div and use ReactDOM
                const recaptchaContainer = document.getElementById('recaptcha-container');
                if (recaptchaContainer) {
                    // Import ReactDOM dynamically to render the component
                    import('react-dom/client').then(({ createRoot }) => {
                        const root = createRoot(recaptchaContainer);
                        root.render(
                            <ReCAPTCHA
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "your-recaptcha-site-key"}
                                onChange={(token) => {
                                    setCaptchaToken(token);
                                    Swal.close();
                                    if (token) {
                                        handleGoogleLogin(token);
                                    }
                                }}
                                size="normal"
                            />
                        );
                    });
                }
            },
            willClose: () => {
                // Clean up when the modal closes
                const recaptchaContainer = document.getElementById('recaptcha-container');
                if (recaptchaContainer) {
                    while (recaptchaContainer.firstChild) {
                        recaptchaContainer.removeChild(recaptchaContainer.firstChild);
                    }
                }
            }
        });
    };

    const handleGoogleLogin = async (token = captchaToken) => {
        // Verify reCAPTCHA first
        if (!token) {
            Swal.fire({
                title: 'Verify reCAPTCHA !',
                text: 'Please verify reCAPTCHA before logging in.',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const googleUser = result.user;

            const userData = await googleLogin(idToken, token);
            if (userData) {
                setUser({
                    ...userData,
                    photoURL: googleUser.photoURL || undefined
                });

                Swal.fire({
                    title: 'Login successful!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
            setCaptchaToken(null);
        } catch (error: unknown) {
            console.error('Google login error:', error);
            const err = error as { message?: string; response?: { status?: number } };

            if (
                err.message?.includes('You have exceeded the maximum number of login attempts. Please try again after 1 minute.') ||
                err.response?.status === 429
            ) {
                Swal.fire({
                    title: 'Login Limit Exceeded',
                    text: 'You have exceeded the maximum number of login attempts. Please try again after 1 minute.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33',
                });
            } else {
                Swal.fire({
                    title: 'Login Error',
                    text: 'An error occurred during login. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33',
                });
            }

            setCaptchaToken(null);
        }

    };

    const onReCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
        // Automatically proceed with login if token is valid
        if (token) {
            handleGoogleLogin(token);
        }
    };

    const handleLogout = async () => {
        try {
            const logoutSuccess = await logout();
            if (logoutSuccess) {
                setUser(null);
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Logout error', error);
            Swal.fire({
                title: 'Logout Error',
                text: 'An error occurred during logout. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33'
            });
        }
    };

    const renderAvatar = (size: 'small' | 'medium' | 'large') => {
        const sizeClasses = {
            small: 'w-8 h-8',
            medium: 'w-12 h-12',
            large: 'w-16 h-16',
        };

        const avatarSrc = user?.photoURL || defaultAvatarPath;

        return (
            <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden`}>
                <Image
                    src={avatarSrc}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = defaultAvatarPath;
                    }}
                />
            </div>
        );
    };

    // Google logo SVG component
    const GoogleLogo = () => (
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );

    if (isMobile) {
        return user ? (
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"} rounded-lg p-3 mx-2`}>
                <div className="flex items-center">
                    <div className="w-8 h-8 mr-2">
                        {renderAvatar('small')}
                    </div>
                    <div>
                        <p className="font-medium">{user.name}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                    </div>
                </div>
                <div className="flex mt-3 space-x-2">
                    <Link
                        href="/profile"
                        className={`flex-1 py-2 text-center ${isDarkMode ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/50" : "bg-blue-50 text-blue-600 hover:bg-blue-100"} rounded-md transition-colors`}
                    >
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={`flex-1 py-2 text-center ${isDarkMode ? "bg-red-900/30 text-red-300 hover:bg-red-900/50" : "bg-red-50 text-red-600 hover:bg-red-100"} rounded-md transition-colors`}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        ) : (
            <div className="mt-2 w-full">
                {showRecaptcha ? (
                    <div className="mb-3 flex flex-col items-center">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "your-recaptcha-site-key"}
                            onChange={onReCaptchaChange}
                            size="normal"
                        />
                        <button
                            onClick={() => setShowRecaptcha(false)}
                            className="mt-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={initiateGoogleLogin}
                        className="block w-full py-3 px-4 rounded-md bg-white border border-gray-300 shadow-sm hover:shadow-md text-gray-700 font-medium transition-all flex items-center justify-center"
                    >
                        <GoogleLogo />
                        Login with Google
                    </button>
                )}
            </div>
        );
    }

    if (isLoading) {
        return <div className={`animate-pulse ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} h-10 w-24 rounded-full`}></div>;
    }

    return user ? (
        <div ref={userMenuRef} className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`ml-3 p-1 rounded-full ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} transition-colors flex items-center justify-center group`}
            >
                <div className="w-8 h-8 mr-2">
                    {renderAvatar('small')}
                </div>
                <span className="text-sm font-medium">{user.name.split(' ').pop()}</span>
            </button>

            {isDropdownOpen && <UserProfileDropdown user={user} handleLogout={handleLogout} setIsDropdownOpen={setIsDropdownOpen} renderAvatar={renderAvatar} />}
        </div>
    ) : (
        <div className="flex flex-col items-center ml-3">
            {showRecaptcha ? (
                <div className="flex flex-col items-center">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "your-recaptcha-site-key"}
                        onChange={onReCaptchaChange}
                        size="normal"
                    />
                    <button
                        onClick={() => setShowRecaptcha(false)}
                        className="mt-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={initiateGoogleLogin}
                    className="px-4 py-2 rounded-md bg-white border border-gray-300 shadow-sm hover:shadow-md text-gray-700 font-medium transition-all flex items-center justify-center"
                    aria-label="Login with Google"
                >
                    <GoogleLogo />
                    <span>Login</span>
                </button>
            )}
        </div>
    );
};

interface UserProfileDropdownProps {
    user: User;
    handleLogout: () => Promise<void>;
    setIsDropdownOpen: (isOpen: boolean) => void;
    renderAvatar: (size: "small" | "medium" | "large") => React.ReactNode;
}


const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
    user,
    handleLogout,
    setIsDropdownOpen,
}) => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`absolute z-50 right-0 mt-2 w-72 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'} ring-1 ring-black ring-opacity-5 overflow-hidden`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                <div className="flex items-center">
                    <div>
                        <p className="font-bold text-lg">{user.name}</p>
                        <p className="text-sm opacity-80">{user.email}</p>
                    </div>
                </div>
            </div>
            <div className="py-2">
                <Link
                    href="/profile"
                    className={`flex items-center px-4 py-3 ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} transition-colors`}
                    onClick={() => setIsDropdownOpen(false)}
                >
                    <UserCircle size={20} className={`mr-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
                    <span>Profile</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className={`flex items-center w-full px-4 py-3 text-left ${isDarkMode ? "hover:bg-gray-800 text-red-400" : "hover:bg-gray-100 text-red-600"} transition-colors`}
                >
                    <LogOut size={20} className="mr-3" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};