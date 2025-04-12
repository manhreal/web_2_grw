'use client';

import { News } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createNews, updateNews, deleteNews, uploadNewImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';

interface NewsManagerProps {
    news: News[];
    setNews: (news: News[]) => void;
}

export default function NewsManager({ news, setNews }: NewsManagerProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadNewImage(file);
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

    const handleSubmitNews = async (formData: unknown, newsItem: News | null) => {
        try {
            if (newsItem) {
                const updatedNews = await updateNews(newsItem._id, formData);
                setNews(news.map(n => n._id === newsItem._id ? updatedNews.data : n));
                showSuccessToast({ message: 'Đã cập nhật tin tức' });
            } else {
                const newNews = await createNews(formData);
                setNews([...news, newNews.data]);
                showSuccessToast({ message: 'Đã thêm tin tức mới' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    const handleDelete = async (newsItem: News) => {
        confirmDelete({
            itemName: newsItem.title,
            onConfirm: async () => {
                try {
                    await deleteNews(newsItem._id);
                    setNews(news.filter(n => n._id !== newsItem._id));
                    showSuccessToast({ message: 'Đã xóa tin tức' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    const openNewsForm = (newsItem: News | null) => {
        const currentDate = new Date().toISOString().split('T')[0];
        const publishedDate = newsItem?.publishedAt
            ? new Date(newsItem.publishedAt).toISOString().split('T')[0]
            : currentDate;

        openFormModal({
            title: newsItem ? 'Cập nhật tin tức' : 'Thêm tin tức mới',
            fields: [
                {
                    id: 'image',
                    label: 'Ảnh tin tức',
                    type: 'image',
                    defaultValue: newsItem?.image,
                    required: true
                },
                {
                    id: 'title',
                    label: 'Tiêu đề',
                    type: 'text',
                    defaultValue: newsItem?.title,
                    required: true,
                    maxLength: 200
                },
                {
                    id: 'summary',
                    label: 'Tóm tắt',
                    type: 'textarea',
                    defaultValue: newsItem?.summary,
                    required: true,
                    maxLength: 500
                },
                {
                    id: 'link',
                    label: 'Đường dẫn',
                    type: 'text',
                    defaultValue: newsItem?.link,
                    required: true
                },
                {
                    id: 'publishedAt',
                    label: 'Ngày xuất bản',
                    type: 'date',
                    defaultValue: publishedDate,
                    required: true
                }
            ],
            onImageUpload: handleImageUpload,
            onSubmit: (formData) => handleSubmitNews(formData, newsItem)
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Tin tức</h2>
                    <p className="text-gray-500 text-sm">Quản lý tin tức xuất hiện trên trang chủ</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openNewsForm(null)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Thêm tin tức
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày xuất bản</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {news.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 italic text-gray-500">
                                    Chưa có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            news.map((newsItem) => (
                                <tr key={newsItem._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={newsItem.image.startsWith('http') ? newsItem.image : `${SERVER_URL}${newsItem.image}`}
                                            alt={newsItem.title}
                                            width={40}
                                            height={40}
                                            className="object-cover rounded"
                                            placeholder="blur"
                                            blurDataURL="/default-image.png"
                                        />
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate">{newsItem.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(newsItem.publishedAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(newsItem.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                onClick={() => openNewsForm(newsItem)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                                onClick={() => handleDelete(newsItem)}
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