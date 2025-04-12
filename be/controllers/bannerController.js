// controllers/bannerController.js

import Banner from '../models/banner.js';
import { clearCache } from '../middlewares/cache.js';
import { createUploadHandler, deleteFile, updateModelImage } from '../utils/fileUpload.js';

// Function to handle file upload
export const uploadBannerImage = createUploadHandler({
    folder: 'banners',
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
});

// Get all banners
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        return res.sendWithCache(banners);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single banner by ID
export const getBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: `Cannot find banner with ID: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: banner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create a new banner
export const createBanner = async (req, res) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json({
            success: true,
            data: banner
        });
        clearCache('banners');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a banner by ID
export const updateBanner = async (req, res) => {
    try {
        // Handle image update if there's a new image
        if (req.body.image && req.body.image !== req.body.oldImage) {
            // If the request includes a new image path, update the image
            await updateModelImage(Banner, req.params.id, req.body.image);
        }

        // Remove oldImage from the data to prevent it from being saved
        const { oldImage, ...updateData } = req.body;

        const banner = await Banner.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: `Cannot find banner with ID: ${req.params.id}`
            });
        }

        clearCache('banners');
        res.status(200).json({
            success: true,
            data: banner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a banner by ID
export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: `Cannot find banner with ID: ${req.params.id}`
            });
        }

        // Delete associated image if exists
        if (banner.image) {
            deleteFile(banner.image);
        }

        // Delete the banner
        await Banner.findByIdAndDelete(req.params.id);

        clearCache('banners');
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