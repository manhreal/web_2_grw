'use client';

import React, { useState, useEffect } from 'react';
import AnimatedInput from '../suport-page/AnimatedInput';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useTheme } from '@/context/ThemeContext';
import { createAdvising } from '@/api/advising';

// Interface for user advice data
interface UserAdvice {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
}

// Interface definitions for location data
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

interface AdviseProps {
    onClose?: () => void;
}

export default function Advise({ onClose }: AdviseProps) {
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // User advice data state
    const [userData, setUserData] = useState<UserAdvice>({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
    });

    // Form validation errors
    const [fieldErrors, setFieldErrors] = useState({
        fullName: '',
        email: '',
        phone: '',
        province: '',
        district: '',
        ward: ''
    });

    // Track which fields have been touched by the user
    const [touchedFields, setTouchedFields] = useState({
        fullName: false,
        email: false,
        phone: false,
        province: false,
        district: false,
        ward: false,
        streetAddress: false
    });

    // States for address selection
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedAddress, setSelectedAddress] = useState({
        province: '',
        district: '',
        ward: '',
        streetAddress: ''
    });
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    // Form validity state
    const [isFormValid, setIsFormValid] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Mark field as touched
        if (!touchedFields[name as keyof typeof touchedFields]) {
            setTouchedFields(prev => ({
                ...prev,
                [name]: true
            }));
        }
    };

    // Handle input blur - mark field as touched when user leaves a field
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name } = e.target;
        setTouchedFields(prev => ({
            ...prev,
            [name]: true
        }));
    };

    // Fetch provinces when component mounts
    useEffect(() => {
        const fetchProvinces = async () => {
            setLoadingProvinces(true);
            try {
                const response = await fetch('https://provinces.open-api.vn/api/p/');
                if (!response.ok) {
                    throw new Error('Failed to fetch provinces');
                }
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
                setError('Failed to load provinces. Please try again later.');
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
            setWards([]);
            setSelectedAddress(prev => ({ ...prev, district: '', ward: '' }));
            return;
        }

        const fetchDistricts = async () => {
            setLoadingDistricts(true);
            setWards([]);
            setSelectedAddress(prev => ({ ...prev, district: '', ward: '' }));
            try {
                const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedAddress.province}?depth=2`);
                if (!response.ok) {
                    throw new Error('Failed to fetch districts');
                }
                const data = await response.json();
                setDistricts(data.districts || []);
            } catch (error) {
                console.error('Error fetching districts:', error);
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
            setSelectedAddress(prev => ({ ...prev, ward: '' }));
            return;
        }

        const fetchWards = async () => {
            setLoadingWards(true);
            setSelectedAddress(prev => ({ ...prev, ward: '' }));
            try {
                const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedAddress.district}?depth=2`);
                if (!response.ok) {
                    throw new Error('Failed to fetch wards');
                }
                const data = await response.json();
                setWards(data.wards || []);
            } catch (error) {
                console.error('Error fetching wards:', error);
                setWards([]);
            } finally {
                setLoadingWards(false);
            }
        };

        fetchWards();
    }, [selectedAddress.district]);

    // Update full address whenever a part of it changes
    useEffect(() => {
        const provinceName = provinces.find(p => p.code.toString() === selectedAddress.province)?.name || '';
        const districtName = districts.find(d => d.code.toString() === selectedAddress.district)?.name || '';
        const wardName = wards.find(w => w.code.toString() === selectedAddress.ward)?.name || '';

        const addressParts = [];
        if (selectedAddress.streetAddress) addressParts.push(selectedAddress.streetAddress);
        if (wardName) addressParts.push(wardName);
        if (districtName) addressParts.push(districtName);
        if (provinceName) addressParts.push(provinceName);

        const fullAddress = addressParts.join(', ');

        if (fullAddress !== userData.address) {
            setUserData(prev => ({ ...prev, address: fullAddress }));
        }
    }, [selectedAddress, provinces, districts, wards, userData.address]);

    // Validate form on data change
    useEffect(() => {
        validateForm();
    }, [userData, selectedAddress]);

    // Handle address selection changes
    const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;

        setSelectedAddress(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'province' && { district: '', ward: '' }),
            ...(name === 'district' && { ward: '' }),
        }));

        // Mark field as touched
        setTouchedFields(prev => ({
            ...prev,
            [name]: true
        }));
    };

    // Validate form and update isFormValid state
    const validateForm = () => {
        // Reset field errors
        const newErrors = {
            fullName: '',
            email: '',
            phone: '',
            province: '',
            district: '',
            ward: ''
        };

        let valid = true;

        // Validation logic
        if (!userData.fullName?.trim()) {
            newErrors.fullName = 'Vui lòng điền họ và tên';
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userData.email?.trim()) {
            newErrors.email = 'Vui lòng điền Email';
            valid = false;
        } else if (!emailRegex.test(userData.email)) {
            newErrors.email = 'Email không đúng định dạng';
            valid = false;
        }

        const phoneRegex = /^\+?[0-9]{8,15}$/;
        if (!userData.phone?.trim()) {
            newErrors.phone = 'Vui lòng điền số điện thoại';
            valid = false;
        } else if (!phoneRegex.test(userData.phone)) {
            newErrors.phone = 'Số điện thoại không đúng định dạng';
            valid = false;
        }

        if (!selectedAddress.province) {
            newErrors.province = 'Vui lòng chọn Tỉnh/Thành phố';
            valid = false;
        }

        if (selectedAddress.province && !selectedAddress.district) {
            newErrors.district = 'Vui lòng chọn Quận/Huyện';
            valid = false;
        }

        if (selectedAddress.district && !selectedAddress.ward) {
            newErrors.ward = 'Vui lòng chọn Phường/Xã';
            valid = false;
        }

        setFieldErrors(newErrors);
        setIsFormValid(valid);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched on submit
        setTouchedFields({
            fullName: true,
            email: true,
            phone: true,
            province: true,
            district: true,
            ward: true,
            streetAddress: true
        });

        setFormSubmitted(true);

        if (!isFormValid) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Prepare the data for API submission
            const advisingData = {
                fullName: userData.fullName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                notes: userData.notes
            };

            // Call the API to create advising
            await createAdvising(advisingData);

            Swal.fire({
                title: 'Đơn tư vấn đã được gửi thành công!',
                html: `
                <p>Cảm ơn bạn đã quan tâm. Chúng tôi sẽ sớm phản hồi cho bạn.</p>
                <p class="mt-3">Vui lòng check email của bạn <strong>${userData.email}</strong> và số điện thoại <strong>${userData.phone}</strong> để nhận thông tin sớm nhất.</p>
                <div class="mt-4 text-left p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg">
                    <p class="font-semibold">Bạn cũng có thể liên hệ với chúng tôi qua:</p>
                    <p class="mt-2"><span class="font-medium">Phone:</span> +84 123 456 789</p>
                    <p><span class="font-medium">Facebook:</span> facebook.com/englishcenter</p>
                    <p><span class="font-medium">Zalo:</span> zalo.me/englishcenter</p>
                </div>
            `,
                icon: 'success',
                confirmButtonText: 'Close',
                confirmButtonColor: '#3B82F6',
                background: isDarkMode ? '#1F2937' : '#FFFFFF',
                color: isDarkMode ? '#F3F4F6' : '#000000',
            }).then(() => {
                if (onClose) onClose();
            });

            // Reset form after successful submission
            setUserData({ fullName: '', email: '', phone: '', address: '', notes: '' });
            setSelectedAddress({ province: '', district: '', ward: '', streetAddress: '' });
            setFieldErrors({ fullName: '', email: '', phone: '', province: '', district: '', ward: '' });
        } catch (err: unknown) {
            console.error('Error submitting form:', err);

            // Check if the error contains the rate limit message
            if (err instanceof Error && err.message.includes('Quá nhiều yêu cầu đến')) {
                // Use SweetAlert for rate limit errors
                Swal.fire({
                    title: 'Giới hạn yêu cầu',
                    text: 'Quá nhiều yêu cầu đến. Vui lòng thử lại sau 1 phút.',
                    icon: 'warning',
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#3085d6',
                    background: isDarkMode ? '#1F2937' : '#FFFFFF',
                    color: isDarkMode ? '#F3F4F6' : '#000000'
                });
            } else {
                // Handle other errors
                setError('Không thể gửi đơn tư vấn. Vui lòng thử lại sau.');

                // You can also show an error SweetAlert if you prefer
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Không thể gửi đơn tư vấn. Vui lòng thử lại sau.',
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#3085d6',
                    background: isDarkMode ? '#1F2937' : '#FFFFFF',
                    color: isDarkMode ? '#F3F4F6' : '#000000'
                });
            }
        } finally {
            setLoading(false);
        }
    };
    // Custom select component
    const SelectField = ({
        id, name, label, value, onChange, options, isLoading, error, touched
    }: {
        id: string; name: string; label: string; value: string;
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
        options: { id: string; name: string }[];
        isLoading: boolean; error?: string; touched?: boolean;
    }) => (
        <div className="relative">
            {label && (
                <label htmlFor={id} className={`block mb-1 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {label} {isLoading && <span className="ml-2 inline-block animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-500"></span>}
                </label>
            )}
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={handleBlur}
                disabled={isLoading || (name !== 'province' && !selectedAddress.province) || (name === 'ward' && !selectedAddress.district)}
                className={`w-full p-2.5 text-sm rounded-lg ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                    } ${error && touched
                        ? isDarkMode
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    } ${isLoading || (name !== 'province' && !selectedAddress.province) || (name === 'ward' && !selectedAddress.district)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
            >
                <option value="">
                    {name === 'province' ? '-- Select Province --' : name === 'district' ? '-- Select District --' : '-- Select Ward --'}
                </option>
                {!isLoading && options.map(option => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
                {isLoading && <option value="" disabled>Loading...</option>}
            </select>
            {error && touched && (
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
            )}
        </div>
    );

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

    return (
        <motion.div className={`${isDarkMode ? 'text-gray-100' : 'text-gray-800'} w-full`}>
            <motion.div variants={itemVariants}>
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 sm:p-6 rounded-lg shadow-md`}>
                    <motion.h1
                        variants={itemVariants}
                        className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center justify-center"
                    >
                        <span className="mr-2">📝</span> Tạo yêu cầu tư vấn miễn phí
                    </motion.h1>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${isDarkMode ? 'bg-red-900/50 border-red-700 text-red-200' : 'bg-red-100 border-red-400 text-red-700'
                                } px-4 py-2 rounded text-sm mb-4 border`}
                        >
                            <strong>Lỗi:</strong> {error}
                        </motion.div>
                    )}

                    <motion.form variants={itemVariants} onSubmit={handleSubmit} noValidate>
                        {/* Personal Information */}
                        <div className="md:space-y-3 space-y-1">
                            <AnimatedInput
                                id="fullName"
                                name="fullName"
                                label="Họ và tên"
                                type="text"
                                value={userData.fullName || ''}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                                error={touchedFields.fullName || formSubmitted ? fieldErrors.fullName : ''}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:gap-3">
                                <AnimatedInput
                                    id="email"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={userData.email || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    required
                                    error={touchedFields.email || formSubmitted ? fieldErrors.email : ''}
                                />

                                <AnimatedInput
                                    id="phone"
                                    name="phone"
                                    label="Số điện thoại"
                                    type="tel"
                                    value={userData.phone || ''}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    required
                                    error={touchedFields.phone || formSubmitted ? fieldErrors.phone : ''}
                                />
                            </div>
                        </div>

                        {/* Address Selection */}
                        <div className="mb-3">
                            <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Địa chỉ
                            </label>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <SelectField
                                    id="province"
                                    name="province"
                                    label=""
                                    value={selectedAddress.province}
                                    onChange={handleAddressChange}
                                    options={provinces.map(p => ({ id: p.code.toString(), name: p.name }))}
                                    isLoading={loadingProvinces}
                                    error={fieldErrors.province}
                                    touched={touchedFields.province || formSubmitted}
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
                                    touched={touchedFields.district || formSubmitted}
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
                                    touched={touchedFields.ward || formSubmitted}
                                />
                                <AnimatedInput
                                    id="streetAddress"
                                    name="streetAddress"
                                    label="Số nhà, tên đường"
                                    type="text"
                                    value={selectedAddress.streetAddress}
                                    onChange={handleAddressChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-4">
                            <label htmlFor="notes" className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Ghi chú
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={userData.notes || ''}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="Bất kì câu hỏi yêu cầu nào bạn cần"
                                rows={3}
                                className={`w-full p-2.5 text-sm rounded-lg ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className='flex justify-end gap-4'>
                            <motion.button
                                type="submit"
                                className={`flex-grow ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white py-2.5 px-6 rounded-lg transition duration-150 ease-in-out font-medium 
                                    ${!isFormValid || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!isFormValid || loading}
                                whileHover={isFormValid && !loading ? { scale: 1.03 } : {}}
                                whileTap={isFormValid && !loading ? { scale: 0.98 } : {}}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Đang gửi yêu cầu...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            ></path>
                                        </svg>
                                        Gửi yêu cầu
                                    </span>
                                )}
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={onClose}
                                className={`${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} 
                                    text-white py-2.5 px-6 rounded-lg transition duration-150 ease-in-out font-medium
                                    flex items-center justify-center`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                                Hủy
                            </motion.button>
                        </div>
                    </motion.form>
                </div>
            </motion.div>
        </motion.div>
    );
}