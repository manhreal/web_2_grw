// controllers/partnerController.js

import Partner from '../models/partner.js';
import { clearCache } from '../middlewares/cache.js';
import { createUploadHandler, deleteFile, updateModelImage } from '../utils/fileUpload.js';

// Function to handle file upload
export const uploadPartnerImage = createUploadHandler({
    folder: 'partners',
    maxFileSize: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
});

export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find();
        return res.sendWithCache(partners);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);

        if (!partner) {
            return res.status(404).json({
                success: false,
                message: `Cannot find partner with ID: ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: partner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createPartner = async (req, res) => {
    try {
        const partner = await Partner.create(req.body);
        res.status(201).json({
            success: true,
            data: partner
        });
        clearCache('partners');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updatePartner = async (req, res) => {
    try {
        // Handle image update if there's a new image
        if (req.body.image && req.body.image !== req.body.oldImage) {
            // If the request includes a new image path, update the image
            await updateModelImage(Partner, req.params.id, req.body.image);
        }

        // Remove oldImage from the data to prevent it from being saved
        const { oldImage, ...updateData } = req.body;

        const partner = await Partner.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!partner) {
            return res.status(404).json({
                success: false,
                message: `Cannot find partner with ID: ${req.params.id}`
            });
        }

        clearCache('partners');
        res.status(200).json({
            success: true,
            data: partner
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);

        if (!partner) {
            return res.status(404).json({
                success: false,
                message: `Cannot find partner with ID: ${req.params.id}`
            });
        }

        // Delete associated image if exists
        if (partner.image) {
            deleteFile(partner.image);
        }

        // Delete the partner
        await Partner.findByIdAndDelete(req.params.id);

        clearCache('partners');
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