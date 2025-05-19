import face_recognition
import cv2
import numpy as np
import sys
import json
import os

def load_known_encodings(folder_path):
    """Load all known face encodings from a folder"""
    known_encodings = []
    known_names = []

    if not os.path.exists(folder_path):
        return known_encodings, known_names

    for filename in os.listdir(folder_path):
        filepath = os.path.join(folder_path, filename)

        # Skip if not an image
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue

        try:
            image = face_recognition.load_image_file(filepath)
            if image.ndim == 2:
                image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
            elif image.shape[2] == 4:
                image = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)

            encodings = face_recognition.face_encodings(image)
            if encodings:
                known_encodings.append(encodings[0])
                known_names.append(filename.split('.')[0])  # Remove extension
        except Exception as e:
            print(f"Error processing {filename}: {str(e)}")
            continue

    return known_encodings, known_names

def verify_face_against_known(image_path, known_folder):
    """Compare uploaded face against all known faces"""
    try:
        if not os.path.exists(image_path):
            return {"error": "Input image not found", "verified": False}

        # Load uploaded image
        image = face_recognition.load_image_file(image_path)
        if image.ndim == 2:
            image = np.stack((image,)*3, axis=-1)
        elif image.shape[2] == 4:
            image = image[..., :3]

        face_locations = face_recognition.face_locations(image)
        if not face_locations:
            return {"verified": False, "similarity": 0.0, "message": "No face detected"}

        uploaded_encoding = face_recognition.face_encodings(image, face_locations)[0]

        # Load all known encodings
        known_encodings, known_names = load_known_encodings(known_folder)
        if not known_encodings:
            return {"error": "No known faces found", "verified": False}

        # Compare and find the best match
        distances = face_recognition.face_distance(known_encodings, uploaded_encoding)
        best_match_index = np.argmin(distances)
        best_similarity = (1 - distances[best_match_index]) * 100
        best_match_name = known_names[best_match_index]
        verified = best_similarity >= 60.0

        return {
            "verified": bool(verified),
            "similarity": float(best_similarity),
            "matched_image": best_match_name,
            "message": "Verified" if verified else "Not verified"
        }

    except Exception as e:
        return {"error": str(e), "verified": False}

if __name__ == '__main__':
    if len(sys.argv) != 3:
        result = {"error": "Usage: python face.py <input_image> <known_faces_folder>", "verified": False}
    else:
        input_image = sys.argv[1]
        known_folder = sys.argv[2]
        result = verify_face_against_known(input_image, known_folder)

    # Ensure all values are JSON-serializable
    if isinstance(result, dict):
        result = {k: (bool(v) if isinstance(v, np.bool_) else 
                  float(v) if isinstance(v, np.float32) else v) 
                 for k, v in result.items()}

    print(json.dumps(result))