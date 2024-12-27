const mongoose = require('mongoose');
const Role = require('./models/Role');

async function seedRoles() {
    const roles = [
        {
            name: 'SuperAdmin',
            permissions: [
                'createSchool', 'viewSchool', 'editSchool', 'deleteSchool',
                'createClassroom', 'viewClassroom', 'editClassroom', 'deleteClassroom',
                'createStudent', 'viewStudent', 'editStudent', 'deleteStudent'
            ]
        },
        {
            name: 'SchoolAdmin',
            permissions: [
                'viewSchool', 'editSchool',
                'createClassroom', 'viewClassroom', 'editClassroom', 'deleteClassroom',
                'createStudent', 'viewStudent', 'editStudent', 'deleteStudent'
            ]
        },
        {
            name: 'Teacher',
            permissions: [
                'viewClassroom', 'editClassroom',
                'createStudent', 'viewStudent', 'editStudent'
            ]
        },
        {
            name: 'Student',
            permissions: [
                'viewClassroom', 'viewStudent'
            ]
        }
    ];

    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database.');

        for (const role of roles) {
            const roleExists = await Role.findOne({ name: role.name });
            if (!roleExists) {
                await Role.create(role);
                console.log(`Added role: ${role.name} with permissions: ${role.permissions}`);
            }
        }

        console.log('Roles and permissions seeding completed.');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding roles and permissions:', error);
        mongoose.disconnect();
    }
}

seedRoles();
