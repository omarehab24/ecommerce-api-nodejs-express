# E-commerce API Documentation

Ngrok is used as a secure tunnel. Using a free domain temporarily.

API Base URL: **https://kind-willingly-halibut.ngrok-free.app/api/v1**

## Table of Contents

- [Authentication](#authentication)
  - [Register](#register)
  - [Login](#login)
  - [Logout](#logout)
  - [Verify Email](#verify-email)
  - [Forgot Password](#forgot-password)
  - [Reset Password](#reset-password)
- [Users](#users)
  - [Get All Users](#get-all-users)
  - [Get Single User](#get-single-user)
  - [Show Current User](#show-current-user)
  - [Update User](#update-user)
  - [Update User Password](#update-user-password)
- [Products](#products)
  - [Get All Products](#get-all-products)
  - [Create Product](#create-product)
  - [Get Single Product](#get-single-product)
  - [Update Product](#update-product)
  - [Delete Product](#delete-product)
  - [Upload Image](#upload-image)
  - [Get Product Reviews](#get-product-reviews)
- [Reviews](#reviews)
  - [Get All Reviews](#get-all-reviews)
  - [Get Single Review](#get-single-review)
  - [Create Review](#create-review)
  - [Update Review](#update-review)
  - [Delete Review](#delete-review)
- [Orders](#orders)
  - [Get All Orders](#get-all-orders)
  - [Create Order](#create-order)
  - [Get Single Order](#get-single-order)
  - [Update Order](#update-order)
  - [Get Current User Orders](#get-current-user-orders)
- [Images](#images)
  - [Upload Image](#upload-image)
  - [Upload Multiple Images](#upload-multiple-images)
  - [Get All Images](#get-all-images)
  - [Get Single Image](#get-single-image)
  - [Delete Image](#delete-image)

## Authentication

Authentication is handled using JWT tokens stored in cookies. Protected routes require authentication.

### Register

Register a new user account.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "name": "test0",
    "email": "test@example.com",
    "password": "123456"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "msg": "Success! Please check your email to verify your account!"
    }
    ```

### Login

Login with existing user credentials.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "123456"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "user": {
        "userID": "674d9f90a5621de9520ebe2d",
        "name": "test",
        "role": "user"
      }
    }
    ```

### Logout

Logout the currently authenticated user.

- **URL**: `/auth/logout`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "msg": "User logged out!"
    }
    ```

### Verify Email

Verify user email with verification token.

- **URL**: `/auth/verify-email?verificationToken={token}&email={email}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "msg": "Email verified!"
    }
    ```

### Forgot Password

Request a password reset link.

- **URL**: `/auth/forgot-password`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "email": "test@example.com"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "msg": "Please check your email to reset your password!"
    }
    ```

### Reset Password

Reset password with token received in email.

- **URL**: `/auth/reset-password`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "newpassword",
    "token": "token-from-email"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "msg": "Password successfully reset!"
    }
    ```

## Users

### Get All Users

Get a list of all users (admin only).

- **URL**: `/users/`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "users": [
        {
          "name": "test2",
          "email": "test2@gmail.com",
          "role": "user",
          "isVerified": true,
          "verified": "2023-08-19T16:21:56.643Z",
          "id": "64e0ec0163d91940458da7d1"
        },
        {
          "name": "test",
          "email": "test@gmail.com",
          "role": "user",
          "isVerified": true,
          "verified": "2023-08-19T16:21:56.643Z",
          "id": "64e0ec0163d91940458da7d1"
        }
      ]
    }
    ```

### Get Single User

Get details of a specific user by ID.

- **URL**: `/users/{userId}`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "user": {
        "name": "test",
        "email": "test@gmail.com",
        "role": "user",
        "isVerified": true,
        "verified": "2023-08-19T16:21:56.643Z",
        "id": "64e0ec0163d91940458da7d1"
      }
    }
    ```

### Show Current User

Get the profile of the currently authenticated user.

- **URL**: `/users/showMe`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "user": {
        "userID": "645f977f0b52892c311eb265",
        "name": "test",
        "role": "user"
      }
    }
    ```

### Update User

Update the currently authenticated user's profile.

- **URL**: `/users/updateUser`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "name": "updated-name",
    "email": "updated-email@example.com"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "user": {
        "userID": "674d9f90a5621de9520ebe2d",
        "name": "updated-name",
        "role": "user"
      }
    }
    ```

### Update User Password

Update the currently authenticated user's password.

- **URL**: `/users/updateUserPassword`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "oldPassword": "123456",
    "newPassword": "1234567"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "msg": "Password updated!"
    }
    ```

## Products

### Get All Products

Get a list of all products.

- **URL**: `/products/`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "products": [
        {
          "name": "accent Chair",
          "price": 25999,
          "description": "Product description...",
          "image": "https://example.com/image.jpg",
          "category": "office",
          "company": "marcos",
          "colors": ["#ff0000", "#00ff00", "#0000ff"],
          "featured": false,
          "freeShipping": false,
          "inventory": 15,
          "averageRating": 1,
          "numOfReviews": 2,
          "user": "645f977f0b52892c311eb265",
          "createdAt": "2024-12-01T11:24:58.173Z",
          "updatedAt": "2024-12-01T20:57:54.683Z",
          "id": "674c478a397a664d48cd8aec"
        }
      ],
      "count": 1
    }
    ```

### Create Product

Create a new product (admin only).

- **URL**: `/products/`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request Body**:
  ```json
  {
    "name": "accent chair",
    "price": 25999,
    "image": "https://example.com/image.jpg",
    "colors": ["#ff0000", "#00ff00", "#0000ff"],
    "company": "marcos",
    "description": "Product description...",
    "category": "office"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Returns the created product object

### Get Single Product

Get details of a specific product by ID.

- **URL**: `/products/{productId}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns the product object

### Update Product

Update a specific product by ID (admin only).

- **URL**: `/products/{productId}/`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin)
- **Request Body**:
  ```json
  {
    "name": "Updated Product Name"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns the updated product object

### Delete Product

Delete a specific product by ID (admin only).

- **URL**: `/products/{productId}`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "msg": "Product deleted successfully!"
    }
    ```

### Upload Image

Upload a product image (admin only).

- **URL**: `/products/uploadImage`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request Body**: `multipart/form-data` with field name `image`
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "image": "/uploads/filename.jpeg"
    }
    ```

### Get Product Reviews

Get all reviews for a specific product.

- **URL**: `/products/{productId}/reviews`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns list of reviews for the product

## Reviews

### Get All Reviews

Get a list of all reviews.

- **URL**: `/reviews`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns list of all reviews with product and user details

### Get Single Review

Get details of a specific review by ID.

- **URL**: `/reviews/{reviewId}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns the review object

### Create Review

Create a new product review.

- **URL**: `/reviews/`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "product": "productId",
    "title": "Review Title",
    "comment": "Review Comment",
    "rating": 5
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Returns the created review object

### Update Review

Update a specific review by ID (review owner or admin).

- **URL**: `/reviews/{reviewId}`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "comment": "Updated Comment",
    "rating": 4
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns the updated review object

### Delete Review

Delete a specific review by ID (review owner or admin).

- **URL**: `/reviews/{reviewId}`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "msg": "Review deleted successfully!"
    }
    ```

## Orders

### Get All Orders

Get a list of all orders (admin only).

- **URL**: `/orders/`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns list of all orders

### Create Order

Create a new order.

- **URL**: `/orders/`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "tax": 399,
    "shippingFee": 499,
    "items": [
      {
        "name": "product name",
        "price": 25999,
        "image": "https://example.com/image.jpg",
        "amount": 3,
        "product": "productId"
      }
    ]
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Returns the created order object with a clientSecret

### Get Single Order

Get details of a specific order by ID (order owner or admin).

- **URL**: `/orders/{orderId}`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns the order object

### Update Order

Update payment information for a specific order (order owner or admin).

- **URL**: `/orders/{orderId}`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "paymentID": "payment-id-from-processor"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns the updated order object with status changed to "paid"

### Get Current User Orders

Get all orders for the currently authenticated user.

- **URL**: `/orders/showAllMyOrders`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns list of user's orders

## Images

### Upload Image

Upload an image to S3 (admin).

- **URL**: `/images/uploadImage`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```form-data
  image: image file
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Returns the uploaded image URL

### Upload Multiple Images

Upload multiple images to S3 (admin).

- **URL**: `/images/uploadMultipleImages`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```form-data
  images: image files
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Returns the uploaded image URLs

### Get All Images

Get a list of all images.

- **URL**: `/images/getAllImages`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns list of all images

### Get Single Image

Get details of a specific image by ID.

- **URL**: `/images/getImage/{imageId}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns the image object

### Delete Image

Delete a specific image by ID (admin).

- **URL**: `/images/deleteImage/{imageId}`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "msg": "Image deleted successfully!"
    }
    ```