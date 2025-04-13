'use client';

import { Banner } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createBanner, updateBanner, deleteBanner, uploadBannerImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';
import { useMemo } from 'react';

// Interface definitions
interface BannerManagerProps {
    banners: Banner[];
    setBanners: (banners: Banner[]) => void;
}

export default function BannerManager({ banners, setBanners }: BannerManagerProps) {
    // Utility functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US');
    };

    // Memoize the sorted banners to avoid unnecessary re-sorting
    const sortedBanners = useMemo(() => {
        return [...banners].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [banners]);

    // Image upload handler
    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadBannerImage(file);
            if (!response.imageUrl) {
                throw new Error('No image URL received from server');
            }
            return response.imageUrl.startsWith('http')
                ? response.imageUrl
                : `${SERVER_URL}${response.imageUrl}`;
        } catch (error) {
            console.error('Upload error:', error);
            throw new Error(error.message || 'Image upload failed');
        }
    };

    // Form submission handler
    const handleSubmitBanner = async (formData: unknown, banner: Banner | null) => {
        try {
            if (banner) {
                // Update existing banner
                const updatedBanner = await updateBanner(banner._id, formData);
                setBanners(banners.map(b => b._id === banner._id ? updatedBanner.data : b));
                showSuccessToast({ message: 'Banner information updated successfully' });
            } else {
                // Create new banner
                const newBanner = await createBanner(formData);
                setBanners([...banners, newBanner.data]);
                showSuccessToast({ message: 'New banner added successfully' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    // Delete handler
    const handleDelete = async (banner: Banner) => {
        confirmDelete({
            itemName: banner.name,
            onConfirm: async () => {
                try {
                    await deleteBanner(banner._id);
                    setBanners(banners.filter(b => b._id !== banner._id));
                    showSuccessToast({ message: 'Banner deleted successfully' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    // Banner form handler
    const openBannerForm = (banner: Banner | null) => {
        openFormModal({
            title: banner ? 'Update Banner' : 'Add New Banner',
            fields: [
                {
                    id: 'image',
                    label: 'Banner Image',
                    type: 'image',
                    defaultValue: banner?.image,
                    required: true
                },
                {
                    id: 'name',
                    label: 'Banner Name',
                    type: 'text',
                    defaultValue: banner?.name,
                    required: true,
                    maxLength: 100
                }
            ],
            onImageUpload: handleImageUpload,
            onSubmit: (formData) => handleSubmitBanner(formData, banner)
        });
    };

    // Render component
    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Header section */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Banner List</h2>
                    <p className="text-gray-500 text-sm">Manage banners displayed on the homepage</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openBannerForm(null)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Banner
                </button>
            </div>

            {/* Table section */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedBanners.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-6 italic text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            sortedBanners.map((banner) => (
                                <tr key={banner._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={banner.image.startsWith('http') ? banner.image : `${SERVER_URL}${banner.image}`}
                                            alt={banner.name}
                                            width={40}
                                            height={40}
                                            className="object-cover rounded"
                                            onError={(e) => {
                                                // Fallback for image loading errors
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/default-image.png';
                                            }}
                                            placeholder="blur"
                                            blurDataURL="/default-image.png"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{banner.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(banner.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                onClick={() => openBannerForm(banner)}
                                                aria-label="Edit banner"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                                onClick={() => handleDelete(banner)}
                                                aria-label="Delete banner"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}