
const mongoose = require('mongoose');
require('dotenv').config();
const College = require('./models/College');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            const districts = await College.distinct('district');
            console.log('Distinct Districts:', districts);

            const sample = await College.findOne({ district: 'Chennai' });
            console.log('Sample for Chennai:', sample ? 'Found' : 'Not Found');

            const count = await College.countDocuments({});
            console.log('Total Colleges:', count);

        } catch (err) {
            console.error(err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error(err));
