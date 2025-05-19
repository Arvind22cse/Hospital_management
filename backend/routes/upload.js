const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const router = express.Router();
const ImageModel = require('../model/image.model.js'); // ✅ import the model

const uploadDir = path.join(__dirname, '../uploads');

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Upload endpoint with MongoDB saving
router.post('/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imagePath = `/uploads/${req.file.filename}`;

  try {
    // ✅ Save to MongoDB
    const newImage = new ImageModel({ imagePath });
    await newImage.save();

    return res.status(200).json({
      message: 'Image uploaded and saved successfully',
      filename: req.file.filename,
      filePath: imagePath,
      mongoId: newImage._id,
    });
  } catch (error) {
    console.error('Error saving to DB:', error);
    return res.status(500).json({ error: 'Failed to save image to database' });
  }
});

module.exports = router;
