# Authentication Routes Documentation

## 1. Login with Email and Password
- **Endpoint:** `/login`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword"
  }
  ```
- **Successful Response:**
  ```json
  {
    "message": "Login exitoso",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username"
    }
  }
  ```
- **Possible Error Responses:**
  - 401: Incorrect credentials
  - 500: Server error

## 2. Google OAuth Login
- **Endpoints:** 
  - `/google`: Initiates Google OAuth login
  - `/callback`: Google OAuth callback
- **Process:** 
  - Redirects to Google authentication
  - On successful authentication, redirects to frontend with user data and token

## 3. Logout
- **Endpoint:** `/logout`
- **Method:** GET
- **Action:** Logs out user and redirects to home page

## 4. Send Verification Email
- **Endpoint:** `/send-verification-email`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "userpassword"
  }
  ```
- **Successful Response:**
  ```json
  {
    "message": "Correo de verificación enviado a user@example.com"
  }
  ```
- **Possible Error Responses:**
  - 400: Email already exists or missing email
  - 500: Server error

## 5. Send Password Reset Email
- **Endpoint:** `/send-password-reset-email`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Successful Response:**
  ```json
  {
    "message": "Correo para restablecer contraseña enviado a user@example.com"
  }
  ```
- **Possible Error Responses:**
  - 400: User not found or missing email
  - 500: Server error

## 6. Verify Email
- **Endpoint:** `/verify-email/:token`
- **Method:** POST
- **URL Parameter:** 
  - `token`: Verification token from email
- **Successful Response:** Creates user account
- **Possible Error Responses:**
  - 400: Invalid or expired token, user already exists
  - 500: Server error

## 7. Reset Password
- **Endpoint:** `/reset-password/:token`
- **Method:** POST
- **URL Parameter:** 
  - `token`: Password reset token from email
- **Request Body:**
  ```json
  {
    "newPassword": "newuserpassword"
  }
  ```
- **Successful Response:** Resets user password
- **Possible Error Responses:**
  - 400: Missing token or new password, invalid token
  - 404: User not found
  - 500: Server error