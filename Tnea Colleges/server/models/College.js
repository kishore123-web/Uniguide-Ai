const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    code: {
        type: String,
        index: true
    },
    branch: {
        type: String,
        required: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        index: true // e.g., OC, BC, MBC
    },
    cutoff: {
        type: Number,
        required: true,
        index: true
    },
    tier: {
        type: String, // e.g., "1", "2", "3"
        index: true
    },
    subTier: {
        type: String // e.g., "A", "B", "C", "D"
    },
    district: {
        type: String,
        index: true
    },
    nirfRank: {
        type: Number,
        default: 999 // Default low rank if not applicable
    },
    averagePackage: { type: String },
    highestPackage: { type: String },
    placementLink: { type: String },
    placementDescription: { type: String },

    // Accessibility & PwD Support
    wheelchairAccess: { type: Boolean, default: true },
    hostelAccess: { type: Boolean, default: true },
    transportSupport: { type: Boolean, default: false },
    medicalFacility: { type: Boolean, default: true },
    accessibilityScore: { type: Number, default: 75 } // 1-100 score
});

// Compound index for prediction queries
collegeSchema.index({ cutoff: 1, category: 1, tier: 1 });

module.exports = mongoose.model('College', collegeSchema);
