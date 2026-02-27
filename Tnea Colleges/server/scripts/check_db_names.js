const mongoose = require('mongoose');
const path = require('path');
const College = require('../models/College');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const listNames = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // fetch 20 random college names
        const colleges = await College.find({}, 'name code').limit(20);
        console.log("Sample DB Names:");
        colleges.forEach(c => console.log(`${c.code}: ${c.name}`));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listNames();
