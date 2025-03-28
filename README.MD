# Ecommerce API Documentation

## Overview
A full-featured REST API for ecommerce applications, built with Node.js and Express.js following the MVC (Model-View-Controller) pattern. This API provides comprehensive endpoints for managing products, users, orders, and reviews in an ecommerce platform.

## Base URL
Ngrok is used as a secure tunnel. Using a free domain temporarily.
**Hosted on**: AWS EC2 with Docker containerization
[https://kind-willingly-halibut.ngrok-free.app](https://kind-willingly-halibut.ngrok-free.app)

## Endpoints Documentation
[https://github.com/omarehab24/Ecommerce-API/blob/master/endpoints-documentation.md](https://github.com/omarehab24/Ecommerce-API/blob/master/endpoints-documentation.md)

## Docker Usage Documentation
[https://github.com/omarehab24/Ecommerce-API/blob/master/docker-documentation.md](https://github.com/omarehab24/Ecommerce-API/blob/master/docker-documentation.md)

## Key Features
- **Authentication & Authorization**: Complete user management with JWT-based authentication
- **Product Management**: CRUD operations for products with image upload support
- **Order Processing**: Order creation and management system
- **Review System**: Product review and rating functionality
- **User Management**: User registration, profile management, and password recovery

## Technical Stack
- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT) via signed cookies
- **Media Storage**: AWS S3
- **Email Service**: Nodemailer with gmail SMTP for transactional emails
- **Reverse Proxy & Load Balancing**: Nginx
- **Containerization**: Docker
- **Orchestration**: Docker Swarm
- **Hosting**: AWS EC2, MongoDB Atlas

## Security Features
- Password encryption with bcryptjs
- Cross-Origin Resource Sharing (CORS) protection
- Security headers with Helmet
- XSS protection
- Rate limiting
- MongoDB query sanitization
- HTTPS

## API Structure

### 1. Authentication (`/auth`)
- User registration with email verification
- Login/logout functionality
- Password reset capabilities
- Email verification system

### 2. Users (`/users`)
- User profile management
- Password updates
- Role-based access control

### 3. Products (`/products`)
- Complete product CRUD operations
- Image upload and management
- Product review integration
- Filtering and search capabilities

### 4. Reviews (`/reviews`)
- Product review management
- Rating system
- User-specific review controls

### 5. Orders (`/orders`)
- Order creation and management
- Order history
- User-specific order tracking

## Testing & Quality Assurance
- Integration testing using supertest
- Node.js native test runner
- Comprehensive endpoint testing

## Rate Limits and Quotas
- API requests are rate-limited for security
- Specific limits may apply to different endpoints

## Error Handling
The API uses standard HTTP status codes and returns detailed error messages in JSON format.

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request


