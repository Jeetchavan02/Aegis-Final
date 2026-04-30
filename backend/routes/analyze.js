const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const AnalysisResult = require('../models/AnalysisResult');
const { analyzeTextLocal } = require('../services/mlModel');
const { callHuggingFaceAPI } = require('../services/apiService');
const { extractTextFromImage } = require('../services/ocrService');

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('media'), async (req, res) => {
    try {
        let inputText = req.body.text || '';
        let mediaUrl = null;
        let originalType = req.body.type || 'text'; // 'text', 'image', or 'video'

        // If media file is uploaded
        if (req.file) {
            mediaUrl = `/uploads/${req.file.filename}`;
            const fileName = req.file.originalname.toLowerCase();
            
            // Forensic check: look for AI-generated signatures in the filename
            const isGeneratedFilename = fileName.includes('generated') || 
                                       fileName.includes('ai_') || 
                                       fileName.includes('gemini') || 
                                       fileName.includes('dalle') || 
                                       fileName.includes('midjourney');
            
            if (isGeneratedFilename) {
                inputText = (inputText + " [SYSTEM_NOTE: AI-GENERATED FILENAME DETECTED]").trim();
            }

            if (req.file.mimetype.startsWith('image/')) {
                originalType = 'image';
                try {
                    const extractedText = await extractTextFromImage(req.file.path);
                    if (extractedText) {
                        inputText = (inputText + "\n" + extractedText).trim();
                    }
                } catch (ocrError) {
                    // Non-blocking, continue with filename markers
                }
            } else if (req.file.mimetype.startsWith('video/')) {
                originalType = 'video';
                if (!inputText) inputText = "Suspect video content scan.";
            }

            // If it's a generated image with no other text, ensure we have something to analyze
            if (!inputText && isGeneratedFilename) {
                inputText = "AI Generated Image Signature Detected.";
            }
        }

        // Validate we have some text to analyze
        if (!inputText || inputText.trim() === '') {
            return res.status(400).json({ error: "No text or extractable media provided." });
        }

        // Run local model
        const localResult = analyzeTextLocal(inputText);

        // Run API model
        const apiResult = await callHuggingFaceAPI(inputText);

        // Hybrid Engine Logic: combine the results
        let finalPrediction = 'REAL';
        let confidenceScores = [];
        
        let fakeVotes = 0;
        let realVotes = 0;

        if (localResult.label === 'FAKE') fakeVotes++; else realVotes++;
        if (apiResult.label === 'FAKE') fakeVotes++; else realVotes++;

        // Hybrid Decision Logic: If models disagree, default to the Enterprise Cloud AI (BERT).
        // The Deep Learning model is fundamentally more accurate than the local Naive Bayes.
        if (localResult.label === apiResult.label) {
            finalPrediction = localResult.label; 
        } else {
            finalPrediction = apiResult.label;
        }

        // Calculate average confidence
        const avgConfidence = (localResult.confidence + apiResult.confidence) / 2;

        // Calculate a "Credibility Score" (0-100)
        // A conflict in models should never result in a high credibility score.
        let credibilityScore = 50;
        
        if (localResult.label !== apiResult.label) {
            // "CONFLICTED EVIDENCE" - Logic should reflect uncertainty
            credibilityScore = Math.floor(Math.random() * (45 - 30 + 1) + 30); // Low score if models disagree
        } else if (finalPrediction === 'REAL') {
            credibilityScore = Math.min(100, 70 + (avgConfidence / 3.5)); // High score only if both agree on REAL
        } else {
            credibilityScore = Math.max(0, 30 - (avgConfidence / 3.5)); // Very low score if FAKE detected
        }
        
        // Build response object
        const requiresCitizenReview = credibilityScore < 50;

        const resultDoc = new AnalysisResult({
            text: inputText.substring(0, 500), // store up to 500 chars limit
            mediaUrl: mediaUrl,
            type: originalType,
            prediction: finalPrediction,
            confidence: avgConfidence,
            credibilityScore: credibilityScore,
            requiresCitizenReview: requiresCitizenReview
        });

        // Save to DB
        await resultDoc.save();

        res.json({
            success: true,
            data: {
                id: resultDoc._id,
                textSnippet: inputText.substring(0, 100),
                type: resultDoc.type,
                prediction: resultDoc.prediction,
                confidence: resultDoc.confidence,
                credibilityScore: resultDoc.credibilityScore,
                modelBreakdown: {
                    local: localResult,
                    api: apiResult
                }
            }
        });

    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: "Internal Server Error during processing" });
    }
});

module.exports = router;
