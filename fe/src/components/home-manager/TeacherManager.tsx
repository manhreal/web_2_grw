'use client';

import { Teacher } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createTeacher, updateTeacher, deleteTeacher, uploadTeacherImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';

interface TeacherManagerProps {
    teachers: Teacher[];
    setTeachers: (teachers: Teacher[]) => void;
}

export default function TeacherManager({ teachers, setTeachers }: TeacherManagerProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadTeacherImage(file);
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

    const handleSubmitTeacher = async (formData: unknown, teacher: Teacher | null) => {
        try {
            if (teacher) {
                const updatedTeacher = await updateTeacher(teacher._id, formData);
                setTeachers(teachers.map(t => t._id === teacher._id ? updatedTeacher.data : t));
                showSuccessToast({ message: 'Đã cập nhật thông tin giáo viên' });
            } else {
                const newTeacher = await createTeacher(formData);
                setTeachers([...teachers, newTeacher.data]);
                showSuccessToast({ message: 'Đã thêm giáo viên mới' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    const handleDelete = async (teacher: Teacher) => {
        confirmDelete({
            itemName: teacher.name,
            onConfirm: async () => {
                try {
                    await deleteTeacher(teacher._id);
                    setTeachers(teachers.filter(t => t._id !== teacher._id));
                    showSuccessToast({ message: 'Đã xóa giáo viên' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    const openTeacherForm = (teacher: Teacher | null) => {
        openFormModal({
            title: teacher ? 'Cập nhật giáo viên' : 'Thêm giáo viên mới',
            fields: [
                {
                    id: 'image',
                    label: 'Ảnh đại diện',
                    type: 'image',
                    defaultValue: teacher?.image,
                    required: true
                },
                {
                    id: 'name',
                    label: 'Tên giáo viên',
                    type: 'text',
                    defaultValue: teacher?.name,
                    required: true,
                    maxLength: 100
                },
                {
                    id: 'experience',
                    label: 'Kinh nghiệm',
                    type: 'textarea',
                    defaultValue: teacher?.experience,
                    required: true,
                    maxLength: 500
                },
                {
                    id: 'graduate',
                    label: 'Tốt nghiệp',
                    type: 'textarea',
                    defaultValue: teacher?.graduate,
                    required: true,
                    maxLength: 500
                },
                {
                    id: 'achievements',
                    label: 'Thành tích',
                    type: 'textarea',
                    defaultValue: teacher?.achievements,
                    required: true,
                    maxLength: 500
                }
            ],
            onImageUpload: handleImageUpload,
            onSubmit: (formData) => handleSubmitTeacher(formData, teacher)
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Danh sách giáo viên</h2>
                    <p className="text-gray-500 text-sm">Quản lý danh sách giáo viên xuất hiện trên trang chủ</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openTeacherForm(null)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Thêm giáo viên
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kinh nghiệm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {teachers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 italic text-gray-500">
                                    Chưa có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            teachers.map((teacher) => (
                                <tr key={teacher._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={teacher.image.startsWith('http') ? teacher.image : `${SERVER_URL}${teacher.image}`}
                                            alt={teacher.name}
                                            width={40}
                                            height={40}
                                            className="object-cover rounded"
                                            placeholder="blur"
                                            blurDataURL="/default-image.png"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                                    <td className="px-6 py-4 max-w-xs truncate">{teacher.experience}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(teacher.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                onClick={() => openTeacherForm(teacher)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                                onClick={() => handleDelete(teacher)}
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