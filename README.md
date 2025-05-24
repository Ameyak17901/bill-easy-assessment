# Book Management System 

### Backend:

A RESTful API backend built with Node.js for managing a digital library system with comprehensive book management and user review capabilities.
Core Features

### Book Management

1. Add new books with metadata (title, author, review)
2. Search books by various criteria (author and title)

## Review System

User authentication and authorization
Submit and edit book reviews with ratings (1-5 stars)
View aggregated review statistics per book
Moderate and manage review content

## **API Endpoints**

> POST /api/books - Add new books  
> GET /api/books - Retrieve books with filtering options  
> GET /api/books/:id - Retrieve book with given id  
> POST /api/books/:id/reviews - Create book review information  
> PUT /api/reviews/:id - Submit book reviews  
> DELETE /api/reviews/:id - Delete review for specific books  

## Technical Stack
Runtime & Framework

- Node.js with Express.js framework
- RESTful API architecture following industry standards

## Database Integration

- MongoDB with Mongoose ODM for flexible document storage
- Optimized schemas for books, users, and reviews
- Indexed fields for efficient querying

## Security & Validation

- JWT-based authentication system
- Input validation and sanitization
- Password hashing with bcrypt

## Guide

1. Clone the repository.
   ```
    git clone https://github.com/Ameyak17901/bill-easy-assessment.git
   ```
2. To run the project.
   ```
    npm run dev
   ```   

