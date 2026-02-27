const mongoose = require('mongoose');
require('dotenv').config();
const College = require('./models/College');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const tiers = await College.distinct('tier');
        console.log('Distinct Tiers:', tiers);

        const countTier1 = await College.countDocuments({ tier: "1" });
        console.log('Count Tier 1:', countTier1);

        const sample = await College.findOne({ tier: "1" });
        console.log('Sample Tier 1:', sample);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
