const natural = require('natural');
const classifier = new natural.BayesClassifier();

// Train a simple mock naive bayes model with some dummy data for text classification
classifier.addDocument('This is completely factual and verified by experts.', 'REAL');
classifier.addDocument('Official sources confirm this event took place.', 'REAL');
classifier.addDocument('The local authorities have issued a statement detailing the incident.', 'REAL');
classifier.addDocument('According to the verified news report, the situation is under control.', 'REAL');
classifier.addDocument('India has been attacked by pakistan today.', 'FAKE');
classifier.addDocument('Secret war declared between nations without official notice!', 'FAKE');
classifier.addDocument('Breaking: Unverified claim of military strike in the region.', 'FAKE');
classifier.addDocument('Shocking exposed secret! See the truth they are hiding!', 'FAKE');
classifier.addDocument('The Prime Minister has resigned suddenly!', 'FAKE');
classifier.addDocument('Unverified reports about the personal life of political leaders.', 'FAKE');
classifier.addDocument('India has been attacked by pakistan today.', 'FAKE');
classifier.addDocument('Hitler is alive in a bunker in South America.', 'FAKE');
classifier.addDocument('Has Germany won WW2? Secret files leaked.', 'FAKE');
classifier.addDocument('You won\'t believe what happened! 100% real no scam.', 'FAKE');
classifier.addDocument('The president is actually a lizard person from Mars!', 'FAKE');
classifier.addDocument('inflammatory political statement with no source.', 'FAKE');
classifier.train();

/**
 * Evaluates the input text using the trained Naive Bayes classifier.
 * @param {string} text 
 * @returns {object} { label: 'FAKE' | 'REAL', confidence: number }
 */
function analyzeTextLocal(text) {
    if (!text || text.trim() === '' || text.trim().length <= 5) {
        // e.g. "hello", "hi", "test" is too short to be factual news
        return { label: 'UNKNOWN', confidence: 50 };
    }

    const label = classifier.classify(text);
    
    // get class probabilities to calculate confidence
    const classifications = classifier.getClassifications(text);
    let confidence = 0;
    
    const targetClass = classifications.find(c => c.label === label);
    if (targetClass) {
        // Mock confidence calculation, normally depends on probability difference
        // Here `value` is an internal score, we map it roughly to a percentage
        // Since dataset is tiny, we just fake a high-ish confidence.
        // In a real scenario, this would use proper math on probabilities.
        confidence = Math.min(100, Math.max(50, targetClass.value * 1000 + 50)); 
    }
    
    // For realism in the demo, just generate a random high confidence if we got a match
    confidence = Math.floor(Math.random() * (99 - 65 + 1) + 65);

    return {
        label,
        confidence
    };
}

module.exports = {
    analyzeTextLocal
};
