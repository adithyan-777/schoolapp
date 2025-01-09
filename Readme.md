# **School Management System API**

## **Overview**

The **School Management System** is a scalable and modern solution for managing educational institutions. It streamlines operations by handling schools, classrooms, students, and user roles efficiently. 

- **Superadmins** oversee multiple schools.  
- **School administrators** manage classroom capacities, student enrollments, and profiles.  

The system uses MongoDB for secure data management, role-based access control, and encrypted passwords. It offers comprehensive RESTful APIs with Swagger documentation, providing a centralized platform that integrates seamlessly into other applications.

---

## **Database Models**

### **1. School Model**
Represents a school entity.

- **Attributes**:
  - `name` (String): Name of the school. Unique and required.
  - `address` (String): School's address. Required.
  - `contactNumber` (String): Contact number. Required.
- **Timestamps**: Adds `createdAt` and `updatedAt` automatically.
- **Methods**:
  - `toJSON`: Returns a clean object without the `__v` field.

---

### **2. Classroom Model**
Represents a classroom belonging to a school.

- **Attributes**:
  - `name` (String): Classroom name. Unique and required.
  - `school` (ObjectId): References the school. Required.
- **Timestamps**: Adds `createdAt` and `updatedAt` automatically.
- **Methods**:
  - `toJSON`: Returns a clean object without the `__v` field.

---

### **3. Student Model**
Tracks student details, enrollment, and guardians.

- **Attributes**:
  - `firstName` (String): Student's first name. Required.
  - `lastName` (String): Student's last name. Required.
  - `email` (String): Unique and required.
  - `classroom` (ObjectId): References the classroom. Required.
  - `school` (ObjectId): References the school. Required.
  - `enrollmentStatus` (String): Status with options like `Enrolled`, `Graduated`, etc.
  - `guardians` (Array): Guardian details including name, contact info, and relationship.
  - `enrollmentDate` (Date): Defaults to the current date.
- **Timestamps**: Adds `createdAt` and `updatedAt` automatically.
- **Methods**:
  - `toJSON`: Returns a clean object without the `__v` field.

---

### **4. User Model**
Represents system users.

- **Attributes**:
  - `name` (String): User's name. Required.
  - `email` (String): Unique and required.
  - `password` (String): Hashed password. Required.
  - `role` (String): Either `SuperAdmin` or `SchoolAdmin`. Required.
  - `school` (ObjectId): References the school for school admins.
- **Pre-Save Hook**: Hashes the password using `bcryptjs`.
- **Methods**:
  - `toJSON`: Removes sensitive fields like `password` and `__v`.

---

## **Relationships**

1. **School ↔ Classroom**: A school has multiple classrooms (1-to-Many).  
2. **School ↔ Student**: A school has multiple students (1-to-Many).  
3. **Classroom ↔ Student**: A classroom has multiple students (1-to-Many).  
4. **User ↔ School**: A `SchoolAdmin` is linked to one school.

---

## **Features**

- CRUD operations for schools, classrooms, and students.
- Authentication using JSON Web Tokens (JWT).
- Role-based access control.
- Rate limiting for API protection.
- Centralized error handling.
- CORS support for secure API access.
- Swagger documentation for easy API exploration.

---

## **Installation**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adithyan-777/schoolapp.git
   cd schoolapp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:  
   Create a `.env` file with these variables:
   ```env
   PORT=3000
   MONGO_URI="mongodb://localhost:27017/schoolapp"
   MONGO_PASS="password"
   MONGO_TEST_URI="mongodb://localhost:27017/schoolapp"
   SERVER_URL="http:12.22.200.89:3000"
   JWT_SECRET=your_jwt_secret
   NODE_ENV="development"
   RATE_LIMIT_MAX=100
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

---

## **Usage**

- **Swagger documentation**:  
  Navigate to `http://localhost:3000/api-docs`.

---

## **Technologies**

- **Backend**: Node.js, Express.js.  
- **Database**: MongoDB.  
- **Authentication**: JWT.  
- **Documentation**: Swagger.  
- **Validation**: AJV.  
- **Testing**: Jest, Supertest.  
- **Hosting**: AWS EC2 with Nginx and PM2.  

---
