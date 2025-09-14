import fs from 'fs';
import path from 'path';

function isImage(file) {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
}

function isPDF(file) {
    return path.extname(file).toLowerCase() === '.pdf';
}

function deleteFile(filePath) {
    fs.unlink(filePath, err => {
        if (err) console.error('Failed to delete file:', filePath, err);
    });
}

export { isImage, isPDF, deleteFile };