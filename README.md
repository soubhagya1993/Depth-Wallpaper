Spatial-Image.ai
A web-based application that uses AI to convert standard images into immersive spatial wallpapers with a beautiful depth effect, inspired by the iOS spatial wallpaper feature.

🚀 Features
AI-Powered Image Segmentation: Automatically detects the main subject in an image and separates it from the background using Google's MediaPipe Image Segmenter.

Dynamic Parallax Effect: Creates a 3D depth illusion by making the foreground and background layers move at different speeds in response to mouse movement.

Customizable Effects: Users can adjust the intensity of the parallax effect and the amount of blur applied to the background for a personalized look.

Modern Dashboard UI: A clean, user-friendly interface with a sidebar for navigation, a main dashboard, and a dedicated creation space.

Creations Gallery: A page to view all the generated spatial images in a clean, grid-based layout.

🛠️ Technologies Used
Frontend: HTML5, Tailwind CSS

JavaScript: Modern ES6+ for interactivity and DOM manipulation.

AI/Machine Learning: Google MediaPipe Image Segmenter for in-browser machine learning.

Icons: Font Awesome for UI icons.

📁 File Structure
The project is organized into two main pages:

index.html: The main dashboard and the core of the application. This is where users can upload and process their images to create spatial wallpapers.

creations.html: A gallery page that displays dummy tiles representing the user's saved creations.

📖 How to Use
Open the Dashboard: Launch the index.html file in your web browser.

Wait for the AI Model: The "Upload Image" button will be disabled and show a "Loading AI..." status. This is a one-time process on the first visit while the AI model is downloaded and initialized.

Upload an Image: Once the button is active, click "Upload Image" to select a photo from your computer. For best results, use an image with a clear, well-defined subject.

Customize: Use the sliders in the control panel to adjust the parallax intensity and background blur to your liking.

Enjoy the Effect: Move your mouse over the preview window to see the spatial depth effect in action.

View Creations: Navigate to the creations.html page to see a gallery of your generated images.

🔮 Future Improvements
Save & Store Creations: Implement functionality to save the generated images locally or to a user account.

More Customization: Add more advanced options like different blur types, color adjustments, or foreground effects.

User Accounts: Introduce user authentication to store creations and settings in the cloud.