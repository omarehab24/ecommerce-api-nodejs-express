const express = require("express");
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
} = require("../middleware/authentication");

const { uploadImage, uploadImages, deleteImage, getImages, getImage } = require("../controllers/imageController");

const { upload } = require("../utils/upload-multerS3");
const ensureFileIsPresent = require("../middleware/ensureFileIsPresent");

/**
 * Express router for image-related routes
 * - Upload single or multiple images
 * - Get all images
 * - Get a single image
 * - Delete an image
 * 
 * All routes require user authentication except for getting images
 */

/**
 * Route for uploading a single image
 * @name POST /uploadImage
 * @function
 * @memberof module:imageRoutes
 * @inner
 * @param {function} authenticateUser - Middleware to authenticate user
 * @param {function} authorizePermissions - Middleware to check admin permissions
 * @param {function} upload.single - Multer middleware for single file upload
 * @param {function} uploadImage - Controller function to handle image upload
 */
router
    .route("/uploadImage")
    .post(
        [authenticateUser, authorizePermissions("admin"), upload.single("image"), ensureFileIsPresent],
        uploadImage
    )

/**
 * Route for uploading multiple images
 * @name POST /uploadMultipleImages
 * @function
 * @memberof module:imageRoutes
 * @inner
 * @param {function} authenticateUser - Middleware to authenticate user
 * @param {function} authorizePermissions - Middleware to check admin permissions
 * @param {function} upload.array - Multer middleware for multiple file upload
 * @param {function} uploadImages - Controller function to handle multiple image upload
 */
router
    .route("/uploadMultipleImages")
    .post(
        [authenticateUser, authorizePermissions("admin"), upload.array("images", 10), ensureFileIsPresent],
        uploadImages
    )

/**
 * Route for getting all images
 * @name GET /getAllImages
 * @function
 * @memberof module:imageRoutes
 * @inner
 * @param {function} authenticateUser - Middleware to authenticate user
 * @param {function} getImages - Controller function to get all images
 */
router
    .route("/getAllImages")
    .get([authenticateUser], getImages)

/**
 * Route for getting a single image by ID
 * @name GET /getImage/:id
 * @function
 * @memberof module:imageRoutes
 * @inner
 * @param {function} authenticateUser - Middleware to authenticate user
 * @param {function} getImage - Controller function to get a single image
 */
router
    .route("/getImage/:id")
    .get([authenticateUser], getImage)

/**
 * Route for deleting an image by ID
 * @name DELETE /deleteImage/:id
 * @function
 * @memberof module:imageRoutes
 * @inner
 * @param {function} authenticateUser - Middleware to authenticate user
 * @param {function} authorizePermissions - Middleware to check admin permissions
 * @param {function} deleteImage - Controller function to delete an image
 */
router
    .route("/deleteImage/:id")
    .delete([authenticateUser, authorizePermissions("admin")], deleteImage)


module.exports = router;