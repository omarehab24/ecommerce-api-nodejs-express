/**
 * AWS S3 file upload configuration using multer
 * @module s3Upload
 */
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, AWS_REGION } = require("./config");
const CustomError = require("../errors");

/**
 * S3 client instance for AWS operations
 * @type {S3Client}
 */
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
});

/**
 * Multer middleware configured for S3 storage
 * @type {Object}
 * @property {Object} storage - Storage configuration for Multer
 * @property {Object} storage.s3 - S3 client
 * @property {string} storage.bucket - S3 bucket name
 * @property {string} storage.acl - Access control list for uploaded files, e.g., "public-read" for public access
 * @property {Function} storage.metadata - Metadata function to attach to uploaded files
 * @property {Function} storage.key - Key function to generate file names
 * @property {Object} limits - File size and count limits
 * @property {Function} fileFilter - File filter function
 * @see {@link https://www.npmjs.com/package/multer-s3}
 */
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: AWS_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileName = Date.now() + "-" + file.originalname;
      cb(null, `uploads/${fileName}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new CustomError.BadRequestError("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

module.exports = { upload, s3Client };