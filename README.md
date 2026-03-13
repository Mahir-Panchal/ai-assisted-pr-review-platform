
# AI-Assisted Pull Request Review Platform

AI-Assisted Pull Request Review Platform is a backend system that simulates an intelligent code review workflow similar to GitHub pull requests.

The platform allows developers to create repositories and submit pull requests which are automatically analyzed by an AI review engine. The AI evaluates the pull request, provides feedback, assigns a quality score, and either approves or requests changes. Approved pull requests can also be automatically merged.

This project demonstrates backend system design, API architecture, authentication, and AI-based workflow automation.

## Badges

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![API](https://img.shields.io/badge/API-REST-orange)
![Status](https://img.shields.io/badge/Project-Active-success)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- User authentication using JWT

- Repository creation and management

- Pull request workflow system

- AI-powered pull request review simulation

- Automatic PR approval or change request

- Auto-merge functionality

- AI quality scoring system

- Secure protected API routes

- Modular MVC backend architecture


## Backend

Node.js
Express.js
MongoDB
Mongoose
JWT Authentication

## Development Tools

Git
GitHub
Nodemon
Thunder Client / Postman

## System Architecture

The platform follows a modular backend architecture using MVC principles.

User requests are authenticated using JWT tokens and then routed through controllers that manage repositories, pull requests, and AI reviews.

Client
   |
   v
Authentication (JWT)
   |
   v
API Routes
   |
   v
Controllers
   |
   v
Services (AI Review Engine)
   |
   v
MongoDB Database## API Workflow

Typical workflow of the system:

1. User registers or logs in
2. User creates a repository
3. User submits a pull request
4. AI review engine analyzes the pull request
5. AI assigns a score and suggestions
6. If the score passes the threshold, the pull request is automatically merged
7. Otherwise, the pull request remains open with improvement suggestions



Register/Login
      |
      v
Create Repository
      |
      v
Submit Pull Request
      |
      v
AI Review Engine
      |
      +---- Score >= 80 → Merge
      |
      +---- Score < 80 → Request Changes

## Installation

Clone the repository

git clone https://github.com/Mahir-Panchal/ai-assisted-pr-review-platform.git

Navigate into backend folder

cd backend

Install dependencies

npm install

Create a .env file in the root directory

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run the development server
```
npm run dev
```

Server will run on
```
http://localhost:5000
```   
## API Reference

#### Authentication

```http
  POST /api/auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Name of the user |
| `email` | `string` | **Required**. Email address |
| `password` | `string` | **Required**. Password |


#### Login User

```http
  POST /api/auth/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. |
| `password`      | `string` | **Required**. |

Returns a JWT token used for protected routes.


#### Repository

Create Repository
```http
  POST /api/repos
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Repository name |
| `description` | `string` | **Required**. Optional repository description |



#### Get all Repositories

```http
  GET /api/repos
```

Returns all repositories belonging to the authenticated user.



#### Pull Requests

Create Repository
```http
  POST /api/repos/:repoId/pr
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | **Required**. |
| `description` | `string` | Optional. |



#### Get Pull Requests

```http
  GET /api/repos/:repoId/pr
```

Returns all pull requests of a repository.


#### AI Review

Run AI Review

```http
  POST /api/pr/:prId/review
```
Example Response
```
{
  "message": "AI review completed",
  "score": 88,
  "status": "merged"
}
```




## Demo

Example AI Review Response

```json
{
  "message": "AI review completed",
  "score": 88,
  "status": "merged",
  "comment": "Code improvements detected. Logic appears optimized."
}
```

Example Pull Request Creation

```http
  POST /api/repos/:repoId/pr
```
Request Body

```json
{
  "title": "Improve JWT middleware",
  "description": "Optimize authentication logic"
}
```
## Authors

Mahir Panchal
Computer Engineering Student
Pandit Deendayal Energy University

