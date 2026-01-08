# Chat App - Developer Guide

This project is a full-stack chat application consisting of a React frontend, a Node.js/Express backend, and a MySQL database.

## 📂 Project Structure

*   **`frontend/`**: React application (Vite).
*   **`backend/`**: Node.js Express server.
*   **`database/`**: Docker configuration for MySQL and initialization scripts.

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### 1. Start the Database
The database is containerized using Docker.

1.  Navigate to the database folder:
    ```bash
    cd database
    ```
2.  Start the container:
    ```bash
    docker-compose up -d
    ```
    *This will start MySQL on port `3306` and automatically run the schema initialization scripts found in `database/init/`.*

### 2. Start the Backend Server
The backend runs on port `3000`.

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    node app.js
    # OR if you have nodemon installed
    nodemon app.js
    ```

### 3. Start the Frontend Client
The frontend runs on port `5173` (default Vite port) and proxies API requests to the backend.

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser at the URL shown in the terminal (usually `http://localhost:5173`).

---

## 📡 API Documentation

### Base URL
All authentication routes are prefixed with: `/api/auth`

### 1. Register User
Creates a new user account.

*   **Endpoint:** `POST /register`
*   **URL:** `http://localhost:3000/api/auth/register`
*   **Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user" 
}
```

**Success Response (200):**
```json
{
  "message": "registerd success"
}
```

**Error Responses:**
*   `400 Bad Request`: Missing required fields or invalid role.
*   `409 Conflict`: Email, Username, or Name combination already exists.
*   `500 Internal Server Error`: Server issue.

### 2. Login User
Authenticates a user and returns a JWT token.

*   **Endpoint:** `POST /login`
*   **URL:** `http://localhost:3000/api/auth/login`
*   **Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
*   `400 Bad Request`: Missing username or password.
*   `401 Unauthorized`: Invalid credentials (wrong username or password).
*   `500 Internal Server Error`: Server issue.

### 3 Friends API
All friends routes are prefixed with: `/api/friends`
**Note:** All endpoints below require the header: `Authorization: Bearer <token>`

### . List Friends
Retrieves all users with whom the current user has an 'accepted' friendship status.

*   **Endpoint:** `GET /list`
*   **URL:** `http://localhost:3000/api/friends/list`
*   **Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "friends": [
    {
      "id": 2,
      "username": "jane_doe",
      "first_name": "Jane",
      "last_name": "Doe",
      "avatar_url": null,
      "bio": "Hello world"
    }
  ]
}
```
### . List sent Requests
Retrieves a list of users who have sent a friend request to the current user.

*   **Endpoint:** `GET /sent`
*   **URL:** `http://localhost:3000/api/friends/pending`
*   **Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
[
  {
    "id": 3,
    "username": "new_user",
    "first_name": "New",
    "last_name": "User",
    "avatar_url": null,
    "bio": null
  }
]
```

### . List Pending Requests
Retrieves a list of users who have sent a friend request to the current user.

*   **Endpoint:** `GET /pending`
*   **URL:** `http://localhost:3000/api/friends/pending`
*   **Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
[
  {
    "id": 3,
    "username": "new_user",
    "first_name": "New",
    "last_name": "User",
    "avatar_url": null,
    "bio": null
  }
]
```

### . Send Friend Request
Sends a friend request to another user by their username.

*   **Endpoint:** `POST /request`
*   **URL:** `http://localhost:3000/api/friends/request`
*   **Headers:** `Authorization: Bearer <token>`
*   **Content-Type:** `application/json`

**Request Body:**
```json
{
  "username": "target_username"
}
```

**Success Response (200):**
```json
{
  "message": "Friend request sent"
}
```

### . Accept Friend Request
Accepts an incoming friend request from a specific user.

*   **Endpoint:** `PUT /accept`
*   **URL:** `http://localhost:3000/api/friends/accept`
*   **Headers:** `Authorization: Bearer <token>`
*   **Content-Type:** `application/json`

**Request Body:**
```json
{
  "username": "requester_username"
}
```

**Success Response (200):**
```json
{
  "message": "Friend request accepted"
}
```

### . Remove Friend / Decline Request
Removes an existing friend or declines a pending friend request.

*   **Endpoint:** `DELETE /remove`
*   **URL:** `http://localhost:3000/api/friends/remove`
*   **Headers:** `Authorization: Bearer <token>`
*   **Content-Type:** `application/json`

**Request Body:**
```json
{
  "username": "username_to_remove"
}
```

**Success Response (200):**
```json
{
  "message": "Friend removed"
}
```

---

## ⚙️ Environment Variables

The backend relies on a `.env` file located in `backend/.env`. Ensure it contains the following:

```env
DB_HOST=localhost
DB_USER=chat
DB_PASSWORD=chat
DB_NAME=chat_app
DB_PORT=3306
JWT_SECRET=.

## 🗄️ Database Schema

The database `chat_app` includes the following primary tables:
*   `users`: Stores user credentials and profile info.
*   `friendships`: Manages connections between users.
*   `conversations`: Stores chat groups or direct message metadata.
*   `messages`: Stores the actual chat history.
*   `api_keys`: For external API access.