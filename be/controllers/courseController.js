// controllers/courseController.js

import Course from '../models/course.js';
import { clearCache } from '../middlewares/cache.js';
import { createUploadHandler, deleteFile, updateModelImage } from '../utils/fileUpload.js';

// Function to handle file upload
export const uploadCourseImage = createUploadHandler({
    folder: 'courses',
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
});

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        return res.sendWithCache(courses);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: `Cannot find course with ID: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({
            success: true,
            data: course
        });
        clearCache('courses');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        // Handle image update if there's a new image
        if (req.body.image && req.body.image !== req.body.oldImage) {
            // If the request includes a new image path, update the image
            await updateModelImage(Course, req.params.id, req.body.image);
        }

        // Remove oldImage from the data to prevent it from being saved
        const { oldImage, ...updateData } = req.body;

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: `Cannot find course with ID: ${req.params.id}`
            });
        }

        clearCache('courses');
        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: `Cannot find course with ID: ${req.params.id}`
            });
        }

        // Delete associated image if exists
        if (course.image) {
            deleteFile(course.image);
        }

        // Delete the course
        await Course.findByIdAndDelete(req.params.id);

        clearCache('courses');
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};