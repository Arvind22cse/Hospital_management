const express = require('express');
const router = express.Router();
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/api/verify-face', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
    }

    // Get absolute path to Python script
    const pythonScriptPath = path.resolve(__dirname, 'face.py');
    const imagePath = path.resolve(req.file.path);

    // Execute Python script
    exec(`python "${pythonScriptPath}" "${imagePath}"`, (error, stdout, stderr) => {
        // Clean up uploaded file regardless of result
        fs.unlinkSync(imagePath);

        if (error) {
            console.error('Python script error:', error);
            return res.status(500).json({ error: 'Face verification failed' });
        }

        if (stderr) {
            console.error('Python script stderr:', stderr);
            return res.status(500).json({ error: 'Face verification failed' });
        }

        try {
            const result = JSON.parse(stdout);
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            res.json(result);
        } catch (e) {
            console.error('Error parsing Python output:', e);
            res.status(500).json({ error: 'Invalid response from face verification' });
        }
    });
});

module.exports = router;