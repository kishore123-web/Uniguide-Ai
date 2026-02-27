const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');

// GET all scholarships
router.get('/', async (req, res) => {
    try {
        const scholarships = await Scholarship.find();
        res.json(scholarships);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
