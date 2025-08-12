import os
import torch
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image, ImageFilter
from transformers import DPTImageProcessor, DPTForDepthEstimation

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
    model_name = "LiheYoung/depth-anything-small-hf"
    processor = DPTImageProcessor.from_pretrained(model_name)
    model = DPTForDepthEstimation.from_pretrained(model_name)
    
    device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
    model.to(device)
    
    print(f"Depth Anything model loaded successfully on {device}.")

except Exception as e:
    print(f"Error loading Depth Anything model: {e}")
    model = None

# --- API Routes ---
@app.route('/')
def home():
    return "Python backend is running!"

@app.route('/api/create-spatial-image', methods=['POST'])
def create_spatial_image():
    if not model:
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
            # 1. Load the image
            image = Image.open(original_path).convert("RGB")

            # 2. Prepare image for the model
            inputs = processor(images=image, return_tensors="pt").to(device)

            # 3. Predict depth
            with torch.no_grad():
                outputs = model(**inputs)
                predicted_depth = outputs.predicted_depth

            # 4. Resize depth map to match original image
            prediction = torch.nn.functional.interpolate(
                predicted_depth.unsqueeze(1),
                size=image.size[::-1],
                mode="bicubic",
                align_corners=False,
            )
            
            # 5. Normalize
            output = prediction.squeeze().cpu().numpy()
            output_min = output.min()
            output_max = output.max()
            formatted = ((output - output_min) / (output_max - output_min + 1e-6) * 255).astype("uint8")

            # 6. Invert for better visualization
            inverted_depth_map = 255 - formatted
            depth_image = Image.fromarray(inverted_depth_map)

            # --- SAVE DEPTH MAP for reference ---
            depth_filename = f"depthmap_{filename}"
            depth_path = os.path.join(app.config['PROCESSED_FOLDER'], depth_filename)
            depth_image.save(depth_path)

            # 7. Create subject mask (thresholding depth)
            threshold_value = np.percentile(inverted_depth_map, 70)  # adjust percentage
            foreground_mask = (inverted_depth_map > threshold_value).astype(np.uint8) * 255
            foreground_mask_img = Image.fromarray(foreground_mask)

            # 8. Extract subject
            subject = Image.composite(image, Image.new("RGB", image.size, (0, 0, 0)), foreground_mask_img)

            # 9. Blur background
            background = image.filter(ImageFilter.GaussianBlur(radius=10))

            # 10. Combine subject + background
            final_image = Image.composite(subject, background, foreground_mask_img)

            # 11. Save final depth effect image
            final_filename = f"depth_effect_{filename}"
            final_path = os.path.join(app.config['PROCESSED_FOLDER'], final_filename)
            final_image.save(final_path)

            return jsonify({
                "message": "Depth effect image generated successfully!",
                "original_filename": filename,
                "depth_map_url": f"{BASE_URL}/processed/{depth_filename}",
                "depth_effect_url": f"{BASE_URL}/processed/{final_filename}"
            }), 200

        except Exception as e:
            print(f"Error processing image: {e}")
            return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

@app.route('/processed/<filename>')
def get_processed_image(filename):
    return send_from_directory(app.config['PROCESSED_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
