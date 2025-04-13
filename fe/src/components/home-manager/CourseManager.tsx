'use client';

import { Course } from './types';
import { Edit, Trash, Plus } from 'lucide-react';
import { showSuccessToast } from '../../components/common/notifications/SuccessToast';
import { confirmDelete } from '../../components/common/notifications/ConfirmDialog';
import { openFormModal } from '../../components/common/forms/BaseFormModal';
import { createCourse, updateCourse, deleteCourse, uploadCourseImage } from '@/api/home-show/manager';
import { SERVER_URL } from '@/api/server_url';
import Image from 'next/image';
import { useMemo } from 'react';

// Interface definitions
interface CourseManagerProps {
    courses: Course[];
    setCourses: (courses: Course[]) => void;
}

export default function CourseManager({ courses, setCourses }: CourseManagerProps) {
    // Utility functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US');
    };

    // Memoize the sorted courses to avoid unnecessary re-sorting
    const sortedCourses = useMemo(() => {
        return [...courses].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [courses]);

    // Image upload handler
    const handleImageUpload = async (file: File) => {
        try {
            const response = await uploadCourseImage(file);
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
    const handleSubmitCourse = async (formData: unknown, course: Course | null) => {
        try {
            if (course) {
                // Update existing course
                const updatedCourse = await updateCourse(course._id, formData);
                setCourses(courses.map(c => c._id === course._id ? updatedCourse.data : c));
                showSuccessToast({ message: 'Course information updated successfully' });
            } else {
                // Create new course
                const newCourse = await createCourse(formData);
                setCourses([...courses, newCourse.data]);
                showSuccessToast({ message: 'New course added successfully' });
            }
        } catch (error) {
            showSuccessToast({
                message: error.message,
                type: 'error'
            });
        }
    };

    // Delete handler
    const handleDelete = async (course: Course) => {
        confirmDelete({
            itemName: course.title,
            onConfirm: async () => {
                try {
                    await deleteCourse(course._id);
                    setCourses(courses.filter(c => c._id !== course._id));
                    showSuccessToast({ message: 'Course deleted successfully' });
                } catch (error) {
                    showSuccessToast({
                        message: error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    // Course form handler
    const openCourseForm = (course: Course | null) => {
        openFormModal({
            title: course ? 'Update Course' : 'Add New Course',
            fields: [
                {
                    id: 'image',
                    label: 'Course Image',
                    type: 'image',
                    defaultValue: course?.image,
                    required: true
                },
                {
                    id: 'title',
                    label: 'Course Title',
                    type: 'text',
                    defaultValue: course?.title,
                    required: true,
                    maxLength: 200
                },
                {
                    id: 'link',
                    label: 'Course URL',
                    type: 'text',
                    defaultValue: course?.link,
                    required: true
                }
            ],
            onImageUpload: handleImageUpload,
            onSubmit: (formData) => handleSubmitCourse(formData, course)
        });
    };

    // Render component
    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Header section */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Courses</h2>
                    <p className="text-gray-500 text-sm">Manage courses displayed on the homepage</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
                    onClick={() => openCourseForm(null)}
                    aria-label="Add new course"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Course
                </button>
            </div>

            {/* Table section */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedCourses.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 italic text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            sortedCourses.map((course) => (
                                <tr key={course._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Image
                                            src={course.image.startsWith('http') ? course.image : `${SERVER_URL}${course.image}`}
                                            alt={course.title}
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
                                    <td className="px-6 py-4 max-w-xs truncate" title={course.title}>{course.title}</td>
                                    <td className="px-6 py-4 max-w-xs truncate">
                                        <a
                                            href={course.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                            title={course.link}
                                        >
                                            {course.link}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(course.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100"
                                                onClick={() => openCourseForm(course)}
                                                aria-label="Edit course"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                                                onClick={() => handleDelete(course)}
                                                aria-label="Delete course"
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