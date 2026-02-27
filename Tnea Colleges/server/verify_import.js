const mongoose = require('mongoose');
const College = require('./models/College');
require('dotenv').config();

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await College.countDocuments({ averagePackage: { $exists: true, $ne: null } });
    console.log('Colleges with placement data:', count);

    if (count > 0) {
        const samples = await College.find({ averagePackage: { $exists: true, $ne: null } }).limit(2);
        console.log('Samples:', samples.map(s => s.name));
    }

    process.exit(0);
};

check();
