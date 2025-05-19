const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process'); // Changed from exec to spawn
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});


// Define the path to known faces directory
const knownFacesPath = path.join(__dirname, 'uploads');

router.post("/verify-face", upload.single("image"), async (req, res) => {
    try {
      console.log("Request received at /verify-face");
      
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const imagePath = req.file.path;
      console.log("Processing image:", imagePath);
      
      // Use the Python script in the same directory
      const pythonScriptPath = path.join(__dirname, 'face.py');
      
      const pythonProcess = spawn("python", [
        pythonScriptPath,
        imagePath,
        knownFacesPath
      ]);

      let result = "";
      let errorOutput = "";
      
      pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
        console.error(`Python error: ${data}`);
      });

      pythonProcess.on("close", (code) => {
        console.log("Python process exited with code:", code);
        console.log("Python result:", result);
        console.log("Python errors:", errorOutput);
        
        // Clean up the uploaded file
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });

        if (code !== 0) {
          return res.status(500).json({ 
            error: "Face verification failed",
            details: errorOutput || "Unknown Python error"
          });
        }

        try {
          const parsedResult = JSON.parse(result);
          
          if (parsedResult.error) {
            return res.status(400).json({ 
              error: parsedResult.error,
              details: parsedResult.message || ""
            });
          }
          
          res.json({ 
            message: parsedResult.message || (parsedResult.verified ? "Verified" : "Not Verified"),
            similarity: parsedResult.similarity || 0,
            verified: parsedResult.verified || false
          });
        } catch (parseError) {
          console.error("Error parsing Python output:", parseError);
          res.status(500).json({ 
            error: "Invalid response from face verification",
            details: result
          });
        }
      });
    } catch (err) {
      console.error("Error in /verify-face:", err);
      res.status(500).json({ 
        error: "Internal Server Error",
        details: err.message 
      });
    }
});

module.exports = router;