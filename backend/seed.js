require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const AnalysisResult = require('./models/AnalysisResult');
const CommunityVerification = require('./models/CommunityVerification');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/misinfo-db';

const seedData = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data (Optional, but good for clean demo)
        await User.deleteMany({});
        await AnalysisResult.deleteMany({});
        await CommunityVerification.deleteMany({});

        console.log('Cleared existing data.');

        // 1. Create Users
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const citizenPassword = await bcrypt.hash('citizen123', salt);

        const admin = await User.create({
            username: 'Forensic_Admin',
            email: 'jeet.dev@crce.edu',
            password: adminPassword
        });

        const citizen = await User.create({
            username: 'Citizen_Yash',
            email: 'citizen.yash@example.com',
            password: citizenPassword
        });

        console.log('Users created.');

        // 2. Create Analysis Results
        const res1 = await AnalysisResult.create({
            text: "URGENT: Water supply in the city has been poisoned by extremists.",
            type: 'text',
            prediction: 'FAKE',
            confidence: 92,
            credibilityScore: 12,
            requiresCitizenReview: true
        });

        const res2 = await AnalysisResult.create({
            text: "The Moon is Earth's only natural satellite.",
            type: 'text',
            prediction: 'REAL',
            confidence: 99,
            credibilityScore: 98,
            requiresCitizenReview: false
        });

        const res3 = await AnalysisResult.create({
            text: "Confirmed reports suggest a ceasefire was signed this morning in the conflict zone.",
            type: 'text',
            prediction: 'FAKE',
            confidence: 65,
            credibilityScore: 42,
            requiresCitizenReview: true
        });

        console.log('Analysis results created.');

        // 3. Create Community Notes
        await CommunityVerification.create({
            linkedAnalysisId: res1._id,
            authorId: 'citizen_8f4a2b1c',
            citizenEvidence: "I am a local official. The city water department just confirmed on X (Twitter) that this is a hoax to create panic.",
            evidenceLinks: ["https://official-city-news.gov/water-safety-update"],
            trustScore: 156,
            verificationStatus: 'Verified'
        });

        await CommunityVerification.create({
            linkedAnalysisId: res3._id,
            authorId: 'citizen_a1b2c3d4',
            citizenEvidence: "Checking the major news outlets (AP/Reuters), there is no mention of a ceasefire yet. Seems like a premature rumor.",
            evidenceLinks: ["https://reuters.com/live-conflict-updates"],
            trustScore: 42,
            verificationStatus: 'Verified'
        });

        console.log('Community notes created.');
        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
