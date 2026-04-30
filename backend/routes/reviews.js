// routes/reviews.js
// GET /api/reviews?query=some+text
// Returns community verification notes for analyses whose text matches the query (fuzzy/regex)

const express = require('express');
const router = express.Router();
const AnalysisResult = require('../models/AnalysisResult');
const CommunityVerification = require('../models/CommunityVerification');

// Helper to escape regex special characters
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/', async (req, res) => {
  try {
    const queryText = req.query.query;
    if (!queryText) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    // Build a case‑insensitive regex that matches the query (ignoring extra whitespace)
    const escaped = escapeRegex(queryText.trim());
    const regex = new RegExp(escaped, 'i');

    // Find analyses whose text contains the query (simple fuzzy match)
    const matchingAnalyses = await AnalysisResult.find({ text: { $regex: regex } }).select('_id');
    const analysisIds = matchingAnalyses.map(a => a._id);

    // Fetch all community notes linked to any of these analyses
    const notes = await CommunityVerification.find({ linkedAnalysisId: { $in: analysisIds } })
      .sort({ trustScore: -1, createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
