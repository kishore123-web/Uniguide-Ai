const mongoose = require('mongoose');

const careerMappingSchema = new mongoose.Schema({
    careerDomain: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    primaryBranch: {
        type: String,
        required: true
    },
    alternateBranches: [{
        branchName: String,
        similarityScore: Number, // 0-100
        placementOverlapScore: Number // 0-100
    }]
});

module.exports = mongoose.model('CareerMapping', careerMappingSchema);
