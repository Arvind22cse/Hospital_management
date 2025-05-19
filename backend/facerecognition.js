const express = require('express');
const router = express.Router();
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs').promises; // Using promises API
const path = require('path');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/temp/', // Store temp files separately
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Helper function to get all image files from a directory
async function getImageFiles(dir) {
  try {
    const files = await fs.readdir(dir);
    const imageFiles = [];
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) continue;
      
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        imageFiles.push(filePath);
      }
    }
    
    return imageFiles;
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
}

router.post('/verify-face', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    const pythonScriptPath = path.join(__dirname, 'face.py');
    const imagePath = path.resolve(req.file.path);
    const uploadsDir = path.join(__dirname, 'uploads');

    // Verify python script exists
    try {
      await fs.access(pythonScriptPath);
    } catch {
      throw new Error(`Python script not found at ${pythonScriptPath}`);
    }

    // Get all image files from uploads directory
    const imageFiles = await getImageFiles(uploadsDir);
    if (imageFiles.length === 0) {
      throw new Error('No reference images found in uploads directory');
    }

    console.log(`Found ${imageFiles.length} images to compare against`);

    // Process each image file
    const results = [];
    for (const knownImagePath of imageFiles) {
      try {
        const result = await new Promise((resolve) => {
          const command = `python "${pythonScriptPath}" "${imagePath}" "${knownImagePath}"`;
          exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error processing ${path.basename(knownImagePath)}:`, error);
              resolve({ 
                file: path.basename(knownImagePath),
                error: error.message 
              });
              return;
            }

            try {
              const data = JSON.parse(stdout);
              resolve({ 
                file: path.basename(knownImagePath),
                ...data 
              });
            } catch (parseError) {
              console.error(`Parse error for ${path.basename(knownImagePath)}:`, parseError);
              resolve({ 
                file: path.basename(knownImagePath),
                error: 'Invalid response format',
                rawOutput: stdout
              });
            }
          });
        });

        results.push(result);

        // Early exit if we found a match
        if (result.match) {
          break;
        }
      } catch (err) {
        console.error(`Error processing ${path.basename(knownImagePath)}:`, err);
        results.push({
          file: path.basename(knownImagePath),
          error: err.message
        });
      }
    }

    // Clean up uploaded file
    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.error('Error cleaning up temp file:', err);
    }

    // Check results
    const match = results.find(r => r.match);
    if (match) {
      return res.json(match);
    }

    return res.status(404).json({
      error: 'No matching face found',
      details: results
    });

  } catch (err) {
    console.error('Verification error:', err);
    // Clean up uploaded file if it exists
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }
    }
    return res.status(500).json({
      error: 'Face verification failed',
      details: err.message
    });
  }
});

module.exports = router;