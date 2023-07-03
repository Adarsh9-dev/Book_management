# Book Management System

This is a Book Management System built with JavaScript, Node.js, AWS S3, and MongoDB.
## Requirements

- Node.js
- MongoDB
- AWS S3 account

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Adarsh9-dev/Book_management
   
Install the dependencies:

cd book-management-system
npm install

Create a .env file in the root directory and provide the following environment variables:

- PORT=8080
- MONGODB_URI=mongodb://localhost/book-management-system
- AWS_ACCESS_KEY_ID=your-aws-access-key-id
- AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
- AWS_S3_BUCKET_NAME=your-aws-s3-bucket-name

Start the application:

npm start
The application should now be running on http://localhost:8080.

## API Endpoints
### User Endpoints
- POST /api/user/register: Register a new user.
- POST /api/user/login: Login with user credentials.
### Book Endpoints
- POST /api/book: Create a new book.
- GET /api/book/:id: Get a specific book by ID.
- PUT /api/book/:id: Update a specific book by ID.
- DELETE /api/book/:id: Delete a specific book by ID.
### Review Endpoints
- POST /api/review: Create a new review for a book.
- GET /api/review/:id: Get a specific review by ID.
- PUT /api/review/:id: Update a specific review by ID.
- DELETE /api/review/:id: Delete a specific review by ID.

## Image Storage
Book images are stored in AWS S3. When creating or updating a book, you can upload an image file, and it will be stored in the configured AWS S3 bucket. The image URL will be saved in the book document.

## Authentication
JWT (JSON Web Token) authentication is used for user authentication. When a user registers or logs in, a JWT token is generated and returned in the response. This token should be included in the Authorization header of subsequent requests for authentication.

Authorization: Bearer your-jwt-token

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please open an issue or submit a pull request.
