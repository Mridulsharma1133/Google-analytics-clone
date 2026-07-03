# Google Analytics Clone

A full-stack analytics platform inspired by Google Analytics that enables event tracking, KPI management, dashboard analytics, and reporting.

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### Event Tracking

* Custom Event Tracking
* Page View Tracking
* Login Tracking
* Button Click Tracking
* Download Tracking
* Custom SDK Integration

### KPI Management

* Create KPI Configurations
* Dynamic KPI Dashboard Cards
* Count Aggregation
* Sum Aggregation
* Unique Aggregation
* Show/Hide KPIs
* Delete KPIs

### Analytics Dashboard

* Top Events
* Top Pages
* Top Traffic Sources
* Top Countries
* Recent Events
* Daily Trends

### Reports

* Event Reports
* Analytics Reports
* Export Ready Architecture

## Tech Stack

### Frontend

* React.js
* React Router
* Tailwind CSS
* Recharts
* Axios / Fetch API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

## Project Structure

client/
├── src/
│ ├── pages/
│ ├── components/
│ ├── services/
│ ├── theme/
│ └── App.jsx

server/
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middlewares/
│ ├── config/
│ └── app.js

## Installation

### Clone Repository

git clone <repository-url>

### Frontend Setup

cd client

npm install

npm run dev

### Backend Setup

cd server

npm install

npm run dev

## Environment Variables

Create a .env file inside server folder.

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

PORT=3001

## API Endpoints

### Authentication

POST /api/v1/auth/register

POST /api/v1/auth/login

### Events

POST /api/v1/events

GET /api/v1/events

### KPI

GET /api/v1/kpi

POST /api/v1/kpi/config

GET /api/v1/kpi/config

DELETE /api/v1/kpi/config/:id

PATCH /api/v1/kpi/config/:id

### Analytics

GET /api/v1/analytics

## Future Improvements

* Real-Time Analytics using Socket.IO
* Funnel Analytics
* Retention Analytics
* Report Export (PDF/CSV)
* User Segmentation
* Theme Builder
* Event Explorer

## Author

Mridul Sharma
MCA Student
Full Stack Developer | Machine Learning Enthusiast
