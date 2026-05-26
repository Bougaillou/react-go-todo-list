# Go React Todo List

A simple full-stack todo application built with React, Go, and MongoDB Atlas.

This project is my first time using Go on the backend. I built it to learn new technologies and a different approach to backend development while combining them with React on the frontend.

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Go, Fiber
- Database: MongoDB Atlas

## Setup Guide

### 1. Create a MongoDB Atlas cluster

1. Create a free cluster in MongoDB Atlas.
2. Create a database user with read and write access.
3. Add your IP address to the network access list.
4. Copy your connection string.

### 2. Configure the backend

Create a `.env` file in the project root with the following values:

```env
MONGODB_URL=your-mongodb-atlas-connection-string
FRONTEND_URL=http://localhost:5173
PORT=5000
```

Then start the Go server:

```bash
go mod tidy
go run main.go
```

### 3. Configure the frontend

Go to the client folder, install dependencies, and start the React app:

```bash
cd client
npm install
npm run dev
```

If you want to set the backend URL manually, create a `.env` file inside `client/`:

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

### 4. Run the app

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`

## API Endpoints

- `GET /api/todos` - get all todos
- `POST /api/todos` - create a todo
- `PATCH /api/todos/:id` - mark a todo as completed
- `DELETE /api/todos/:id` - delete a todo

## Notes

- Make sure the backend and frontend URLs match the CORS settings.
- The app uses MongoDB Atlas as the database source.
