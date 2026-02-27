const express = require('express');
const router = express.Router();
const College = require('../models/College');

// Helper to estimate fee based on Tier and Name
const estimateFee = (college, isGovtSchool, isFirstGraduate, income, community) => {
    let baseFee = 160000; // Default Private Tier 1/2 fee approximation

    // Adjust base fee by Tier
    if (college.tier === '1') baseFee = 200000;
    else if (college.tier === '2') baseFee = 140000;
    else if (college.tier === '3') baseFee = 100000;
    else baseFee = 85000;

    // Govt Colleges identification (simple heuristic)
    const isGovtCollege = college.name.toLowerCase().includes('university departments') ||
        college.name.toLowerCase().includes('government college') ||
        college.name.toLowerCase().includes('govt.');

    if (isGovtCollege) {
        baseFee = 35000; // Approx govt fee
    }

    // --- Scholarship Logic ---
    let scholarshipAmount = 0;
    let schemeApplied = [];

    // 1. 7.5% Govt School Quota (Full Waiver)
    // Note: Valid only if the quota actually applies to the seat, but here we assume if user is eligible they might get it
    if (isGovtSchool) {
        scholarshipAmount = baseFee;
        schemeApplied.push('7.5% Govt School Full Waiver');
        return { totalFee: baseFee, netFee: 0, waiver: baseFee, schemes: schemeApplied };
    }

    // 2. First Graduate (FG)
    if (isFirstGraduate) {
        const fgAmount = 25000;
        scholarshipAmount += fgAmount;
        schemeApplied.push('First Graduate Concession');
    }

    // 3. Post Matric Scholarship (Income based)
    // SC/SCA/ST < 2.5L, BC/MBC/DNC < 2L (Approx rules for simplified logic)
    const incomeVal = parseInt(income) || 9999999;
    if (['SC', 'SCA', 'ST'].includes(community) && incomeVal < 250000) {
        scholarshipAmount += (isGovtCollege ? 0 : 50000); // PMSS usually covers tuition in private
        schemeApplied.push('Post Matric Scholarship');
    } else if (['BC', 'BCM', 'MBC', 'DNC'].includes(community) && uncomeVal < 200000 && isFirstGraduate) {
        // Complex rules, simplying for 'AI estimation'
        scholarshipAmount += 0;
    }

    // Cap scholarship at base fee
    if (scholarshipAmount > baseFee) scholarshipAmount = baseFee;

    return {
        totalFee: baseFee,
        netFee: baseFee - scholarshipAmount,
        waiver: scholarshipAmount,
        schemes: schemeApplied
    };
};

const getProbablity = (userCutoff, collegeCutoff) => {
    const diff = userCutoff - collegeCutoff;
    if (diff >= 5) return { label: 'Safe', color: 'green', score: 95 };
    if (diff >= 0) return { label: 'Likely', color: 'teal', score: 80 };
    if (diff >= -2) return { label: 'Moderate', color: 'yellow', score: 50 }; // Borderline
    if (diff >= -5) return { label: 'Dream', color: 'orange', score: 30 }; // Hard
    return { label: 'Ambitious', color: 'red', score: 10 };
};

// POST /generate
router.post('/generate', async (req, res) => {
    try {
        const {
            cutoff,
            community,
            income,
            isGovtSchool,
            isFirstGraduate,
            preferredBranch, // 'All' or specific
            preferredDistrict // 'All' or specific
        } = req.body;

        const userCutoff = parseFloat(cutoff);

        // Filter Logic
        let query = {
            category: community,
            cutoff: { $gte: userCutoff - 25, $lte: userCutoff + 10 } // Broad range to catch Safe and Dream
        };

        if (preferredBranch && preferredBranch !== 'All Branches') {
            query.branch = preferredBranch;
        }
        if (preferredDistrict && preferredDistrict !== 'All Districts') {
            query.district = preferredDistrict;
        }

        let colleges = await College.find(query).limit(500); // Limit to avoid overload

        // Process Choice List
        const choiceList = colleges.map(col => {
            const prob = getProbablity(userCutoff, col.cutoff);
            const financials = estimateFee(col, isGovtSchool, isFirstGraduate, income, community);

            // ROI Metric (Mock logic based on Tier)
            let placementScore = 50;
            if (col.tier === '1') placementScore = 95;
            else if (col.tier === '2') placementScore = 80;
            else if (col.tier === '3') placementScore = 65;
            else if (col.tier === '4') placementScore = 50;
            else placementScore = 40;

            return {
                _id: col._id,
                name: col.name,
                code: col.code,
                branch: col.branch,
                cutoff: col.cutoff,
                tier: col.tier,
                subTier: col.subTier,
                district: col.district,
                probability: prob,
                financials: financials,
                placementScore: placementScore,
                reason: `Tier ${col.tier}${col.subTier || ''} Institute with ${prob.label} chance.`
            };
        });

        // AI Smart Sorting
        // 1. Sort by Probability Category (Safe -> Moderate -> Dream)? 
        // Actually for "Choice Filling", you usually want Dream TOP, then Moderate, then Safe.
        // Because if you put Safe on top, you get allotted that and lose chance at Dream.
        // So Order: Dream -> Moderate -> Safe.
        // BUT, within Dream, sort by Quality (Tier).

        choiceList.sort((a, b) => {
            // Sort by Tier first (Ascending: 1 is better than 2)
            if (a.tier !== b.tier) return a.tier.localeCompare(b.tier);
            // If Tier same, sort by Cutoff (Higher is better quality)
            return b.cutoff - a.cutoff;
        });

        res.json({
            count: choiceList.length,
            choices: choiceList
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating choices" });
    }
});

module.exports = router;
