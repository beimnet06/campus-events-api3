# Campus Events API – JWT Authentication

## Overview
JWT-based authentication implemented using NestJS and Passport.

## Features
- User registration with email validation.
- Password hashing using Argon2.
- Login with access and refresh tokens.
- JWT authentication strategy and guard.
- Protected `/api/auth/me` endpoint.
- Public routes using the `@Public()` decorator.
- Refresh-token rotation and logout implementation.
- Swagger Bearer authentication configuration.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh tokens |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

## Current Status
Registration and login are implemented. JWT verification on the protected `/api/auth/me` endpoint is still being debugged due to an invalid signature. Refresh and logout functionality still require complete testing.

## Technologies
NestJS, TypeScript, Passport JWT, Argon2, class-validator, Swagger.