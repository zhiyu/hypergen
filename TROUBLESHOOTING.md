# WriteHERE Troubleshooting Guide

This document provides solutions for common issues you might encounter when running the WriteHERE application.

## Common Errors

### "Network Error" When Generating Content

This error typically indicates that the frontend cannot connect to the backend server. Here's how to fix it:

1. **Make sure the backend server is running**:
   - Open a terminal and run:
   ```bash
   cd backend
   python server.py
   ```
   - You should see a message indicating the server is running on port 5001

2. **Check for CORS issues**:
   - Make sure you're accessing the frontend from the same domain as specified in the backend CORS settings
   - By default, the backend allows requests from http://localhost:3000

3. **Test the API directly**:
   - Run the API test script to check if the backend is properly responding:
   ```bash
   cd backend
   python test_api.py
   ```
   - This should show a success message if the API is working correctly

4. **Check for port conflicts**:
   - Make sure port 5001 is not being used by another application
   - You can check with: `lsof -i:5001` (on Mac/Linux) or `netstat -ano | findstr 5001` (on Windows)

### "Cannot connect to backend server" Error Message

This error appears in the frontend when the backend server is not running or not accessible. Follow these steps:

1. **Start the backend server manually**:
   ```bash
   cd backend
   python server.py
   ```

2. **Check firewall settings**:
   - Ensure your firewall allows connections to port 5001

3. **Try a different port**:
   - If port 5001 is blocked or used by another application, you can modify the backend/server.py file to use a different port

### API Keys Not Working

If you've entered API keys but still get errors:

1. **Check key formatting**:
   - OpenAI keys typically start with "sk-"
   - Claude keys typically start with "sk-ant-"
   - Make sure there are no extra spaces before or after the keys

2. **Verify key validity**:
   - Try the keys directly with their respective services to confirm they are valid

3. **Check API key environment**:
   - Look at the generated API key file in your task directory:
   ```bash
   cd backend/results
   ls -la
   ```
   - Find your task ID folder and check the api_key.env file

### Python Dependency Issues

If you encounter Python dependency errors:

1. **Use the dedicated setup script**:
   ```bash
   ./setup_env.sh
   ```
   This will create a clean virtual environment with the correct dependencies.

2. **Anaconda conflicts**:
   If you see errors like `ImportError: cannot import name 'url_quote' from 'werkzeug.urls'`, this is usually due to Anaconda environment conflicts. To fix:
   ```bash
   # Use the setup script to create a clean environment
   ./setup_env.sh
   
   # Then activate it before running the server
   source venv/bin/activate
   cd backend
   python server.py
   ```

3. **Manual dependency installation**:
   ```bash
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install flask==2.0.1 werkzeug==2.0.3 flask-cors==3.0.10
   pip install -r backend/requirements.txt
   pip install -v -e .
   ```

4. **Check Python version**:
   - Make sure you're using Python 3.6+ with `python --version`

### Frontend Not Loading

If the frontend doesn't load properly:

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Check for JavaScript errors**:
   - Open your browser's developer console to look for any errors

## Running Standalone Components

### Running Backend Only

If you want to run just the backend server:

```bash
cd backend
python server.py
```

### Running Frontend Only

If you want to run just the frontend:

```bash
cd frontend
npm start
```

## Advanced Troubleshooting

### Backend API Testing

You can test the backend API endpoints directly using curl:

```bash
# Test API connection
curl http://localhost:5001/api/ping

# Test story generation (this will fail without valid API keys)
curl -X POST http://localhost:5001/api/generate-story \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test story","model":"gpt-4o","apiKeys":{"openai":"your_key_here"}}'
```

### Debugging the Backend

To see more detailed errors in the backend server:

1. **Enable debug logging**:
   - Find the line `app.run(debug=True, port=5001)` in backend/server.py
   - Make sure `debug=True` is set

2. **Check server logs**:
   - Look for any error messages in the terminal where the backend server is running

### Clearing Cached Results

If you need to start fresh:

```bash
rm -rf backend/results/*
```

## Getting More Help

If you continue to experience issues, please:

1. Check the [GitHub issues](https://github.com/yimengchencs/heterogeneous-recursive-planning/issues) for similar problems
2. Create a new issue with:
   - A detailed description of the problem
   - Steps to reproduce the issue
   - Error messages (if any)
   - Your environment (OS, Python version, Node.js version)