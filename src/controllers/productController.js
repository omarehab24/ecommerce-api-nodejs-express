/**
 * @fileoverview Product Controller
 * Handles all product-related operations including creating, reading,
 * updating, and deleting products, as well as image upload functionality.
 * 
 * This controller implements features including:
 * - CRUD operations for products
 * - Image upload and validation
 * - Product reviews population
 * - User-specific product creation
 */

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Product = require("../models/Product");
const Image = require("../models/Image");

/**
 * Create a new product
 * @async
 * @function createProduct
 * @param {Object} req - Express request object
 * @param {Object} req.body - Product data
 * @param {Object} req.user - Authenticated user data
 * @param {string} req.user.userID - ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns created product
 */
const createProduct = async (req, res) => {
  req.body.user = req.user.userID;

  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

/**
 * Retrieve all products
 * @async
 * @function getAllProducts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns array of products and count
 */
const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

/**
 * Retrieve a single product by ID
 * @async
 * @function getSingleProduct
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Product ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns product with populated reviews
 * @throws {CustomError.NotFoundError} - If product not found
 */
const getSingleProduct = async (req, res) => {
  // Note: "reviews" can't be queried, because it's a virtual
  const { id: productID } = req.params;
  const product = await Product.findOne({ _id: productID }).populate("reviews").populate("image");

  if (!product) {
    throw new CustomError.NotFoundError("Product not found!");
  }

  res.status(StatusCodes.OK).json({ product });
};

/**
 * Update a product
 * @async
 * @function updateProduct
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Product ID
 * @param {Object} req.body - Updated product data
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns updated product
 * @throws {CustomError.NotFoundError} - If product not found
 */
const updateProduct = async (req, res) => {
  const { id: productID } = req.params;

  const product = await Product.findOneAndUpdate(
    { _id: productID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    throw new CustomError.NotFoundError("Product not found!");
  }

  res.status(StatusCodes.OK).json({ product });
};

/**
 * Delete a product
 * @async
 * @function deleteProduct
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Product ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns success message
 * @throws {CustomError.NotFoundError} - If product not found
 */
const deleteProduct = async (req, res) => {
  const { id: productID } = req.params;

  const product = await Product.findOne({ _id: productID });

  if (!product) {
    throw new CustomError.NotFoundError("Product not found!");
  }

  // Triggers the pre hook
  await product.remove();

  res.status(StatusCodes.OK).json({ msg: "Product deleted successfully!" });
};

/**
 * Upload a product image to AWS S3 using MulterS3
 * @async
 * @function uploadProductImage
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Product ID
 * @param {Object} req.file - File object containing the uploaded image
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns the created image
 * @throws {CustomError.BadRequestError} - If no file is uploaded
 * @throws {CustomError.NotFoundError} - If product not found
 */
const uploadProductImage = async (req, res) => {
  
  if (!req.file) {
    return new CustomError.BadRequestError("No file uploaded");
  }

  const { id: productID } = req.params;

  const product = await Product.findOne({ _id: productID });

  if (!product) {
    throw new CustomError.NotFoundError("Product not found!");
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

   product.image = image.url;
   await product.save();

  res.status(StatusCodes.CREATED).json({ image });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
};
