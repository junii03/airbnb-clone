const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin', isAdmin: true });
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Create admin user
        const adminData = {
            name: 'Admin User',
            email: 'admin@airbnb.com',
            password: 'admin123', // This will be hashed by the User model
            role: 'admin',
            isAdmin: true
        };

        const admin = await User.create(adminData);
        console.log('Admin user created successfully:');
        console.log('Email:', admin.email);
        console.log('Password: admin123');
        console.log('Role:', admin.role);
        console.log('Admin ID:', admin._id);

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

createAdmin();
