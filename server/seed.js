const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing
        await User.deleteMany({});
        await Task.deleteMany({});
        // Also clear other collections to be clean
        // await Attendance.deleteMany({});
        // await Leave.deleteMany({});

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashSuper = await bcrypt.hash('Dipak@123', salt);

        // Create Superadmin
        const superUser = await User.create({
            username: 'Dipak Ladani',
            email: 'dp583517@gmail.com',
            password: hashSuper,
            role: 'superadmin',
            department: 'Management',
            designation: 'CEO'
        });

        console.log('Data seeded successfully with Superadmin: Dipak Ladani');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
