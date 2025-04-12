'use client';

import { Banner } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createBanner, updateBanner, deleteBanner, uploadBannerImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';

interface BannerManagerProps {
    banners: Banner[];
    setBanners: (banners: Banner[]) => void;
}

export default function BannerManager({ banners, setBanners }: BannerManagerProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadBannerImage(file);
            if (!response.imageUrl) {
                throw new Error('Không nhận được URL ảnh từ server');
            }
            return response.imageUrl.startsWith('http')
                ? response.imageUrl
                : `${SERVER_URL}${response.imageUrl}`;
        } catch (error) {
            console.error('Upload error:', error);
            throw new Error(error.message || 'Upload ảnh thất bại');
        }
    };

    const handleSubmitBanner = async (formData: unknown, partner: Banner | null) => {
        try {
            if (partner) {
                const updatedBanner = await updateBanner(partner._id, formData);
                setBanners(banners.map(p => p._id === partner._id ? updatedBanner.data : p));
                showSuccessToast({ message: 'Đã cập nhật thông tin banner' });
            } else {
                const newBanner = await createBanner(formData);
                setBanners([...banners, newBanner.data]);
                showSuccessToast({ message: 'Đã thêm banner mới' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    const handleDelete = async (partner: Banner) => {
        confirmDelete({
            itemName: partner.name,
            onConfirm: async () => {
                try {
                    await deleteBanner(partner._id);
                    setBanners(banners.filter(p => p._id !== partner._id));
                    showSuccessToast({ message: 'Đã xóa banner' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    const openBannerForm = (partner: Banner | null) => {
        openFormModal({
            title: partner ? 'Cập nhật banner' : 'Thêm banner mới',
            fields: [
                {
                    id: 'image',
                    label: 'Ảnh banner',
                    type: 'image',
                    defaultValue: partner?.image,
                    required: true
                },
                {
                    id: 'name',
                    label: 'Tên banner',
                    type: 'text',
                    defaultValue: partner?.name,
                    required: true,
                    maxLength: 100
                }
            ],
            onImageUpload: handleImageUpload,
            onSubmit: (formData) => handleSubmitBanner(formData, partner)
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Danh sách banner</h2>
                    <p className="text-gray-500 text-sm">Quản lý danh sách banner xuất hiện trên trang chủ</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openBannerForm(null)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Thêm banner
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {banners.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-6 italic text-gray-500">
                                    Chưa có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            banners.map((partner) => (
                                <tr key={partner._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={partner.image.startsWith('http') ? partner.image : `${SERVER_URL}${partner.image}`}
                                            alt={partner.name}
                                            width={40}
                                            height={40}
                                            className="object-cover rounded"
                                            onError={() => {/* Next.js Image handles errors differently */ }}
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
                                                onClick={() => openBannerForm(partner)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                                onClick={() => handleDelete(partner)}
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