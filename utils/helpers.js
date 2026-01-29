const fs = require('fs');
const path = require('path');

function deleteFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\+\-\(\)]+$/;
    return re.test(phone);
}

function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
}

module.exports = {
    deleteFile,
    validateEmail,
    validatePhone,
    sanitizeFilename
};
