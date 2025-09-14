import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import path from 'path';

async function preprocessImage(filePath) {
    // Convert to grayscale and increase contrast for better OCR
    const processedPath = filePath.replace(/(\.[\w]+)$/, '_processed$1');
    await sharp(filePath)
        .grayscale()
        .normalize()
        .toFile(processedPath);
    return processedPath;
}

async function extractTextFromImage(filePath) {
    const processedPath = await preprocessImage(filePath);
    const { data: { text } } = await Tesseract.recognize(processedPath, 'eng');
    return text;
}

export { extractTextFromImage };
