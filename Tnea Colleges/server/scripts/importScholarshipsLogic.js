const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const Scholarship = require('../models/Scholarship');

const importScholarships = async () => {
    const filePath = path.join(__dirname, '../../TNEA_Government_Schemes_and_Scholarships.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawData = xlsx.utils.sheet_to_json(sheet);

    // Clear existing data
    await Scholarship.deleteMany({});

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
};

module.exports = { importScholarships };
