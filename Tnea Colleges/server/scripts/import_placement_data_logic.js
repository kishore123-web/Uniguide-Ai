const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const College = require('../models/College');

const importPlacementData = async () => {
    const filePath = path.join(__dirname, '../../Placement Report with descripition.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${data.length} records in Placement Excel.`);

    // 1. Get all unique college names from DB
    const dbNames = await College.distinct('name');

    let updatedCount = 0;

    // Helper to tokenize and normalize
    const tokenize = (str) => {
        return str.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 2);
    };

    // Helper to calculate overlap score
    const getScore = (tokensA, tokensB) => {
        const setA = new Set(tokensA);
        const setB = new Set(tokensB);
        let intersection = 0;
        for (let t of setA) {
            if (setB.has(t)) intersection++;
        }
        if (setA.size + setB.size === 0) return 0;
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

            if (score > bestScore) {
                bestScore = score;
                bestMatch = dbName;
            }
        }

        // Threshold for acceptance
        if (bestScore > 0.4) {
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
        }
    }

    console.log(`Placement Import Complete. Updated: ${updatedCount}`);
};

module.exports = { importPlacementData };
