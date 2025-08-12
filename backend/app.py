import os
import torch
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
from torchvision.transforms import Compose, Resize, ToTensor
import cv2 # OpenCV is used by the MiDaS transforms

# Initialize the Flask app
app = Flask(__name__)

# --- Configuration ---
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
BASE_URL = "http://127.0.0.1:5000"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER

CORS(app)

# --- AI Model Loading ---
try:
    model_type = "MiDaS_small"
    midas = torch.hub.load("intel-isl/MiDaS", model_type)
    device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
    midas.to(device)
    midas.eval()
    
    midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms")
    transform = midas_transforms.small_transform if model_type == "MiDaS_small" else midas_transforms.dpt_transform

    print(f"MiDaS model loaded successfully on {device}.")
except Exception as e:
    print(f"Error loading MiDaS model: {e}")
    midas = None

# --- API Routes ---
@app.route('/')
def home():
    return "Python backend is running!"

@app.route('/api/create-spatial-image', methods=['POST'])
def create_spatial_image():
    if not midas:
        return jsonify({"error": "AI model is not available."}), 500
        
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = secure_filename(file.filename)
        original_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(original_path)

        try:
            # 1. Load image and convert to NumPy array
            img_pil = Image.open(original_path).convert("RGB")
            img_np = np.array(img_pil) # <<< FIX: Convert PIL Image to NumPy array

            # 2. Transform the input for the model
            # The transform function expects a NumPy array, not a PIL Image
            input_batch = transform(img_np).to(device)

            # 3. Make a prediction with the AI model
            with torch.no_grad():
                prediction = midas(input_batch)
                prediction = torch.nn.functional.interpolate(
                    prediction.unsqueeze(1),
                    size=img_pil.size[::-1], # Use the original PIL image size
                    mode="bicubic",
                    align_corners=False,
                ).squeeze()

            # 4. Process the output into a visual depth map
            depth_map = prediction.cpu().numpy()
            output_display = (depth_map - depth_map.min()) / (depth_map.max() - depth_map.min())
            output_display = (output_display * 255).astype(np.uint8)
            output_image = Image.fromarray(output_display)

            # 5. Save the new processed image (the depth map)
            processed_filename = f"depth_{filename}"
            processed_path = os.path.join(app.config['PROCESSED_FOLDER'], processed_filename)
            output_image.save(processed_path)

            processed_image_url = f"{BASE_URL}/processed/{processed_filename}"

            return jsonify({
                "message": "Depth map generated successfully!",
                "original_filename": filename,
                "processed_image_url": processed_image_url
            }), 200

        except Exception as e:
            # Log the full error to the console for easier debugging
            print(f"Error processing image: {e}")
            return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

@app.route('/processed/<filename>')
def get_processed_image(filename):
    return send_from_directory(app.config['PROCESSED_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
