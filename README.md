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

## 💬 Chat API Documentation

### Base URL
All chat routes are prefixed with: `/api/chat`

**Note:** All endpoints below require the header: `Authorization: Bearer <token>`

### 1. List My Conversations
Retrieves conversations the current user participates in.

*   **Endpoint:** `GET /conversations`
*   **URL:** `http://localhost:3000/api/chat/conversations`
*   **Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "conversations": [
    {
      "id": 1,
      "type": "direct",
      "name": null,
      "created_at": "2026-01-12T12:00:00.000Z"
    }
  ]
}
```

### 2. Create / Get Direct Conversation
Creates a direct conversation with another user (or returns the existing one if already created).

*   **Endpoint:** `POST /conversations/direct`
*   **URL:** `http://localhost:3000/api/chat/conversations/direct`
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
  "conversation": {
    "id": 12
  }
}
```

### 3. List Messages
Retrieves the latest messages for a conversation.

*   **Endpoint:** `GET /conversations/:id/messages`
*   **URL:** `http://localhost:3000/api/chat/conversations/12/messages`
*   **Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "messages": [
    {
      "id": 100,
      "conversation_id": 12,
      "sender_id": 1,
      "sender_username": "johndoe",
      "content": "Hello!",
      "created_at": "2026-01-12T12:34:56.000Z"
    }
  ]
}
```

---

## 🔌 Socket.IO Events (Chat)

The backend Socket.IO server expects the JWT token during the handshake.

**Client connection example:**
```js
// Filename: frontend/src/... or any client script
import { io } from "socket.io-client";

const token = localStorage.getItem("accessToken");
const socket = io("http://localhost:3000", {
  auth: { token },
});
```

### Events
*   **Join conversation room:** `conversation:join`
    *Payload:* `{ "conversationId": 12 }`
*   **Send message:** `message:send`
    *Payload:* `{ "conversationId": 12, "content": "hi" }`
*   **Receive new message:** `message:new`
    *Payload:* a message object (same shape as in `List Messages`)

---

## 🧪 Testing Chat

### 1) Login and copy the token
```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"securePassword123"}'
```

### 2) Create/get a direct conversation
```bash
TOKEN="PASTE_TOKEN_HERE"

curl -s -X POST http://localhost:3000/api/chat/conversations/direct \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"username":"target_username"}'
```

### 3) List messages
```bash
CONV_ID=12

curl -s http://localhost:3000/api/chat/conversations/$CONV_ID/messages \
  -H "Authorization: Bearer $TOKEN"
```

### 4) Test realtime delivery (Socket.IO)
Use the provided script:

```bash
cd backend
npm i socket.io-client
TOKEN="PASTE_TOKEN_HERE" CONV_ID=12 node scripts/socket-test.js
```

Expected behavior:
*   The script connects successfully
*   Joins the conversation room
*   Sends a test message
*   Receives `message:new` back from the server


---

## 👤 Profile API Documentation

### Base URL
All profile routes are prefixed with: `/api/profile`

**Note:** All endpoints below require the header: `Authorization: Bearer <token>`

### 1. Get My Profile
Returns the currently authenticated user's profile.

*   **Endpoint:** `GET /me`
*   **URL:** `http://localhost:3000/api/profile/me`
*   **Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar_url": null,
    "bio": null,
    "role": "user",
    "created_at": "2026-01-12T12:00:00.000Z",
    "updated_at": "2026-01-12T12:00:00.000Z"
  }
}
```

### 2. Update My Profile
Updates the currently authenticated user's profile (partial updates supported).

*   **Endpoint:** `PUT /me`
*   **URL:** `http://localhost:3000/api/profile/me`
*   **Headers:** `Authorization: Bearer <token>`
*   **Content-Type:** `application/json`

**Request Body (example):**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john_new@example.com",
  "avatar_url": "https://example.com/avatar.png",
  "bio": "Hello!",
  "password": "newPassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": "john_new@example.com",
    "avatar_url": "https://example.com/avatar.png",
    "bio": "Hello!",
    "role": "user",
    "created_at": "2026-01-12T12:00:00.000Z",
    "updated_at": "2026-01-12T12:10:00.000Z"
  }
}
```

**Error Responses:**
*   `400 Bad Request`: No updatable fields provided.
*   `409 Conflict`: Email already in use.
*   `404 Not Found`: User not found.

### 3. Delete My Account
Deletes the currently authenticated user.

*   **Endpoint:** `DELETE /me`
*   **URL:** `http://localhost:3000/api/profile/me`
*   **Headers:** `Authorization: Bearer <token>`

**Success Response:**
*   `204 No Content`

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
```

## 🗄️ Database Schema

The database `chat_app` includes the following primary tables:
*   `users`: Stores user credentials and profile info.
*   `friendships`: Manages connections between users.
*   `conversations`: Stores chat groups or direct message metadata.
*   `messages`: Stores the actual chat history.
*   `api_keys`: For external API access.