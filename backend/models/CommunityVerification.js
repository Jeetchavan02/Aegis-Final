const mongoose = require('mongoose');

const CommunityVerificationSchema = new mongoose.Schema({
    linkedAnalysisId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnalysisResult',
        required: true
    },
    authorId: {
        type: String, // Pseudonymous ID
        required: true
    },
    citizenEvidence: {
        type: String,
        required: true
    },
    evidenceLinks: [{
        type: String
    }],
    trustScore: {
        type: Number,
        default: 0
    },
    verificationStatus: {
        type: String,
        enum: ['Debunked', 'Verified', 'Inconclusive'],
        default: 'Inconclusive'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CommunityVerification', CommunityVerificationSchema);
