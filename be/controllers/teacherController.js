// controllers/teacherController.js

import Teacher from '../models/teacher.js';
import { clearCache } from '../middlewares/cache.js';
import { createUploadHandler, deleteFile, updateModelImage } from '../utils/fileUpload.js';

// Function to handle file upload
export const uploadTeacherImage = createUploadHandler({
    folder: 'teachers',
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
});

export const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        return res.sendWithCache(teachers);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: `Cannot find teacher with ID: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.create(req.body);
        clearCache('teachers');
        res.status(201).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        // Handle image update if there's a new image
        if (req.body.image && req.body.image !== req.body.oldImage) {
            // If the request includes a new image path, update the image
            await updateModelImage(Teacher, req.params.id, req.body.image);
        }

        // Remove oldImage from the data to prevent it from being saved
        const { oldImage, ...updateData } = req.body;

        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: `Cannot find teacher with ID: ${req.params.id}`
            });
        }

        clearCache('teachers');
        res.status(200).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: `Cannot find teacher with ID: ${req.params.id}`
            });
        }

        // Delete associated image if exists
        if (teacher.image) {
            deleteFile(teacher.image);
        }

        // Delete the teacher
        await Teacher.findByIdAndDelete(req.params.id);

        clearCache('teachers');
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