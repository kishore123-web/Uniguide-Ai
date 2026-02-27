const mongoose = require('mongoose');
const path = require('path');
const College = require('../models/College');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const listBranches = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const branches = await College.distinct('branch');
        console.log("Unique Branches in DB:");
        branches.sort().forEach(b => console.log(b));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listBranches();
