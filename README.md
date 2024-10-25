# Intelligent Tutoring System for Differentiation

## Overview
This project is an Intelligent Tutoring System designed to assist users in solving differentiation problems. The system is structured in levels of increasing difficulty and provides real-time, step-by-step feedback for incorrect steps, helping learners identify and correct mistakes.


## Project Structure
The project consists of two main directories:


- **frontend**: Contains the React application that serves as the user interface.
- **backend**: Contains the Python Flask application that manages the backend server.

## Features
- **Level-based Learning**: Users can progress through various levels, each focusing on different aspects of differentiation.
- **Real-time Feedback**: The system offers immediate feedback on user inputs to aid learning.
- **Dynamic Problem Generation**: Problems are generated based on user progression.

## Requirements

### Backend
To set up the backend, you will need the following Python packages:

- Flask
- Flask-CORS
- SymPy

### Frontend
The frontend is built using React and requires Node.js and npm for installation.

## Installation Instructions

### Cloning the Repository

1. **Clone the repository**:

    ```bash
    git clone https://github.com/vireshkoli/Intelligent-Tutoring-System-Differentiation.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd Intelligent-Tutoring-System-Differentiation
    ```

### Setting Up the Frontend

1. **Navigate to the frontend folder**:

    ```bash
    cd frontend
    ```

2. **Install the required Node.js packages**:

    ```bash
    npm install
    ```

3. **Build the React application for production**:

    ```bash
    npm run build
    ```

    This will create a `build` folder containing the production-ready files.

4. **Start the React application** (optional, for development purposes):

    ```bash
    npm start
    ```

    The application will run on `http://localhost:3000` by default.


### Setting Up the Backend

1. **Navigate to the backend folder**:

    ```bash
    cd backend
    ```

2. **Create a virtual environment** (optional but recommended):

    ```bash
    python -m venv venv
    ```

    Then activate the virtual environment:
   - On Windows:

        ```bash
        venv\Scripts\activate
        ```

   - On macOS/Linux:

        ```bash
        source venv/bin/activate
        ```

3. **Install the required Python packages**:

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the Flask server**:

    ```bash
    python app.py
    ```

   The server will start, and you can access it at `http://localhost:5000` by default.


