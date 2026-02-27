const mongoose = require('mongoose');
const College = require('../models/College');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tnea_colleges';

const check = async () => {
    try {
        console.log("Connecting to:", MONGO_URI);
        await mongoose.connect(MONGO_URI);
        const count = await College.countDocuments();
        console.log("College count:", count);
        mongoose.disconnect();
    } catch (e) { console.error(e); }
};
check();
