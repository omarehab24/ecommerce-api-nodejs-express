/**
 * @fileoverview Test helper utilities for E-commerce API testing
 * This module provides utility functions and test data for integration testing
 * of the E-commerce API. It includes functions for database operations,
 * user authentication, and test data generation.
 */

const mongoose = require("mongoose")
const User = require("../models/User")
const Product = require("../models/Product")
const Token = require("../models/Token")
const Review = require("../models/Review")
const Order = require("../models/Order")
const Image = require("../models/Image")

const initialAdmin = {
  email: "admin@mail.com",
  name: "Superuser",
  password: "secret",
}

const initialUser = {
  email: "testuser@mail.com",
  name: "Test User",
  password: "secret",
}

const initialProduct = {
  name: "Test Product",
  price: 9.99,
  image: "test-image.jpg",
  colors: ["#ff0000", "#00ff00", "#0000ff"],
  company: "marcos",
  description: "This is a test product",
  category: "office",
}

const initialReview = {
  rating: 5,
  comment: "This is a test review",
  product: null,
  user: null,
  title: "Test Review"
}

const initialOrder = {
  tax: 399,
  shippingFee: 499,
  clientSecret: "RandomValue",
  subTotal: 3999,
  total: 4499,
  items: [
    {
      name: "accent chair",
      price: 2599,
      image: "https://dl.airtable.com/.attachmentThumbnails/e8bc3791196535af65f40e36993b9e1f/438bd160",
      amount: 3,
      product: null
    }
  ]
}

const initialImage = {
  url: "https://s3.29325.s3.us-east-1.amazonaws.com/uploads/1743714478732-computer-3.jpeg",
  key: "uploads/1743714478732-computer-3.jpeg",
  originalName: "computer-3.jpeg",
  mimeType: "image/jpeg",
  size: 57567,
}

const nonExistingId = async () => {
  const product = new Product({ ...initialProduct, user: initialUser.id });
  await product.save();
  await product.deleteOne();

  return product._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createTestAdmin = async () => {
  // Check if this is the first account
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = "testtoken123";

  const user = new User({
    email: initialAdmin.email,
    name: initialAdmin.name,
    password: initialAdmin.password,
    role,
    verificationToken,
    isVerified: true
  });

  await user.save();
  return user;
}

const createTestUser = async () => {
  const user = new User({
    email: initialUser.email,
    name: initialUser.name,
    password: initialUser.password,
    role: "user",
    verificationToken: "testtoken456",
    isVerified: true
  });
  await user.save();
  return user;
}

const createAnotherTestUser = async () => {
  const user = new User({
    email: "anotheruser@mail.com",
    name: "Another User",
    password: "secret",
    role: "user",
    verificationToken: "testtoken789",
    isVerified: true
  });
  await user.save();
  return user;
}

const createTestProduct = async (adminId) => {
  await Product.deleteMany({});
  const product = new Product({ ...initialProduct, user: adminId });
  await product.save();
  return product;
}

const createTestReview = async (productId, userId) => {
  const review = new Review({ ...initialReview, product: productId, user: userId });
  await review.save();
  return review;
}

const createTestOrder = async (userId, productId) => {
  const product = await Product.findById(productId);
  const orderItems = [{
    name: product.name,
    price: product.price,
    image: product.image,
    amount: 3,
    product: productId
  }];

  const subTotal = orderItems[0].price * orderItems[0].amount;
  const order = new Order({
    tax: 399,
    shippingFee: 499,
    subTotal,
    total: subTotal + 399 + 499,
    orderItems,
    status: 'pending',
    clientSecret: 'RandomValue',
    user: userId
  });

  await order.save();

  return order;
}

const createTestImage = async (userId) => {
  const image = new Image({ ...initialImage, uploadedBy: userId });
  await image.save();
  return image
}

const extractTokenFromCookie = (cookie) => {
  if (!cookie) return null;
  return cookie
    .split(';')[0] // Get first part before ;
    .replace('accessToken=', '') // Remove prefix
}

const resetPasswordToken = async (api) => {
  await api
    .post('/api/v1/auth/test-forgot-password')
    .set('User-Agent', 'test-agent')
    .set('X-Forwarded-For', '127.0.0.1')
    .send({
      email: initialAdmin.email
    });

  const updatedUser = await User.findOne({ email: initialAdmin.email });
  return updatedUser.passwordToken;
}

const loginUser = async (api, email, password) => {
  try {
    const response = await api
      .post("/api/v1/auth/login")
      .set('User-Agent', 'test-agent')
      .set('X-Forwarded-For', '127.0.0.1')
      .send({
        email,
        password
      });

    // console.log('Login Response Status:', response.status);
    // console.log('Login Response Body:', response.body);
    // console.log('Login Response Headers:', response.headers);

    const cookies = response.headers['set-cookie'];
    if (!cookies) {
      console.log('No cookies in response headers');
      return null;
    }

    // console.log('Cookies from response:', cookies);
    const accessTokenCookie = cookies.find(cookie => cookie.startsWith('accessToken='));

    if (!accessTokenCookie) {
      console.log('No access token cookie found in:', cookies);
      return null;
    }

    const token = extractTokenFromCookie(accessTokenCookie);
    // console.log('Extracted token:', token);
    return token;

  } catch (error) {
    console.error('Login error:', error.message);
    return null;
  }
}

const clearDB = async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Token.deleteMany({});
  await Review.deleteMany({});
  await Order.deleteMany({});
  await Image.deleteMany({});
}

const setupTestDbAdmin = async (api) => {
  await clearDB();

  // Create admin user (first user)
  const admin = await createTestAdmin();

  // Login admin to get token
  const adminAccessToken = await loginUser(api, initialAdmin.email, initialAdmin.password);

  return { admin, adminAccessToken };
}

const setupTestDbUser = async (api) => {

  const user = await createTestUser();

  const userAccessToken = await loginUser(api, initialUser.email, initialUser.password);

  return { user, userAccessToken };
}

const setupAnotherTestDbUser = async (api) => {

  const user = await createAnotherTestUser();

  const userAccessToken = await loginUser(api, "anotheruser@mail.com", "secret");

  return { user, userAccessToken };
}

const closeDbConnection = async () => {
  await mongoose.connection.close()
}

const userHelpers = {
  initialAdmin,
  initialUser,
  initialProduct,
  initialImage,
  createTestProduct,
  createTestOrder,
  createTestImage,
  usersInDb,
  loginUser,
  extractTokenFromCookie,
  resetPasswordToken,
  createTestReview,
  nonExistingId,
}

const dbHelpers = {
  closeDbConnection,
  setupTestDbAdmin,
  setupTestDbUser,
  setupAnotherTestDbUser,
}

module.exports = {
  ...userHelpers,
  ...dbHelpers
}