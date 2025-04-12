'use client';

import { Student } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createStudent, updateStudent, deleteStudent, uploadStudentImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';

interface StudentManagerProps {
    students: Student[];
    setStudents: (students: Student[]) => void;
}

export default function StudentManager({ students, setStudents }: StudentManagerProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadStudentImage(file);
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
    const handleSubmitStudent = async (formData: unknown, student: Student | null) => {
        try {
            if (student) {
                const updatedStudent = await updateStudent(student._id, formData);
                setStudents(students.map(s => s._id === student._id ? updatedStudent.data : s));
                showSuccessToast({ message: 'Đã cập nhật thông tin học viên' });
            } else {
                const newStudent = await createStudent(formData);
                setStudents([...students, newStudent.data]);
                showSuccessToast({ message: 'Đã thêm học viên mới' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    const handleDelete = async (student: Student) => {
        confirmDelete({
            itemName: student.name,
            onConfirm: async () => {
                try {
                    await deleteStudent(student._id);
                    setStudents(students.filter(s => s._id !== student._id));
                    showSuccessToast({ message: 'Đã xóa học viên' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    const openStudentForm = (student: Student | null) => {
        openFormModal({
            title: student ? 'Cập nhật học viên' : 'Thêm học viên mới',
            fields: [
                {
                    id: 'image',
                    label: 'Ảnh đại diện',
                    type: 'image',
                    defaultValue: student?.image,
                    required: true
                },
                {
                    id: 'name',
                    label: 'Tên học viên',
                    type: 'text',
                    defaultValue: student?.name,
                    required: true,
                    maxLength: 100
                },
                {
                    id: 'achievement',
                    label: 'Thành tích',
                    type: 'textarea',
                    defaultValue: student?.achievement,
                    required: true,
                    maxLength: 200
                },
                {
                    id: 'description',
                    label: 'Mô tả',
                    type: 'textarea',
                    defaultValue: student?.description,
                    required: true,
                    maxLength: 500
                }
            ],
            onImageUpload: handleImageUpload,
            onSubmit: (formData) => handleSubmitStudent(formData, student)
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Danh sách học viên</h2>
                    <p className="text-gray-500 text-sm">Quản lý danh sách học viên xuất hiện trên trang chủ</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openStudentForm(null)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Thêm học viên
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tích</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 italic text-gray-500">
                                    Chưa có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={student.image.startsWith('http') ? student.image : `${SERVER_URL}${student.image}`}
                                            alt={student.name}
                                            width={40}
                                            height={40}
                                            className="object-cover rounded"
                                            placeholder="blur"
                                            blurDataURL="/default-image.png"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                                    <td className="px-6 py-4 max-w-xs truncate">{student.achievement}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(student.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                onClick={() => openStudentForm(student)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                                onClick={() => handleDelete(student)}
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