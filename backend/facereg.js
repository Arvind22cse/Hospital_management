const express = require('express');
const router = express.Router();
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

router.post('/verify-face', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
    }

    try {
        // Get paths - using __dirname for reliability
        const pythonScriptPath = path.join(__dirname, 'face.py');
        const imagePath = path.resolve(req.file.path);
        const knownImagePath = path.join(__dirname, 'uploads', 'WIN_20250516_18_36_11_Pro.jpg');

        // Verify files exist
        if (!fs.existsSync(pythonScriptPath)) {
            throw new Error(`Python script not found at ${pythonScriptPath}`);
        }
        if (!fs.existsSync(knownImagePath)) {
            throw new Error(`Known face image not found at ${knownImagePath}`);
        }

        // Execute Python script with proper error handling
        const command = `python "${pythonScriptPath}" "${imagePath}" "${knownImagePath}"`;
        exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            // Clean up uploaded file
            fs.unlinkSync(imagePath);

            if (error) {
                console.error('Execution error:', error);
                return res.status(500).json({ 
                    error: 'Face verification failed',
                    details: error.message
                });
            }

            if (stderr) {
                console.error('Python error:', stderr);
                return res.status(500).json({ 
                    error: 'Face verification error',
                    details: stderr
                });
            }

            try {
                const result = JSON.parse(stdout);
                if (result.error) {
                    return res.status(400).json(result);
                }
                return res.json(result);
            } catch (parseError) {
                console.error('Parse error:', parseError);
                return res.status(500).json({ 
                    error: 'Invalid response format',
                    details: stdout
                });
            }
        });
    } catch (err) {
        console.error('Setup error:', err);
        return res.status(500).json({ 
            error: 'Server configuration error',
            details: err.message
        });
    }
});

module.exports = router;