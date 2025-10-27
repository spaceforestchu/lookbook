// Utility to convert base64 images to file URLs
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Converts a base64 string to a file and returns the URL
 * @param {string} base64String - The base64 encoded image (with or without data:image prefix)
 * @param {string} directory - Directory name (e.g., 'profiles' or 'projects')
 * @param {string} prefix - Optional filename prefix
 * @returns {string} - The file URL (e.g., '/uploads/profiles/abc123.jpg')
 */
function base64ToFile(base64String, directory, prefix = '') {
  if (!base64String || !base64String.includes('base64,')) {
    // Not a base64 string, return as-is
    return base64String;
  }

  try {
    // Extract the base64 data and mime type
    const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return base64String;
    }

    const extension = matches[1]; // jpg, png, etc.
    const data = matches[2];
    
    // Generate unique filename
    const hash = crypto.createHash('md5').update(data).digest('hex').substring(0, 12);
    const filename = `${prefix}${hash}.${extension}`;
    const filepath = path.join(__dirname, '..', 'public', 'uploads', directory, filename);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(filepath, buffer);
    
    // Return URL path
    return `/uploads/${directory}/${filename}`;
  } catch (error) {
    console.error('Error converting base64 to file:', error);
    return base64String; // Return original on error
  }
}

/**
 * Checks if a string is a base64 encoded image
 * @param {string} str - String to check
 * @returns {boolean}
 */
function isBase64Image(str) {
  if (!str || typeof str !== 'string') return false;
  return str.startsWith('data:image/') && str.includes('base64,');
}

/**
 * Deletes an image file from the uploads directory
 * @param {string} imageUrl - The image URL (e.g., '/uploads/profiles/abc123.jpg')
 * @returns {boolean} - Success status
 */
function deleteImageFile(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
    return false;
  }

  try {
    const filepath = path.join(__dirname, '..', 'public', imageUrl);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
  } catch (error) {
    console.error('Error deleting image file:', error);
  }
  
  return false;
}

module.exports = {
  base64ToFile,
  isBase64Image,
  deleteImageFile
};

