# School Management System API

## **Description**

The **School Management System** is a modern and scalable solution designed to streamline the operations of educational institutions by managing schools, classrooms, students, and user roles efficiently. Superadmins can oversee multiple schools, while school administrators handle classroom capacities, student enrollments, and profiles. The system supports secure data management with MongoDB, role-based access control, and encrypted passwords. With comprehensive RESTful APIs and Swagger documentation, it integrates seamlessly into other applications, offering an intuitive and centralized platform for managing educational institutions effectively.

## **Database Design**

### **1. School Model**

Represents the school entity in the application.

#### **Attributes**:

- `name`: (String) The name of the school. Must be unique and is required.
- `address`: (String) The physical address of the school. Required.
- `contactNumber`: (String) The contact number for the school. Required.

#### **Timestamps**:

- Automatically adds `createdAt` and `updatedAt` fields to track creation and update times.

#### **Methods**:

- `toJSON`: Converts the Mongoose document into a plain JavaScript object and removes the `__v` field for cleaner responses.

---

### **2. Classroom Model**

Represents the classroom entity, which is associated with a specific school.

#### **Attributes**:

- `name`: (String) The name of the classroom. Must be unique and is required.
- `school`: (ObjectId) References the school the classroom belongs to. Required.

#### **Timestamps**:

- Automatically adds `createdAt` and `updatedAt` fields.

#### **Methods**:

- `toJSON`: Converts the Mongoose document into a plain JavaScript object and removes the `__v` field for cleaner responses.

---

### **3. Student Model**

Represents students enrolled in schools and associated classrooms.

#### **Attributes**:

- `firstName`: (String) The first name of the student. Required.
- `lastName`: (String) The last name of the student. Required.
- `email`: (String) The email of the student. Must be unique and is required.
- `phone`: (String) Optional phone number of the student.
- `classroom`: (ObjectId) Reference to the student's current classroom. Required.
- `school`: (ObjectId) Reference to the student's current school. Required.
- `enrollmentStatus`: (String) Status of the student's enrollment. Enum values: `Enrolled`, `Transferred`, `Graduated`, `Dropped`. Defaults to `Enrolled`.
- `enrollmentHistory`: (Array of objects) Tracks the student’s previous school and classroom history, along with their status and enrollment dates.
- `guardians`: (Array of objects) Stores information about the student’s guardians, including:
  - `name`: Name of the guardian.
  - `contactInfo`: Guardian’s phone and email.
  - `relationship`: Relationship of the guardian to the student.
- `enrollmentDate`: (Date) The date when the student was enrolled in the current school. Defaults to the current date.

#### **Timestamps**:

- Automatically adds `createdAt` and `updatedAt` fields.

#### **Methods**:

- `toJSON`: Converts the Mongoose document into a plain JavaScript object and removes the `__v` field for cleaner responses.

---

### **4. User Model**

Represents the users of the system, including superadmins and school administrators.

#### **Attributes**:

- `name`: (String) The name of the user. Required.
- `email`: (String) The email address of the user. Must be unique, lowercase, and is required.
- `password`: (String) The hashed password of the user. Required.
- `role`: (String) The role of the user. Enum values: `SuperAdmin`, `SchoolAdmin`. Required.
- `school`: (ObjectId) Reference to the associated school for a `SchoolAdmin`. Optional for `SuperAdmin`.
- `createdBy`: (ObjectId) Reference to the user who created this user. Optional.

#### **Timestamps**:

- Automatically adds `createdAt` and `updatedAt` fields.

#### **Pre-save Hook**:

- Before saving, hashes the password using `bcryptjs` if it is modified.

#### **Methods**:

- `toJSON`: Converts the Mongoose document into a plain JavaScript object, removes the `password` and `__v` fields for secure and clean responses.

---

## Relationships Between Models

1. **School ↔ Classroom**:

   - One-to-Many: A school can have multiple classrooms.
   - Reference: `school` in the Classroom model links to the School model.

2. **School ↔ Student**:

   - One-to-Many: A school can have multiple students.
   - Reference: `school` in the Student model links to the School model.

3. **Classroom ↔ Student**:

   - One-to-Many: A classroom can have multiple students.
   - Reference: `classroom` in the Student model links to the Classroom model.

4. **User ↔ School**:
   - One-to-One (Optional): A `SchoolAdmin` user is associated with a specific school.
   - Reference: `school` in the User model links to the School model.

---

## **Features**

- CRUD operations for schools, classrooms, and students.
- Authentication and authorization.
- Rate limiting to prevent abuse.
- Centralized error handling.
- CORS support for secure API usage.
- Swagger documentation for APIs.

## **Installation**

1. **Clone the repository:**

   ```
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Set up environment variables:** Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/schoolapp
MONGO_TEST_URI=mongodb://localhost:27017/test
SERVER_URL="http://11.33.200.98:3000
NODE_ENV="development"
JWT_SECRET=your_jwt_secret
RATE_LIMIT_MAX=100
```

## **Usage**

1. **Start the server:**

   ```
   npm start
   ```

2. **Run in development mode (with hot-reloading):**

   ```
   npm run dev
   ```

3. **Access Swagger API documentation:** Navigate to http://localhost:3000/api-docs.

## **Scripts**

- **Start server:**
  ```
  npm start
  ```
- **Run development server:**
  ```
  npm run dev
  ```

## Tests

it contains subfolders like `config` for Jest configuration, `fixtures` for sample test data, `integration` for API endpoint validation (covering CRUD operations for schools, classrooms, students, and users), `setup` for managing the test environment, and `utils` for reusable test helpers. This comprehensive structure verifies the application's behavior across various scenarios, ensuring robustness and maintainability.

## **Technologies Used**

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Documentation:** Swagger
- **Input validation** : AJV
- **Authentication:** JSON Web Tokens (JWT)
- **Rate Limiting:** Express Rate Limit
- **Logging**: winston
- **Testing:** Jest, Supetest
- **Environment Variables:** dotenv
