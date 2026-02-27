const mongoose = require('mongoose');

// Hardcode URI for certainty or use simple generic one suitable for local
const MONGO_URI = 'mongodb://127.0.0.1:27017/tnea';

const checkDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB at', MONGO_URI);

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        if (!collections.find(c => c.name === 'colleges')) {
            console.log('WARNING: "colleges" collection MISSING.');
        } else {
            const count = await mongoose.connection.db.collection('colleges').countDocuments();
            console.log(`Total Value in 'colleges': ${count}`);

            if (count > 0) {
                const sample = await mongoose.connection.db.collection('colleges').findOne();
                console.log('Sample Doc:', JSON.stringify(sample, null, 2));
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkDB();
