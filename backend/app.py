from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS)
# This allows your Next.js frontend (running on a different port)
# to make requests to this backend.
CORS(app)

@app.route('/')
def home():
    """
    A simple route to check if the server is running.
    """
    return "Python backend is running!"

@app.route('/api/create-spatial-image', methods=['POST'])
def create_spatial_image():
    """
    This is the main API endpoint. The frontend will send an image here.
    """
    # Check if a file was sent in the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    # Check if the user selected a file
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        # --- AI PROCESSING LOGIC GOES HERE ---
        # 1. Save the uploaded file temporarily.
        # 2. Load the image using a library like Pillow.
        # 3. Pass the image to your AI model for processing.
        # 4. The model returns the new spatial image.
        # 5. Return the result back to the frontend.
        
        # For now, we'll just return a success message.
        print(f"Received file: {file.filename}")
        
        return jsonify({
            "message": "Image received successfully!",
            "filename": file.filename,
            "processed_image_url": "/path/to/your/generated/image.jpg" # This would be the URL to the result
        }), 200

# This allows the script to be run directly
if __name__ == '__main__':
    # Runs the app on http://127.0.0.1:5000
    # The `debug=True` flag enables auto-reloading when you save changes.
    app.run(debug=True, port=5000)