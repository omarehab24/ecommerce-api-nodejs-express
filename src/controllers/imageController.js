/**
 * @fileoverview Image Controller
 * Handles all image-related operations including uploading, downloading,
 * and deleting images.
 * 
 * This controller implements features including:
 * - Image upload to S3
 * - Image download from S3
 * - Image deletion from S3
 */

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Image = require("../models/Image");

const { s3Client } = require("../utils/upload-multerS3");
const { AWS_BUCKET_NAME } = require("../utils/config");

/**
 * Upload a single image to S3 and save its metadata to the database
 * @param {Object} req - Express request object
 * @param {Object} req.file - Uploaded file information from multer
 * @param {Object} req.user - Authenticated user information
 * @param {string} req.user.userID - ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} Response with the saved image data
 * @throws {CustomError.BadRequestError} If no file is uploaded
 */
const uploadImage = async (req, res) => {

    if (!req.file) {
        return new CustomError.BadRequestError("No file uploaded");
    }

    const image = new Image({
        url: req.file.location,
        key: req.file.key,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user.userID,
    });

    await image.save();

    res.status(StatusCodes.CREATED).json({ image });
};

/**
 * Upload multiple images to S3 and save their metadata to the database
 * @param {Object} req - Express request object
 * @param {Array} req.files - Array of uploaded files information from multer
 * @param {Object} req.user - Authenticated user information
 * @param {string} req.user.userID - ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} Response with the saved images data
 * @throws {CustomError.BadRequestError} If no files are uploaded
 */
const uploadImages = async (req, res) => {

    if (!req.files || req.files.length === 0) {
        return new CustomError.BadRequestError("No files uploaded");
    }

    const savedImages = [];

    // Save each uploaded file to the database
    for (const file of req.files) {
        const image = new Image({
            url: file.location,
            key: file.key,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            uploadedBy: req.user.userID
        });

        await image.save();

        savedImages.push(image);
    }

    res.status(StatusCodes.CREATED).json({ images: savedImages });
};

/**
 * Get all images from the database sorted by upload date (newest first)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with all images
 */
const getImages = async (req, res) => {
    const dbImages = await Image.find().sort({ uploadedAt: -1 });

    const images = await Promise.all(dbImages.map(async (image) => {
        return image;
    }));

    res.status(StatusCodes.OK).json({ images });
};

/**
 * Get a single image by ID
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Image ID
 * @param {Object} res - Express response object
 * @returns {Object} Response with the requested image
 * @throws {CustomError.NotFoundError} If image with given ID is not found
 */
const getImage = async (req, res) => {
    const { id: imageID } = req.params;
    const image = await Image.findById(imageID);

    if (!image) {
        throw new CustomError.NotFoundError(`No image with id: ${imageID}`);
    }

    res.status(StatusCodes.OK).json({ image });
};

/**
 * Delete an image from S3 and remove its metadata from the database
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Image ID
 * @param {Object} res - Express response object
 * @returns {Object} Response with success message
 * @throws {CustomError.NotFoundError} If image with given ID is not found
 */
const deleteImage = async (req, res) => {
    const { id: imageID } = req.params;
    const image = await Image.findById(imageID);

    if (!image) {
        throw new CustomError.NotFoundError(`No image with id: ${imageID}`);
    }

    // Delete from S3
    const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
    await s3Client.send(new DeleteObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: image.key
    }));

    await image.remove();

    res.status(StatusCodes.OK).json({ msg: "Image deleted successfully!" });
};

module.exports = {
    uploadImage,
    uploadImages,
    getImages,
    getImage,
    deleteImage
}
