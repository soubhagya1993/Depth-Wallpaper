Inspiration from - https://storyshort.ai/?via=vo&gad_source=1&gad_campaignid=22638150441&gbraid=0AAAAAp9nL5OZGHXd0CGyFKgM3gURQ9311&gclid=Cj0KCQjwzOvEBhDVARIsADHfJJQ3wREzpUnGEc6EY7jSG-Ui3qw8_CqFvJdeIcrmRw8mqAIBXP6utGsaAochEALw_wcB

Spatial Image AI
This project is a full-stack web application that allows users to create immersive spatial images from standard photos using an AI model.

The frontend is built with Next.js and TypeScript, and styled with Tailwind CSS. The backend is a Python API built with the Flask framework.

Project Structure
    /spatial-image-ai
    |-- /frontend      # The Next.js application
    |   |-- app/
    |   |-- package.json
    |   |-- ...
    |-- /backend       # The Python Flask API
    |   |-- app.py
    |   |-- requirements.txt
    |   |-- ...

Prerequisites
Before you begin, ensure you have the following installed on your system:
Node.js (v18.x or later)

Python (v3.8 or later)

pip (Python package installer)

npm (Node Package Manager, comes with Node.js)

1. Backend Setup (Python API)
First, set up and run the Python backend server.

Navigate to the Backend Directory:

    cd path/to/your/project/backend

Create a Virtual Environment (Recommended):
A virtual environment keeps your project's Python dependencies isolated.

    # Create the environment
    python -m venv .venv

    # Activate it
    # On Windows:
    .\.venv\Scripts\activate
    # On macOS/Linux:
    source .venv/bin/activate

Create requirements.txt:
Create a file named requirements.txt in the /backend folder and add the following lines:

Flask
Flask-CORS

Install Dependencies:

pip install -r requirements.txt

Create app.py:
Create a file named app.py in the /backend folder and add the basic Flask server code. (You can get this code from the Spatial Image AI - Python Backend Guide document).

Run the Backend Server:

python app.py

The server will start, and you should see output indicating it's running on http://127.0.0.1:5000. Keep this terminal window open.

2. Frontend Setup (Next.js App)
Next, set up and run the Next.js frontend in a new terminal window.

Navigate to your main projects directory (the one that will contain the frontend folder).

cd path/to/your/project

Create the Next.js App:
Run the official Next.js setup command. This will create the /frontend folder and all necessary files.

npx create-next-app@latest

When prompted:

What is your project named? -> frontend

Would you like to use TypeScript? -> Yes

Would you like to use ESLint? -> Yes

Would you like to use Tailwind CSS? -> Yes

... (you can accept the defaults for the rest)

Navigate into the Frontend Directory:

cd frontend

Install lucide-react for Icons:
The UI uses icons from the lucide-react library. Install it with:

npm install lucide-react

Add the UI Code:
Open the file at frontend/app/page.tsx and replace its entire contents with the React code from the Spatial Image AI - Next.js Frontend (TypeScript) document.

Run the Frontend Development Server:

npm run dev

The frontend application will start, and you can view it in your browser at http://localhost:3000.

Running the Full Application
To run the application, you need two terminals open simultaneously:

Terminal 1: Runs the backend server from the /backend directory (python app.py).

Terminal 2: Runs the frontend server from the /frontend directory (npm run dev).

You can then access the website at http://localhost:3000.