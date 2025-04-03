const mongoose = require("mongoose");

/**
 * Mongoose schema for storing image data.
 * @typedef {Object} Image
 * @property {string} url - The URL where the image can be accessed (required).
 * @property {string} key - The file name or unique identifier for the image in storage (required).
 * @property {string} [originalName] - The original file name of the uploaded image.
 * @property {string} [mimeType] - The MIME type of the image.
 * @property {number} [size] - The size of the image in bytes.
 * @property {mongoose.Schema.Types.ObjectId} [uploadedBy] - Reference to the User who uploaded the image.
 */
const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true
        },
        key: {
            type: String,
            required: true
        },
        originalName: String,
        mimeType: String,
        size: Number,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    { timestamps: true }
);

/**
 * Transform function to modify the returned object
 * 
 * Removes the version key from the returned object
 * to reduce unnecessary metadata in API responses.
 * 
 * @param {Object} document - Mongoose document
 * @param {Object} returnedObject - Object to be returned
 */
imageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

/**
 * Transform function for toObject method
 * 
 * Ensures consistent object representation when converting
 * Mongoose documents to plain JavaScript objects.
 * 
 * @param {Object} document - Mongoose document
 * @param {Object} returnedObject - Object to be returned
 */
imageSchema.set('toObject', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

module.exports = mongoose.model("Image", imageSchema);