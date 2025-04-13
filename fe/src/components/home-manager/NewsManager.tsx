'use client';

import { News } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createNews, updateNews, deleteNews, uploadNewImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';
import { useMemo } from 'react';

// Interface definitions
interface NewsManagerProps {
    news: News[];
    setNews: (news: News[]) => void;
}

export default function NewsManager({ news, setNews }: NewsManagerProps) {
    // Utility functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US');
    };

    // Memoize the sorted news to avoid unnecessary re-sorting
    const sortedNews = useMemo(() => {
        return [...news].sort((a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }, [news]);

    // Image upload handler
    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadNewImage(file);
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
    const handleSubmitNews = async (formData: unknown, newsItem: News | null) => {
        try {
            if (newsItem) {
                // Update existing news
                const updatedNews = await updateNews(newsItem._id, formData);
                setNews(news.map(n => n._id === newsItem._id ? updatedNews.data : n));
                showSuccessToast({ message: 'News updated successfully' });
            } else {
                // Create new news
                const newNews = await createNews(formData);
                setNews([...news, newNews.data]);
                showSuccessToast({ message: 'New news item added successfully' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    // Delete handler
    const handleDelete = async (newsItem: News) => {
        confirmDelete({
            itemName: newsItem.title,
            onConfirm: async () => {
                try {
                    await deleteNews(newsItem._id);
                    setNews(news.filter(n => n._id !== newsItem._id));
                    showSuccessToast({ message: 'News deleted successfully' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    // News form handler
    const openNewsForm = (newsItem: News | null) => {
        const currentDate = new Date().toISOString().split('T')[0];
        const publishedDate = newsItem?.publishedAt
            ? new Date(newsItem.publishedAt).toISOString().split('T')[0]
            : currentDate;

        openFormModal({
            title: newsItem ? 'Update News' : 'Add New News',
            fields: [
                {
                    id: 'image',
                    label: 'News Image',
                    type: 'image',
                    defaultValue: newsItem?.image,
                    required: true
                },
                {
                    id: 'title',
                    label: 'Title',
                    type: 'text',
                    defaultValue: newsItem?.title,
                    required: true,
                    maxLength: 200
                },
                {
                    id: 'summary',
                    label: 'Summary',
                    type: 'textarea',
                    defaultValue: newsItem?.summary,
                    required: true,
                    maxLength: 500
                },
                {
                    id: 'link',
                    label: 'URL',
                    type: 'text',
                    defaultValue: newsItem?.link,
                    required: true
                },
                {
                    id: 'publishedAt',
                    label: 'Publication Date',
                    type: 'date',
                    defaultValue: publishedDate,
                    required: true
                }
            ],
            onImageUpload: handleImageUpload,
            onSubmit: (formData) => handleSubmitNews(formData, newsItem)
        });
    };

    // Render component
    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Header section */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">News</h2>
                    <p className="text-gray-500 text-sm">Manage news items displayed on the homepage</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openNewsForm(null)}
                    aria-label="Add new news"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add News
                </button>
            </div>

            {/* Table section */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publication Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedNews.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 italic text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            sortedNews.map((newsItem) => (
                                <tr key={newsItem._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={newsItem.image.startsWith('http') ? newsItem.image : `${SERVER_URL}${newsItem.image}`}
                                            alt={newsItem.title}
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
                                    <td className="px-6 py-4 max-w-xs truncate" title={newsItem.title}>{newsItem.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(newsItem.publishedAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(newsItem.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                onClick={() => openNewsForm(newsItem)}
                                                aria-label="Edit news item"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                                onClick={() => handleDelete(newsItem)}
                                                aria-label="Delete news item"
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