'use client';

import { useMemo } from 'react';
import { Teacher } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createTeacher, updateTeacher, deleteTeacher, uploadTeacherImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';

// Interface definitions
interface TeacherManagerProps {
    teachers: Teacher[];
    setTeachers: (teachers: Teacher[]) => void;
}

export default function TeacherManager({ teachers, setTeachers }: TeacherManagerProps) {
    // Memoize the sorted teachers to avoid unnecessary re-sorting
    const sortedTeachers = useMemo(() => {
        return [...teachers].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [teachers]);

    // Utility functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US');
    };

    // Image upload handler
    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadTeacherImage(file);
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
    const handleSubmitTeacher = async (formData: unknown, teacher: Teacher | null) => {
        try {
            if (teacher) {
                // Update existing teacher
                const updatedTeacher = await updateTeacher(teacher._id, formData);
                setTeachers(teachers.map(t => t._id === teacher._id ? updatedTeacher.data : t));
                showSuccessToast({ message: 'Teacher updated successfully' });
            } else {
                // Create new teacher
                const newTeacher = await createTeacher(formData);
                setTeachers([...teachers, newTeacher.data]);
                showSuccessToast({ message: 'New teacher added successfully' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    // Delete handler
    const handleDelete = async (teacher: Teacher) => {
        confirmDelete({
            itemName: teacher.name,
            onConfirm: async () => {
                try {
                    await deleteTeacher(teacher._id);
                    setTeachers(teachers.filter(t => t._id !== teacher._id));
                    showSuccessToast({ message: 'Teacher deleted successfully' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    // Teacher form handler
    const openTeacherForm = (teacher: Teacher | null) => {
        openFormModal({
            title: teacher ? 'Update Teacher' : 'Add New Teacher',
            fields: [
                {
                    id: 'image',
                    label: 'Profile Image',
                    type: 'image',
                    defaultValue: teacher?.image,
                    required: true
                },
                {
                    id: 'name',
                    label: 'Teacher Name',
                    type: 'text',
                    defaultValue: teacher?.name,
                    required: true,
                    maxLength: 100
                },
                {
                    id: 'experience',
                    label: 'Experience',
                    type: 'textarea',
                    defaultValue: teacher?.experience,
                    required: true,
                    maxLength: 500
                },
                {
                    id: 'graduate',
                    label: 'Education',
                    type: 'textarea',
                    defaultValue: teacher?.graduate,
                    required: true,
                    maxLength: 500
                },
                {
                    id: 'achievements',
                    label: 'Achievements',
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

    // Render component
    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Header section */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Teacher List</h2>
                    <p className="text-gray-500 text-sm">Manage teachers displayed on the homepage</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openTeacherForm(null)}
                    aria-label="Add new teacher"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Teacher
                </button>
            </div>

            {/* Table section */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedTeachers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 italic text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            sortedTeachers.map((teacher) => (
                                <tr key={teacher._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={teacher.image.startsWith('http') ? teacher.image : `${SERVER_URL}${teacher.image}`}
                                            alt={teacher.name}
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
                                    <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={teacher.experience}>
                                        {teacher.experience}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(teacher.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                onClick={() => openTeacherForm(teacher)}
                                                aria-label="Edit teacher"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                                onClick={() => handleDelete(teacher)}
                                                aria-label="Delete teacher"
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