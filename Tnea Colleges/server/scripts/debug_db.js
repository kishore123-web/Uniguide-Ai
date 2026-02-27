const mongoose = require('mongoose');
require('dotenv').config();

const CollegeSchema = new mongoose.Schema({}, { strict: false });
const College = mongoose.model('College', CollegeSchema, 'colleges');

async function debug() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const branches = await College.distinct('branch');
        console.log("Branches in DB:", branches);

        const sample = await College.findOne();
        console.log("Sample Doc:", sample);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debug();
