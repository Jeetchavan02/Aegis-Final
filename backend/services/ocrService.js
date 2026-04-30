const tesseract = require('tesseract.js');

/**
 * Extracts text from an image file using Tesseract.js.
 * @param {string} imagePath - The path to the uploaded image file.
 * @returns {Promise<string>} - Extracted text.
 */
async function extractTextFromImage(imagePath) {
    try {
        const result = await tesseract.recognize(
            imagePath,
            'eng',
            { logger: m => console.log(m) }
        );
        return result.data.text;
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to extract text from image");
    }
}

module.exports = {
    extractTextFromImage
};
