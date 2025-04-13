'use client';

import { useMemo } from 'react';
import { Student } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createStudent, updateStudent, deleteStudent, uploadStudentImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';

// Interface definitions
interface StudentManagerProps {
    students: Student[];
    setStudents: (students: Student[]) => void;
}

export default function StudentManager({ students, setStudents }: StudentManagerProps) {
    // Memoize the sorted students to avoid unnecessary re-sorting
    const sortedStudents = useMemo(() => {
        return [...students].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [students]);

    // Utility functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US');
    };

    // Image upload handler
    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadStudentImage(file);
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
    const handleSubmitStudent = async (formData: unknown, student: Student | null) => {
        try {
            if (student) {
                // Update existing student
                const updatedStudent = await updateStudent(student._id, formData);
                setStudents(students.map(s => s._id === student._id ? updatedStudent.data : s));
                showSuccessToast({ message: 'Student updated successfully' });
            } else {
                // Create new student
                const newStudent = await createStudent(formData);
                setStudents([...students, newStudent.data]);
                showSuccessToast({ message: 'New student added successfully' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    // Delete handler
    const handleDelete = async (student: Student) => {
        confirmDelete({
            itemName: student.name,
            onConfirm: async () => {
                try {
                    await deleteStudent(student._id);
                    setStudents(students.filter(s => s._id !== student._id));
                    showSuccessToast({ message: 'Student deleted successfully' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    // Student form handler
    const openStudentForm = (student: Student | null) => {
        openFormModal({
            title: student ? 'Update Student' : 'Add New Student',
            fields: [
                {
                    id: 'image',
                    label: 'Profile Image',
                    type: 'image',
                    defaultValue: student?.image,
                    required: true
                },
                {
                    id: 'name',
                    label: 'Student Name',
                    type: 'text',
                    defaultValue: student?.name,
                    required: true,
                    maxLength: 100
                },
                {
                    id: 'achievement',
                    label: 'Achievement',
                    type: 'textarea',
                    defaultValue: student?.achievement,
                    required: true,
                    maxLength: 200
                },
                {
                    id: 'description',
                    label: 'Description',
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

    // Render component
    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Header section */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Student List</h2>
                    <p className="text-gray-500 text-sm">Manage students displayed on the homepage</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openStudentForm(null)}
                    aria-label="Add new student"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Student
                </button>
            </div>

            {/* Table section */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievement</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedStudents.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 italic text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            sortedStudents.map((student) => (
                                <tr key={student._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={student.image.startsWith('http') ? student.image : `${SERVER_URL}${student.image}`}
                                            alt={student.name}
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
                                    <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={student.achievement}>
                                        {student.achievement}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(student.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                onClick={() => openStudentForm(student)}
                                                aria-label="Edit student"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                                onClick={() => handleDelete(student)}
                                                aria-label="Delete student"
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