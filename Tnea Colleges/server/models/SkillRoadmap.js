const mongoose = require('mongoose');

const skillRoadmapSchema = new mongoose.Schema({
    careerDomain: {
        type: String,
        required: true,
        index: true
    },
    year: {
        type: Number,
        required: true // 1, 2, 3, 4
    },
    recommendedSkills: [String],
    certifications: [String],
    projectTypes: [String]
});

module.exports = mongoose.model('SkillRoadmap', skillRoadmapSchema);
