#  Store Rating Web Application

A full-stack web application that allows users to rate stores and view ratings based on different user roles.

## Tech Stack

### Frontend
- React.js
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt (password hashing)

### Database
- MySQL

##  Features

###  Authentication
- User Signup & Login
- JWT-based authentication
- Role-based access control

---

##  User Roles

###  Admin
- View total users, stores, and ratings
- Add users and stores
- View all users and stores
- Apply filters (name, email, role)

---

### Normal User
- Signup & Login
- View all stores
- Search stores by name/address
- Submit rating (1–5)
- Modify rating

###  Store Owner
- Login
- View their store details
- See average rating
- See users who rated their store


##  Database Schema

### Users Table
- id
- name
- email
- password
- address
- role (admin / user / owner)

### Stores Table
- id
- name
- email
- address
- owner_id

### Ratings Table
- id
- user_id
- store_id
- rating (1–5)



## ⚙️ Setup Instructions

### 1️. Clone Repository
```bash
git clone <your-repo-url>
cd store-rating-app
2️. Backend Setup
cd backend
npm install

Create .env file:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=store_rating_app1
JWT_SECRET= your can put any secret key

Run backend:
npm i
node server.js
3️. Frontend Setup
npm create vite@latest frontend
npm i
npm run dev

4️. Database Setup
Open MySQL Workbench
Create database:
CREATE DATABASE store_rating_app1;
USE store_rating_ap1p;
Run tables SQL (from project)
**## Testing**
**Sample Users**
Role	Email	Password
Admin	admin1@gmail.com
	Password@123
User	user1@gmail.com
	Password@123
Owner	owner1@gmail.com
	Password@123
 **Functionalities Tested
**Signup & Login**
Role-based redirection
 Store listing
Search functionality
 Rating submission & update
 Admin dashboard
 Owner dashboard
 Logout
 Form validations**
**** Validations**
Name: 10–60 characters
Password: 8–16 chars, 1 uppercase + 1 special char
Email: valid format
Address: max 400 characters
 
**Author**

Prince Kumar
BTech Student | Full Stack Developer

Project Purpose

This project was built as part of a FullStack Intern Coding Challenge to demonstrate:

Backend API design
Database handling
Role-based authentication
Full-stack integration
Contact

For any queries or collaboration:

Email: princekumarkha2005@gmail.com

---

# What to do now

1. Create file in your project:

README.md
**user dashboard**
<img width="1205" height="852" alt="image" src="https://github.com/user-attachments/assets/ea9e657f-129d-43c6-94c7-7ecf8b756140" />

**store**
<img width="1209" height="500" alt="image" src="https://github.com/user-attachments/assets/f683be90-db2d-4190-b45b-6f0997b5cd98" />

**Admin**
<img width="1209" height="856" alt="image" src="https://github.com/user-attachments/assets/d0c359de-a4e1-4cb5-a1d9-274a182b868a" />


2. Paste this content

3. Push to GitHub:
```bash
git add README.md
git commit -m "Added README"
git push
