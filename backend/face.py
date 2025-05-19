import face_recognition
import cv2
import numpy as np
import sys
import json
import os

def load_known_encoding(known_image_path):
    """Load the known face encoding"""
    try:
        if not os.path.exists(known_image_path):
            return {"error": f"Known image not found: {known_image_path}"}

        image = face_recognition.load_image_file(known_image_path)
        if image.ndim == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        elif image.shape[2] == 4:
            image = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)
            
        encodings = face_recognition.face_encodings(image)
        if not encodings:
            return {"error": "No face found in known image"}
        return encodings[0]
    except Exception as e:
        return {"error": f"Error loading known image: {str(e)}"}

def verify_from_image(image_path, known_image_path):
    """Verify face from an image file"""
    try:
        if not os.path.exists(image_path):
            return {"error": f"Input image not found: {image_path}"}

        # Load input image
        image = face_recognition.load_image_file(image_path)
        if image.ndim == 2:
            image = np.stack((image,)*3, axis=-1)
        elif image.shape[2] == 4:
            image = image[..., :3]
        
        # Find faces
        face_locations = face_recognition.face_locations(image)
        if not face_locations:
            return {"verified": False, "similarity": 0.0, "message": "No face detected"}
        
        # Get encoding
        face_encoding = face_recognition.face_encodings(image, face_locations)[0]
        
        # Load known encoding (handle both dict and array returns)
        known_encoding_result = load_known_encoding(known_image_path)
        if isinstance(known_encoding_result, dict) and 'error' in known_encoding_result:
            return known_encoding_result
            
        # Compare with known face
        distance = face_recognition.face_distance([known_encoding_result], face_encoding)[0]
        similarity = (1 - distance) * 100
        
        verified = similarity >= 60.0
        return {
            "verified": bool(verified),  # Ensure boolean is converted to Python bool
            "similarity": float(similarity),
            "message": "Verified" if verified else "Not verified"
        }
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == '__main__':
    if len(sys.argv) != 3:
        result = {"error": "Usage: python face.py <input_image> <known_image>"}
    else:
        result = verify_from_image(sys.argv[1], sys.argv[2])
    
    # Ensure all values are JSON-serializable
    if isinstance(result, dict):
        result = {k: (bool(v) if isinstance(v, np.bool_) else v) for k, v in result.items()}
    
    print(json.dumps(result))