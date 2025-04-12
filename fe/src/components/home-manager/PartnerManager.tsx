'use client';

import { Partner } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createPartner, updatePartner, deletePartner, uploadPartnerImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';

interface PartnerManagerProps {
    partners: Partner[];
    setPartners: (partners: Partner[]) => void;
}

export default function PartnerManager({ partners, setPartners }: PartnerManagerProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadPartnerImage(file);
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

    const handleSubmitPartner = async (formData: unknown, partner: Partner | null) => {
        try {
            if (partner) {
                const updatedPartner = await updatePartner(partner._id, formData);
                setPartners(partners.map(p => p._id === partner._id ? updatedPartner.data : p));
                showSuccessToast({ message: 'Đã cập nhật thông tin đối tác' });
            } else {
                const newPartner = await createPartner(formData);
                setPartners([...partners, newPartner.data]);
                showSuccessToast({ message: 'Đã thêm đối tác mới' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    const handleDelete = async (partner: Partner) => {
        confirmDelete({
            itemName: partner.name,
            onConfirm: async () => {
                try {
                    await deletePartner(partner._id);
                    setPartners(partners.filter(p => p._id !== partner._id));
                    showSuccessToast({ message: 'Đã xóa đối tác' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    const openPartnerForm = (partner: Partner | null) => {
        openFormModal({
            title: partner ? 'Cập nhật đối tác' : 'Thêm đối tác mới',
            fields: [
                {
                    id: 'image',
                    label: 'Ảnh đối tác',
                    type: 'image',
                    defaultValue: partner?.image,
                    required: true
                },
                {
                    id: 'name',
                    label: 'Tên đối tác',
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

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Danh sách đối tác</h2>
                    <p className="text-gray-500 text-sm">Quản lý danh sách đối tác xuất hiện trên trang chủ</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openPartnerForm(null)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Thêm đối tác
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
                        {partners.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-6 italic text-gray-500">
                                    Chưa có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            partners.map((partner) => (
                                <tr key={partner._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={partner.image.startsWith('http') ? partner.image : `${SERVER_URL}${partner.image}`}
                                            alt={partner.name}
                                            width={40}
                                            height={40}
                                            className="object-cover rounded"
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