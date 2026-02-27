const mongoose = require('mongoose');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const College = require('../models/College');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tnea_colleges';

const importData = async () => {
    try {
        const rootDir = path.join(__dirname, '../../'); // Go up two levels to root
        const files = fs.readdirSync(rootDir).filter(file => file.endsWith('.xlsx') && file.startsWith('Tier'));

        console.log(`Found ${files.length} Excel files to process.`);

        const colleges = [];

        for (const file of files) {
            const filePath = path.join(rootDir, file);
            // Extract Tier and SubTier from filename, e.g., "Tier 1 (A).xlsx"
            const tierMatch = file.match(/Tier\s*(\d+)\s*\(([A-Z])\)/i);
            const tier = tierMatch ? tierMatch[1] : 'Unknown';
            const subTier = tierMatch ? tierMatch[2] : 'Unknown';

            console.log(`Processing ${file} (Tier: ${tier}, SubTier: ${subTier})...`);

            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet);

            // Normalize data keys
            data.forEach(row => {
                const collegeName = row['College Name'] || row['Name'] || row['College'];
                const branch = row['Department'] || row['Branch'] || row['Course'];
                const code = row['Councelling Code'] || row['Code'] || row['College Code'];
                // District isn't explicitly in the snippet I saw, but I'll check generic keys
                // District Inference
                let district = row['District'] || row['City'] || row['Location'];

                if (!district) {
                    const nameUpper = collegeName ? collegeName.toUpperCase() : '';
                    if (nameUpper.includes('CHENNAI') || nameUpper.includes('MADRAS') || nameUpper.includes('CHROMEPET') || nameUpper.includes('EGMORE') || nameUpper.includes('GUINDY')) district = 'Chennai';
                    else if (nameUpper.includes('COIMBATORE')) district = 'Coimbatore';
                    else if (nameUpper.includes('MADURAI')) district = 'Madurai';
                    else if (nameUpper.includes('TRICHY') || nameUpper.includes('TIRUCHIRAPPALLI')) district = 'Tiruchirappalli';
                    else if (nameUpper.includes('SALEM')) district = 'Salem';
                    else if (nameUpper.includes('ERODE')) district = 'Erode';
                    else if (nameUpper.includes('VELLORE')) district = 'Vellore';
                    else if (nameUpper.includes('KANCHIPURAM') || nameUpper.includes('KANCHEEPURAM')) district = 'Kancheepuram';
                    else if (nameUpper.includes('THIRUVALLUR') || nameUpper.includes('TIRUVALLUR')) district = 'Tiruvallur';
                    else if (nameUpper.includes('THANJAVUR')) district = 'Thanjavur';
                    else if (nameUpper.includes('TIRUNELVELI')) district = 'Tirunelveli';
                    else if (nameUpper.includes('KANYAKUMARI') || nameUpper.includes('NAGERCOIL')) district = 'Kanyakumari';
                    else if (nameUpper.includes('NAMAKKAL')) district = 'Namakkal';
                    else if (nameUpper.includes('DINDIGUL')) district = 'Dindigul';
                    else if (nameUpper.includes('KRISHNAGIRI') || nameUpper.includes('HOSUR')) district = 'Krishnagiri';
                    else if (nameUpper.includes('VIRUDHUNAGAR')) district = 'Virudhunagar';
                    else if (nameUpper.includes('SIVAGANGA') || nameUpper.includes('KARAIKUDI')) district = 'Sivaganga';
                    else if (nameUpper.includes('CUDDALORE')) district = 'Cuddalore';
                    else if (nameUpper.includes('VILLUPURAM')) district = 'Villupuram';
                    else if (nameUpper.includes('THENI')) district = 'Theni';
                    else if (nameUpper.includes('TUTICORIN') || nameUpper.includes('THOOTHUKUDI')) district = 'Thoothukudi';
                    else district = 'Other';
                }

                if (collegeName && branch) {
                    // Iterate through categories
                    const categories = ['OC', 'BC', 'MBC', 'SC', 'ST', 'BCM', 'SCA'];

                    categories.forEach(cat => {
                        // Find key that contains "OC Cutoff", etc.
                        const cutoffKey = Object.keys(row).find(k => k.toUpperCase().includes(`${cat} CUTOFF`));
                        const cutoff = cutoffKey ? row[cutoffKey] : null;

                        if (cutoff && !isNaN(parseFloat(cutoff))) {
                            colleges.push({
                                name: collegeName.trim(),
                                code: code ? String(code).trim() : null,
                                branch: branch.trim(),
                                category: cat,
                                cutoff: parseFloat(cutoff),
                                tier: tier,
                                subTier: subTier,
                                district: district.trim(),
                                nirfRank: 999
                            });
                        }
                    });
                }
            });
        }

        if (colleges.length > 0) {
            console.log(`Prepared ${colleges.length} records to insert.`);
            await College.deleteMany({}); // Clear existing data to avoid duplicates on re-run
            console.log('Cleared existing data.');

            // Batch insert for performance
            await College.insertMany(colleges);
            console.log(`Successfully imported ${colleges.length} records.`);

            // Chain Placement and Scholarship Imports
            console.log('\n--- Running Supplemental Imports ---');
            try {
                const { importPlacementData } = require('./import_placement_data_logic');
                await importPlacementData();
                console.log('[OK] Placement data updated.');
            } catch (err) {
                console.error('[Error] Placement import failed:', err.message);
            }

            try {
                const { importScholarships } = require('./importScholarshipsLogic');
                await importScholarships();
                console.log('[OK] Scholarships updated.');
            } catch (err) {
                console.error('[Error] Scholarships import failed:', err.message);
            }
        } else {
            console.log('No valid data found to import.');
        }
    } catch (error) {
        console.error('Error in importData:', error);
        throw error;
    }
};

const run = async () => {
    try {
        console.log('Connecting to MongoDB at', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');
        await importData();
        console.log('Import finished successfully');
        process.exit(0);
    } catch (err) {
        console.error('Script Error:', err);
        process.exit(1);
    }
};

run();
