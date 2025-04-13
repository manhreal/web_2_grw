'use client';

import { useMemo } from 'react';
import { Partner } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createPartner, updatePartner, deletePartner, uploadPartnerImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';

// Interface definitions
interface PartnerManagerProps {
    partners: Partner[];
    setPartners: (partners: Partner[]) => void;
}

export default function PartnerManager({ partners, setPartners }: PartnerManagerProps) {
    // Memoize the sorted partners to avoid unnecessary re-sorting
    const sortedPartners = useMemo(() => {
        return [...partners].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [partners]);

    // Utility functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US');
    };

    // Image upload handler
    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadPartnerImage(file);
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
    const handleSubmitPartner = async (formData: unknown, partner: Partner | null) => {
        try {
            if (partner) {
                // Update existing partner
                const updatedPartner = await updatePartner(partner._id, formData);
                setPartners(partners.map(p => p._id === partner._id ? updatedPartner.data : p));
                showSuccessToast({ message: 'Partner updated successfully' });
            } else {
                // Create new partner
                const newPartner = await createPartner(formData);
                setPartners([...partners, newPartner.data]);
                showSuccessToast({ message: 'New partner added successfully' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    // Delete handler
    const handleDelete = async (partner: Partner) => {
        confirmDelete({
            itemName: partner.name,
            onConfirm: async () => {
                try {
                    await deletePartner(partner._id);
                    setPartners(partners.filter(p => p._id !== partner._id));
                    showSuccessToast({ message: 'Partner deleted successfully' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    // Partner form handler
    const openPartnerForm = (partner: Partner | null) => {
        openFormModal({
            title: partner ? 'Update Partner' : 'Add New Partner',
            fields: [
                {
                    id: 'image',
                    label: 'Partner Image',
                    type: 'image',
                    defaultValue: partner?.image,
                    required: true
                },
                {
                    id: 'name',
                    label: 'Partner Name',
                    type: 'text',
                    defaultValue: partner?.name,
                    required: true,
                    maxLength: 100
                }
            ],
            onImageUpload: handleImageUpload,
            onSubmit: (formData) => handleSubmitPartner(formData, partner)
        });
    };

    // Render component
    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Header section */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Partners</h2>
                    <p className="text-gray-500 text-sm">Manage partners displayed on the homepage</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openPartnerForm(null)}
                    aria-label="Add new partner"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Partner
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
                        {sortedPartners.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-6 italic text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            sortedPartners.map((partner) => (
                                <tr key={partner._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={partner.image.startsWith('http') ? partner.image : `${SERVER_URL}${partner.image}`}
                                            alt={partner.name}
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
                                    <td className="px-6 py-4 whitespace-nowrap">{partner.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(partner.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                onClick={() => openPartnerForm(partner)}
                                                aria-label="Edit partner"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                                onClick={() => handleDelete(partner)}
                                                aria-label="Delete partner"
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