const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const College = require('../models/College');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const importPlacementData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const filePath = path.join(__dirname, '../../Placement Report with descripition.xlsx');
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log(`Found ${data.length} records in Excel.`);

        // 1. Get all unique college names from DB
        const dbNames = await College.distinct('name');
        console.log(`Loaded ${dbNames.length} unique college names from DB.`);

        let updatedCount = 0;
        let notFoundCount = 0;

        // Helper to tokenize and normalize
        const tokenize = (str) => {
            return str.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '') // remove special chars
                .split(/\s+/)
                .filter(w => w.length > 2); // ignore short words
        };

        // Helper to calculate overlap score
        const getScore = (tokensA, tokensB) => {
            const setA = new Set(tokensA);
            const setB = new Set(tokensB);
            let intersection = 0;
            for (let t of setA) {
                if (setB.has(t)) intersection++;
            }
            return (intersection * 2) / (setA.size + setB.size);
        };

        for (const row of data) {
            const excelName = row['College Name'];
            if (!excelName) continue;

            const excelTokens = tokenize(excelName);

            // Find best match in DB Names
            let bestMatch = null;
            let bestScore = 0;

            for (const dbName of dbNames) {
                const dbTokens = tokenize(dbName);
                const score = getScore(excelTokens, dbTokens);

                // Boost score if specific acronyms match (e.g. CEG, MIT, SSN)
                // This is a heuristic.

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = dbName;
                }
            }

            // Threshold for acceptance
            if (bestScore > 0.4) { // 40% Token overlap
                // console.log(`Method matched: "${excelName}" -> "${bestMatch}" (Score: ${bestScore.toFixed(2)})`);

                // Update ALL documents with this DB Name
                await College.updateMany(
                    { name: bestMatch },
                    {
                        $set: {
                            averagePackage: row['Avg Package'],
                            highestPackage: row['Highest Package'],
                            placementLink: row['Placement Report / Official Link'],
                            placementDescription: row['Short Description']
                        }
                    }
                );
                updatedCount++;
            } else {
                console.log(`No match found for: "${excelName}" (Best: "${bestMatch}", Score: ${bestScore.toFixed(2)})`);
                notFoundCount++;
            }
        }

        console.log('------------------------------------------------');
        console.log(`Import Complete.`);
        console.log(`Updated: ${updatedCount}`);
        console.log(`Not Found: ${notFoundCount}`);

        process.exit();

    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

importPlacementData();
