'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserTest } from '@/api/testFree';
import AnimatedInput from '../suport-page/AnimatedInput';
import TopUsersLeaderboard from './TopUsersLeaderboard';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useTheme } from '@/context/ThemeContext';

// Interface definitions
interface UserTestInfoProps {
    userData: UserTest;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleRegistration: (e: React.FormEvent) => void;
    loading: boolean;
    error: string | null;
}

interface Province {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    phone_code: number;
    districts?: District[];
}

interface District {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    province_code: number;
    wards?: Ward[];
}

interface Ward {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    district_code: number;
}

// Select field component
const SelectField = ({
    id,
    name,
    label,
    value,
    onChange,
    options,
    isLoading,
    error,
    isDarkMode
}: {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { id: string; name: string }[];
    isLoading: boolean;
    error?: string;
    isDarkMode: boolean;
}) => (
    <div className="mb-4 relative">
        <label htmlFor={id} className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {label} {isLoading && <span className="ml-2 inline-block animate-pulse">Loading...</span>}
        </label>
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={isLoading || options.length === 0}
            className={`w-full p-2.5 text-sm rounded-lg ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                } ${error ? 'border-red-500' : ''} ${isLoading || options.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <option key={`${name}-default`} value="">-- Select {label} --</option>
            {options.map(option => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
        {error && (
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        )}
    </div>
);

// Main component
export default function UserTestInfo({
    userData,
    handleInputChange,
    handleRegistration,
    loading,
    error
}: UserTestInfoProps) {
    // Theme context
    const { isDarkMode } = useTheme();

    // Form validation state
    const [fieldErrors, setFieldErrors] = useState({
        fullName: '',
        email: '',
        phone: '',
        province: '',
        district: '',
        ward: ''
    });

    // Address data states
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedAddress, setSelectedAddress] = useState({
        province: '',
        district: '',
        ward: '',
        streetAddress: ''
    });

    // Loading states
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    // Animation variants
    const pageVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    // Fetch provinces data
    useEffect(() => {
        const fetchProvinces = async () => {
            setLoadingProvinces(true);
            try {
                const response = await fetch('https://provinces.open-api.vn/api/p/');
                if (!response.ok) {
                    throw new Error('Error loading province list');
                }
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Error loading province list:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Error loading province list. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#3B82F6'
                });
            } finally {
                setLoadingProvinces(false);
            }
        };

        fetchProvinces();
    }, []);

    // Fetch districts when province changes
    useEffect(() => {
        if (!selectedAddress.province) {
            setDistricts([]);
            return;
        }

        const fetchDistricts = async () => {
            setLoadingDistricts(true);
            try {
                const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedAddress.province}?depth=2`);
                if (!response.ok) {
                    throw new Error('Error loading district list');
                }
                const data = await response.json();
                setDistricts(data.districts || []);
            } catch (error) {
                console.error('Error loading district list:', error);
                setDistricts([]);
            } finally {
                setLoadingDistricts(false);
            }
        };

        fetchDistricts();
    }, [selectedAddress.province]);

    // Fetch wards when district changes
    useEffect(() => {
        if (!selectedAddress.district) {
            setWards([]);
            return;
        }

        const fetchWards = async () => {
            setLoadingWards(true);
            try {
                const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedAddress.district}?depth=2`);
                if (!response.ok) {
                    throw new Error('Error loading ward list');
                }
                const data = await response.json();
                setWards(data.wards || []);
            } catch (error) {
                console.error('Error loading ward list:', error);
                setWards([]);
            } finally {
                setLoadingWards(false);
            }
        };

        fetchWards();
    }, [selectedAddress.district]);

    // Handle address selection changes
    const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;

        setSelectedAddress(prev => {
            const newState = { ...prev, [name]: value };

            // Reset dependent fields
            if (name === 'province') {
                newState.district = '';
                newState.ward = '';
            } else if (name === 'district') {
                newState.ward = '';
            }

            return newState;
        });

        // Only update the address if this is a select field change
        if (name !== 'streetAddress') {
            // Find the names for the selected IDs
            setTimeout(() => {
                const updatedAddress = { ...selectedAddress, [name]: value };

                const provinceName = provinces.find(p => p.code.toString() === updatedAddress.province)?.name || '';
                const districtName = districts.find(d => d.code.toString() === updatedAddress.district)?.name || '';
                const wardName = wards.find(w => w.code.toString() === updatedAddress.ward)?.name || '';

                // Construct full address
                let fullAddress = updatedAddress.streetAddress ? updatedAddress.streetAddress + ', ' : '';
                if (wardName) fullAddress += wardName + ', ';
                if (districtName) fullAddress += districtName + ', ';
                if (provinceName) fullAddress += provinceName;

                // Create a synthetic event to update the parent's userData state
                const syntheticEvent = {
                    target: {
                        name: 'address',
                        value: fullAddress.trim()
                    }
                } as React.ChangeEvent<HTMLInputElement>;

                handleInputChange(syntheticEvent);
            }, 0);
        } else {
            // Handle street address changes
            const provinceName = provinces.find(p => p.code.toString() === selectedAddress.province)?.name || '';
            const districtName = districts.find(d => d.code.toString() === selectedAddress.district)?.name || '';
            const wardName = wards.find(w => w.code.toString() === selectedAddress.ward)?.name || '';

            // Construct full address
            let fullAddress = value ? value + ', ' : '';
            if (wardName) fullAddress += wardName + ', ';
            if (districtName) fullAddress += districtName + ', ';
            if (provinceName) fullAddress += provinceName;

            // Create a synthetic event to update the parent's userData state
            const syntheticEvent = {
                target: {
                    name: 'address',
                    value: fullAddress.trim()
                }
            } as React.ChangeEvent<HTMLInputElement>;

            handleInputChange(syntheticEvent);
        }
    }, [selectedAddress, provinces, districts, wards, handleInputChange]);

    // Form validation function
    const validateForm = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        // Reset field errors
        setFieldErrors({
            fullName: '',
            email: '',
            phone: '',
            province: '',
            district: '',
            ward: ''
        });

        let isValid = true;
        const newErrors = {
            fullName: '',
            email: '',
            phone: '',
            province: '',
            district: '',
            ward: ''
        };

        // Validate fullName
        if (!userData.fullName?.trim()) {
            newErrors.fullName = 'Full name is required';
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userData.email?.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(userData.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        // Validate phone
        const phoneRegex = /^\+?[0-9]{8,15}$/;
        if (!userData.phone?.trim()) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (!phoneRegex.test(userData.phone)) {
            newErrors.phone = 'Invalid phone format (8-15 digits)';
            isValid = false;
        }

        // Validate address
        if (!selectedAddress.province) {
            newErrors.province = 'Province is required';
            isValid = false;
        }

        if (selectedAddress.province && !selectedAddress.district) {
            newErrors.district = 'District is required';
            isValid = false;
        }

        if (selectedAddress.district && !selectedAddress.ward) {
            newErrors.ward = 'Ward is required';
            isValid = false;
        }

        if (!isValid) {
            setFieldErrors(newErrors);

            // Show SweetAlert with validation errors
            Swal.fire({
                title: 'Validation Error',
                html: `
                    <div class="text-left">
                        ${newErrors.fullName ? `<p class="${isDarkMode ? 'text-red-400' : 'text-red-500'}">• ${newErrors.fullName}</p>` : ''}
                        ${newErrors.email ? `<p class="${isDarkMode ? 'text-red-400' : 'text-red-500'}">• ${newErrors.email}</p>` : ''}
                        ${newErrors.phone ? `<p class="${isDarkMode ? 'text-red-400' : 'text-red-500'}">• ${newErrors.phone}</p>` : ''}
                        ${newErrors.province ? `<p class="${isDarkMode ? 'text-red-400' : 'text-red-500'}">• ${newErrors.province}</p>` : ''}
                        ${newErrors.district ? `<p class="${isDarkMode ? 'text-red-400' : 'text-red-500'}">• ${newErrors.district}</p>` : ''}
                        ${newErrors.ward ? `<p class="${isDarkMode ? 'text-red-400' : 'text-red-500'}">• ${newErrors.ward}</p>` : ''}
                    </div>
                `,
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#3B82F6',
                background: isDarkMode ? '#1F2937' : '#FFFFFF',
                color: isDarkMode ? '#F3F4F6' : '#000000',
            });

            return;
        }

        // If form is valid, show loading state and continue with registration
        Swal.fire({
            title: 'Registering...',
            html: 'Please wait while we process your registration',
            allowOutsideClick: false,
            background: isDarkMode ? '#1F2937' : '#FFFFFF',
            color: isDarkMode ? '#F3F4F6' : '#000000',
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Continue with the original form submission
        handleRegistration(e);
    }, [userData, selectedAddress, isDarkMode, handleRegistration]);

    // Render component
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageVariants}
            className={`container pt-10 mx-auto px-4 ${isDarkMode ? 'text-gray-100' : ''}`}
        >
            {/* Responsive layout container */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col-reverse md:flex-row md:gap-6"
            >
                {/* Registration Form - 1/3 width on desktop, full width on mobile */}
                <motion.div
                    variants={itemVariants}
                    className="md:w-1/3 w-full"
                >
                    <motion.div
                        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md mb-6`}
                        whileHover={{ boxShadow: isDarkMode ? "0 10px 25px -5px rgba(30, 58, 138, 0.15)" : "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.p
                            variants={itemVariants}
                            className="mb-4"
                        >
                            Please fill in your information before taking the test.
                        </motion.p>
                        <motion.p
                            variants={itemVariants}
                            className="mb-4"
                        >
                            *Your information will be used to send you a free consultation request and evaluation based on your test.
                        </motion.p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`${isDarkMode ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded mb-4 border`}
                            >
                                <strong>Error:</strong> {error}
                            </motion.div>
                        )}

                        <motion.form variants={itemVariants} onSubmit={validateForm}>
                            <AnimatedInput
                                id="fullName"
                                name="fullName"
                                label="Full Name"
                                type='text'
                                value={userData.fullName || ''}
                                onChange={handleInputChange}
                                required
                                error={fieldErrors.fullName}
                            />

                            <AnimatedInput
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                                value={userData.email || ''}
                                onChange={handleInputChange}
                                required
                                error={fieldErrors.email}
                            />

                            <AnimatedInput
                                id="phone"
                                name="phone"
                                label="Phone Number"
                                type="tel"
                                value={userData.phone || ''}
                                onChange={handleInputChange}
                                required
                                error={fieldErrors.phone}
                            />

                            {/* Address Selection */}
                            <div className="mb-4">
                                <div className='grid grid-cols-2 gap-4'>
                                    <SelectField
                                        id="province"
                                        name="province"
                                        label=""
                                        value={selectedAddress.province}
                                        onChange={handleAddressChange}
                                        options={provinces.map(p => ({ id: p.code.toString(), name: p.name }))}
                                        isLoading={loadingProvinces}
                                        error={fieldErrors.province}
                                        isDarkMode={isDarkMode}
                                    />

                                    <SelectField
                                        id="district"
                                        name="district"
                                        label=""
                                        value={selectedAddress.district}
                                        onChange={handleAddressChange}
                                        options={districts.map(d => ({ id: d.code.toString(), name: d.name }))}
                                        isLoading={loadingDistricts}
                                        error={fieldErrors.district}
                                        isDarkMode={isDarkMode}
                                    />

                                    <SelectField
                                        id="ward"
                                        name="ward"
                                        label=""
                                        value={selectedAddress.ward}
                                        onChange={handleAddressChange}
                                        options={wards.map(w => ({ id: w.code.toString(), name: w.name }))}
                                        isLoading={loadingWards}
                                        error={fieldErrors.ward}
                                        isDarkMode={isDarkMode}
                                    />

                                    {/* Street Address */}
                                    <div>
                                        <input
                                            type="text"
                                            id="streetAddress"
                                            name="streetAddress"
                                            value={selectedAddress.streetAddress}
                                            onChange={handleAddressChange}
                                            placeholder="House number, street name"
                                            className={`w-full mt-2 p-2.5 text-sm rounded-lg ${isDarkMode
                                                    ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                                                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                className={`w-full ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 px-4 rounded transition`}
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    'Register & Continue'
                                )}
                            </motion.button>
                        </motion.form>
                    </motion.div>
                </motion.div>

                {/* Top Users Leaderboard - 2/3 width on desktop, full width on mobile */}
                <motion.div
                    variants={itemVariants}
                    className="md:w-2/3 w-full mb-6 md:mb-0"
                >
                    <TopUsersLeaderboard />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}