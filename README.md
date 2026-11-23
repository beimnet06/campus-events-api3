# Campus Events API

A RESTful backend API built with **NestJS and TypeScript** for managing campus events.

## Features
- Event management (GET and POST)
- API Key Authentication (Guard)
- Request Logging (Middleware)
- Request Timing (Interceptor)
- Data Validation (DTO & ValidationPipe)
- Swagger Documentation

## Installation

```bash
npm install
npm run start:dev
```

## URLs
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

## Environment Variable

```env
CLASSROOM_API_KEY=your-secret-api-key
```

## Author
Developed as a NestJS learning project.