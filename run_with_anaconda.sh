#!/bin/bash

echo "Starting WriteHERE with Anaconda environment..."

# Create a separate environment for the backend
conda_create_env() {
    echo "Creating Anaconda environment 'writehere'..."
    conda create -n writehere python=3.8 -y
    
    echo "Installing dependencies in 'writehere' environment..."
    conda activate writehere
    pip install flask==2.0.1 werkzeug==2.0.3 flask-cors==3.0.10 requests==2.28.2
    pip install -v -e .
}

# Check if conda command is available
if ! command -v conda &> /dev/null; then
    echo "Error: conda not found. This script requires Anaconda or Miniconda."
    exit 1
fi

# Check if writehere environment exists, if not create it
conda env list | grep -q writehere
if [ $? -ne 0 ]; then
    conda_create_env
else
    echo "Using existing 'writehere' environment"
    conda activate writehere
fi

# Create empty API key file if needed
api_key_env_file="recursive/api_key.env"
if [ ! -f "$api_key_env_file" ]; then
    echo "Creating empty API key file..."
    touch "$api_key_env_file"
fi

# Start backend server
echo "Starting backend server..."
cd backend
python server.py &
backend_pid=$!
cd ..

# Wait a bit for backend to start
echo "Waiting for backend to initialize..."
sleep 3

# Start frontend
echo "Starting frontend server..."
cd frontend
npm start &
frontend_pid=$!
cd ..

echo "WriteHERE is now running!"
echo "  - Backend server: http://localhost:5001 (running in 'writehere' Anaconda environment)"
echo "  - Frontend app:   http://localhost:3000"
echo "  - Press Ctrl+C to stop both servers"

# Handle graceful shutdown
trap 'echo "Shutting down..."; kill $backend_pid $frontend_pid 2>/dev/null; echo "WriteHERE stopped."; exit 0' INT TERM

# Wait for user to stop the servers
wait