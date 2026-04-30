const mongoose = require('mongoose');

const AnalysisResultSchema = new mongoose.Schema({
    text: {
        type: String,
        default: ""
    },
    mediaUrl: {
        type: String,
        default: null
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video'],
        required: true
    },
    prediction: {
        type: String,
        enum: ['FAKE', 'REAL'],
        required: true
    },
    confidence: {
        type: Number, // Percentage 0-100 from underlying model
        required: true
    },
    credibilityScore: {
        type: Number, // Additional aggregated metric, e.g., 0-100 indicating trustworthiness
        required: true
    },
    requiresCitizenReview: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AnalysisResult', AnalysisResultSchema);
