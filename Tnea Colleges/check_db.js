const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const MONGO_URI = process.env.MONGO_URI;

const checkDB = async () => {
    if (!MONGO_URI || MONGO_URI.includes('<PASSWORD>')) {
        console.error('ERROR: Please update the MONGO_URI in server/.env with your actual password.');
        process.exit(1);
    }

    try {
        console.log('Connecting to Cloud MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB Atlas!');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available Collections:', collections.map(c => c.name));

        const count = await mongoose.connection.db.collection('colleges').countDocuments();
        console.log(`Total Colleges in DB: ${count}`);

        if (count === 0) {
            console.warn('Warning: "colleges" collection is empty.');
        } else {
            const sample = await mongoose.connection.db.collection('colleges').findOne();
            console.log('Sample Document Structure:', JSON.stringify(sample, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('DB Connection Failed:', err.message);
        process.exit(1);
    }
};

checkDB();
