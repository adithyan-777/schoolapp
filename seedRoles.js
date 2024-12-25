const mongoose = require('mongoose');
const Role = require('./models/Role');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const seedRoles = async () => {
    const roles = [
        {
            name: 'Admin',
            permissions: ['create_user', 'delete_user', 'update_school', 'delete_school']
        },
        {
            name: 'Teacher',
            permissions: ['view_school', 'create_classroom', 'manage_students']
        },
        {
            name: 'Student',
            permissions: ['view_school', 'view_classroom']
        }
    ];

    try {
        await Role.insertMany(roles);
        console.log('Roles seeded successfully!');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
};

seedRoles();