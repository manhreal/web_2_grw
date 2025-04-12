// controllers/studentController.js

import Student from '../models/student.js';
import { clearCache } from '../middlewares/cache.js';
import { createUploadHandler, deleteFile, updateModelImage } from '../utils/fileUpload.js';

// Function to handle file upload
export const uploadImage = createUploadHandler({
    folder: 'students',
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
});

export const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        return res.sendWithCache(students);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: `Cannot find student with ID: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);
        clearCache('students');
        res.status(201).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateStudent = async (req, res) => {
    try {
        // Handle image update if there's a new image
        if (req.body.image && req.body.image !== req.body.oldImage) {
            // If the request includes a new image path, update the image
            await updateModelImage(Student, req.params.id, req.body.image);
        }

        // Remove oldImage from the data to prevent it from being saved
        const { oldImage, ...updateData } = req.body;

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: `Cannot find student with ID: ${req.params.id}`
            });
        }
        clearCache('students');
        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: `Cannot find student with ID: ${req.params.id}`
            });
        }

        // Delete associated image if exists
        if (student.image) {
            deleteFile(student.image);
        }

        // Delete the student
        await Student.findByIdAndDelete(req.params.id);

        clearCache('students');
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