const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const Scholarship = require('../models/Scholarship');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Load env variables if needed, though we might just use localhost string here for simplicity

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tnea_colleges';

const importScholarships = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const filePath = path.join(__dirname, '../../TNEA_Government_Schemes_and_Scholarships.xlsx');
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const rawData = xlsx.utils.sheet_to_json(sheet);

        console.log(`Found ${rawData.length} entries in excel.`);

        // Clear existing data? Let's clear to avoid duplicates on re-run
        await Scholarship.deleteMany({});
        console.log('Cleared existing scholarship data');

        const scholarships = rawData.map(row => ({
            schemeName: row['Scheme Name'],
            category: row['Category / Authority'],
            eligibility: row['Eligibility Criteria'],
            incomeLimit: row['Income Limit'],
            applicableTo: row['Applicable To'],
            benefits: row['Benefits Provided'],
            amount: row['Amount / Fee Waiver'],
            applicationMode: row['Application Mode'],
            remarks: row['Remarks']
        }));

        await Scholarship.insertMany(scholarships);
        console.log(`Successfully imported ${scholarships.length} scholarships.`);

        mongoose.disconnect();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

importScholarships();
