# Student Management API

A RESTful API built with Node.js, Express, MongoDB, and Prisma to manage student records for a school system.

## Features

- **Add new student** – `POST /students`
- **Get a list of active students (with pagination)** – `GET /students?page=1&limit=10`
- **Get student by registration number** – `GET /students/:regNo`
- **Update student details (except registration number)** – `PUT /students/:regNo`
- **Soft delete student by registration number** – `DELETE /students/:regNo`
- **Validation:**
  - Enforces uniqueness of `registrationNumber`
  - Enforces uniqueness of `rollNo` per `class`

## Tech Stack

- Node.js
- Express.js
- MongoDB (via Prisma ORM)
- Prisma

## Environment Variables

Create a `.env` file based on `.env.example` with the following

DATABASE_URL=your-mongodb-connection-url
PORT=8800

## Clone the below repository and Navigate to the project directory:

https://github.com/Avipriya02/Student_Module.git

cd Student_Module

## Install dependencies:

npm install

## Generate the Prisma client:

npx prisma generate

##  Push Prisma schema to your MongoDB:

npx prisma db push

## Start the server

Run either npm start command or nodemon command


## Sample Student Insertion (POST /students)

Use the following JSON body:

{
  "registrationNumber": "REG001",
  "name": "Alice",
  "class": "10A",
  "rollNo": 1,
  "contactNumber": "9876543201",
  "status": true
}















