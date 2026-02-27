const mongoose = require('mongoose');
const Scholarship = require('../models/Scholarship');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tnea_colleges';

const check = async () => {
    try {
        console.log("Connecting to:", MONGO_URI);
        await mongoose.connect(MONGO_URI);
        const count = await Scholarship.countDocuments();
        console.log("Scholarship count:", count);
        if (count > 0) {
            const sample = await Scholarship.findOne();
            console.log("Sample:", sample);
        }
        mongoose.disconnect();
    } catch (e) { console.error(e); }
};
check();
