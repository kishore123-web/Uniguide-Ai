const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    schemeName: { type: String, required: true },
    category: { type: String }, // Category / Authority
    eligibility: { type: String }, // Eligibility Criteria
    incomeLimit: { type: String },
    applicableTo: { type: String },
    benefits: { type: String }, // Benefits Provided
    amount: { type: String }, // Amount / Fee Waiver
    applicationMode: { type: String },
    remarks: { type: String }
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
