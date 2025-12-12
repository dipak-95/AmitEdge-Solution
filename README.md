# Task & Attendance Management System

A full-stack application for managing tasks, attendance, leaves, and reporting.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Socket.IO
- **Frontend**: React, Vite, Tailwind CSS
- **Auth**: JWT, RBAC (Superadmin, Admin, Employee)

## Project Structure

- `server/`: Backend API and Socket.IO server.
- `client/`: Frontend React application.

## Local Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or URI)

### Backend Setup
1. Navigate to `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (already created) with:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task-attendance-db
   JWT_SECRET=supersecretkey
   ```
4. Seed the database (creates default users and tasks):
   ```bash
   npm run seed
   # Or directly: node seed.js
   ```
5. Start the server:
   ```bash
   npm start 
   # Or for dev: npm run dev
   ```

### Frontend Setup
1. Navigate to `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Client (Netlify/Vercel)
1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder.
3. Ensure to set API URL in environment variables or update `api.js` base URL to point to production server.

### Server (Render/Railway/Heroku)
1. Push `server` folder (or root) to Git.
2. Configure build command: `npm install`
3. Configure start command: `node index.js`
4. Set Environment Variables (`MONGO_URI`, `JWT_SECRET`).

## Credentials (Seed Data)
- **Superadmin**: `super` / `Super@123`
- **Admin**: `admin1` / `Admin@123`
- **Employee**: `emp1` / `Emp@123`
