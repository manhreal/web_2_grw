// controllers/newController.js

import News from '../models/new.js';
import { clearCache } from '../middlewares/cache.js';
import { createUploadHandler, deleteFile, updateModelImage } from '../utils/fileUpload.js';

// Function to handle file upload
export const uploadNewsImage = createUploadHandler({
    folder: 'news',
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
});

export const getAllNews = async (req, res) => {
    try {
        const news = await News.find().sort({ publishedAt: -1 });
        return res.sendWithCache(news);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: `Cannot find new with ID: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createNews = async (req, res) => {
    try {
        const news = await News.create(req.body);
        res.status(201).json({
            success: true,
            data: news
        });
        clearCache('news');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateNews = async (req, res) => {
    try {
        // Handle image update if there's a new image
        if (req.body.image && req.body.image !== req.body.oldImage) {
            // If the request includes a new image path, update the image
            await updateModelImage(News, req.params.id, req.body.image);
        }

        // Remove oldImage from the data to prevent it from being saved
        const { oldImage, ...updateData } = req.body;

        const news = await News.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!news) {
            return res.status(404).json({
                success: false,
                message: `Cannot find new with ID: ${req.params.id}`
            });
        }

        clearCache('news');
        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: `Cannot find new with ID: ${req.params.id}`
            });
        }

        // Delete associated image if exists
        if (news.image) {
            deleteFile(news.image);
        }

        // Delete the news
        await News.findByIdAndDelete(req.params.id);

        clearCache('news');
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