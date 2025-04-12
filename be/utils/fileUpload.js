// utils/fileUpload.js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { IncomingForm } from 'formidable';

// Initialization and configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base configuration for file uploads
const DEFAULT_CONFIG = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
};

const getUploadDir = (folder = 'images') => {
    return path.join(__dirname, '../public/uploads', folder);
};

const ensureUploadDir = (uploadDir) => {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
};

const getRelativePath = (filePath, folder = 'images') => {
    return `/uploads/${folder}/${path.basename(filePath)}`;
};

export const deleteFile = (filePath) => {
    try {
        if (!filePath) return false;

        // If it's a URL path like /uploads/courses/image.jpg
        let absolutePath = filePath;
        if (filePath.startsWith('/uploads/')) {
            absolutePath = path.join(__dirname, '../public', filePath);
        }

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

export const createUploadHandler = (options = {}) => {
    const config = { ...DEFAULT_CONFIG, ...options };
    const uploadDir = getUploadDir(config.folder);

    // Ensure upload directory exists
    ensureUploadDir(uploadDir);

    // Filter allowed file types
    const isAllowedFileType = (mimeType) => {
        return config.allowedMimeTypes.includes(mimeType);
    };

    // Return the middleware function
    return async (req, res) => {
        try {
            const form = new IncomingForm({
                uploadDir: uploadDir,
                keepExtensions: true,
                maxFileSize: config.maxFileSize,
                filter: ({ mimetype }) => isAllowedFileType(mimetype),
                filename: (name, ext, part, form) => {
                    const now = new Date();
                    const timeStr = `${now.getSeconds()}_${now.getMinutes()}_${now.getHours()}_${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}`;
                    const originalExt = path.extname(part.originalFilename); // lấy .jpg / .png / ...
                    return `${timeStr}${originalExt}`;
                }

            });

            form.parse(req, (err, fields, files) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message.includes('maxFileSize exceeded')
                            ? `File too large (maximum: ${config.maxFileSize / (1024 * 1024)}MB)`
                            : `Only allowed: ${config.allowedMimeTypes.join(', ')}`
                    });
                }

                if (!files.image) {
                    return res.status(400).json({
                        success: false,
                        message: 'Missing image file'
                    });
                }

                const file = files.image[0];
                const relativePath = getRelativePath(file.filepath, config.folder);
                const fullUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

                // If this is an update and there's an old image to delete
                if (fields.oldImage && fields.oldImage[0]) {
                    deleteFile(fields.oldImage[0]);
                }

                res.status(200).json({
                    success: true,
                    imageUrl: relativePath,
                    fullImageUrl: fullUrl
                });
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
};

export const updateModelImage = async (Model, id, imageUrl, imageField = 'image') => {
    try {
        // First get the current document to find the old image
        const document = await Model.findById(id);

        if (!document) {
            throw new Error(`Document with ID ${id} not found`);
        }

        // Delete the old image if it exists
        if (document[imageField]) {
            deleteFile(document[imageField]);
        }

        // Update with new image
        const updateData = {};
        updateData[imageField] = imageUrl;

        return await Model.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};