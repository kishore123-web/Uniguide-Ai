const express = require('express');
const router = express.Router();
const CareerMapping = require('../models/CareerMapping');
const SkillRoadmap = require('../models/SkillRoadmap');

// Get all career domains
router.get('/domains', async (req, res) => {
    try {
        const domains = await CareerMapping.find({}, 'careerDomain');
        res.json(domains.map(d => d.careerDomain));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Prediction Results
router.post('/predict', async (req, res) => {
    const { careerDomain, physics, chemistry, maths } = req.body;

    try {
        // 1. Fetch Career Mapping
        const mapping = await CareerMapping.findOne({ careerDomain });
        if (!mapping) {
            return res.status(404).json({ message: "Career domain not found" });
        }

        // 2. Fetch Skill Roadmap
        const roadmap = await SkillRoadmap.find({ careerDomain }).sort({ year: 1 });

        // 3. Simple Mock Logic for "Feasibility" based on marks
        // This is a placeholder for more complex logic requested
        const cutoff = (parseFloat(physics) + parseFloat(chemistry) + parseFloat(maths)) / 2; // Engineering Cutoff calculation might differ but simple average here? No, usually (M) + (P+C)/2 for TNEA.
        // TNEA Cutoff = Maths + (Physics + Chemistry) / 2
        const tneaCutoff = parseFloat(maths) + (parseFloat(physics) + parseFloat(chemistry)) / 2;

        let admissionProbability = "Low";
        if (tneaCutoff > 190) admissionProbability = "High";
        else if (tneaCutoff > 170) admissionProbability = "Medium";

        // Construct Response
        const response = {
            dreamPath: {
                branch: mapping.primaryBranch,
                admissionProbability: admissionProbability,
                riskLevel: tneaCutoff < 160 ? "High" : "Low", // simple rule
                cutoff: tneaCutoff
            },
            alternateBranches: mapping.alternateBranches,
            roadmap: roadmap,
            academicUpgrades: [
                "Minor in Computer Science",
                "Honors Degree in Major",
                "NPTEL Certification in Data Science"
            ] // Static for now as requested schema didn't fully specifying this table
        };

        res.json(response);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
