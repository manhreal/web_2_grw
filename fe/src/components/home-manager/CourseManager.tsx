'use client';

import { Course } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createCourse, updateCourse, deleteCourse, uploadCourseImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';

interface CourseManagerProps {
    courses: Course[];
    setCourses: (courses: Course[]) => void;
}

export default function CourseManager({ courses, setCourses }: CourseManagerProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadCourseImage(file);
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

    const handleSubmitCourse = async (formData: unknown, course: Course | null) => {
        try {
            if (course) {
                const updatedCourse = await updateCourse(course._id, formData);
                setCourses(courses.map(c => c._id === course._id ? updatedCourse.data : c));
                showSuccessToast({ message: 'Đã cập nhật thông tin khóa học' });
            } else {
                const newCourse = await createCourse(formData);
                setCourses([...courses, newCourse.data]);
                showSuccessToast({ message: 'Đã thêm khóa học mới' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    const handleDelete = async (course: Course) => {
        confirmDelete({
            itemName: course.title,
            onConfirm: async () => {
                try {
                    await deleteCourse(course._id);
                    setCourses(courses.filter(c => c._id !== course._id));
                    showSuccessToast({ message: 'Đã xóa khóa học' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    const openCourseForm = (course: Course | null) => {
        openFormModal({
            title: course ? 'Cập nhật khóa học' : 'Thêm khóa học mới',
            fields: [
                {
                    id: 'image',
                    label: 'Ảnh khóa học',
                    type: 'image',
                    defaultValue: course?.image,
                    required: true
                },
                {
                    id: 'title',
                    label: 'Tên khóa học',
                    type: 'text',
                    defaultValue: course?.title,
                    required: true,
                    maxLength: 200
                },
                {
                    id: 'link',
                    label: 'Đường dẫn',
                    type: 'text',
                    defaultValue: course?.link,
                    required: true
                }
            ],
            onImageUpload: handleImageUpload,
            onSubmit: (formData) => handleSubmitCourse(formData, course)
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Khóa học</h2>
                    <p className="text-gray-500 text-sm">Quản lý khóa học xuất hiện trên trang chủ</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openCourseForm(null)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Thêm khóa học
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khóa học</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đường dẫn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 italic text-gray-500">
                                    Chưa có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={course.image.startsWith('http') ? course.image : `${SERVER_URL}${course.image}`}
                                            alt={course.title}
                                            width={40}
                                            height={40}
                                            className="object-cover rounded"
                                            placeholder="blur"
                                            blurDataURL="/default-image.png"
                                        />
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate">{course.title}</td>
                                    <td className="px-6 py-4 max-w-xs truncate">
                                        <a href={course.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {course.link}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(course.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                onClick={() => openCourseForm(course)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                                onClick={() => handleDelete(course)}
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