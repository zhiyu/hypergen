<h1 align="center">HyperGen</span></h1>

HyperGen is an open-source framework that revolutionizes long-form writing through human-like adaptive planning, developed based on [WriteHERE](https://github.com/principia-ai/WriteHERE)

<p align="center">
  <a href="https://arxiv.org/abs/2503.08275"><img src="https://img.shields.io/badge/arXiv-2503.08275-b31b1b.svg" alt="arXiv"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

### Road Map

- multi language support ( in progress )
- multi-tenant support ( in progress )
- multi-scenario support ( in progress )
- OpenAI-compatible API support ( in progress )
- searxng support ( finished )
- code（writehere） optimization ( in progress )

### Screenshots

##### Landing Page

![screenshots](/screenshots/1.png)

##### Generating Page

![screenshots](/screenshots/2.png)

##### Result Page

![screenshots](/screenshots/3.png)

### Quickstart

#### One-step setup and launch:

```bash
./setup_env.sh  # One-time setup of the environment
./start.sh      # Start the application
```

This will:

- Create a clean Python virtual environment
- Install all required dependencies
- Start the backend server on port 5001
- Start the frontend on port 3000
- Open your browser at http://localhost:3000

You can customize the ports using command-line arguments:

```bash
./start.sh --backend-port 8080 --frontend-port 8000
```

#### For Anaconda/Miniconda Users

If you're using Anaconda and encounter dependency conflicts, use:

```bash
./run_with_anaconda.sh
```

This script creates a dedicated Anaconda environment called 'writehere' with the correct dependencies and runs both servers.

You can customize ports with this script:

```bash
./run_with_anaconda.sh --backend-port 8080 --frontend-port 8000
```

#### Manual Installation

If you prefer to set up the components manually:

##### Backend Setup

1. Create a Python virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

2. Install main dependencies:

```bash
pip install -v -e .
```

3. Install backend server dependencies:

```bash
pip install -r backend/requirements.txt
```

4. Start the backend server:

```bash
cd backend
python server.py
```

To use a custom port:

```bash
python server.py --port 8080
```

##### Frontend Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Start the frontend development server:

```bash
npm start
```

To use a custom port:

```bash
PORT=8000 npm start
```

### Project Structure

```
.
├── backend/               # Backend Flask server
├── frontend/              # React frontend
├── recursive/             # Core engine implementation
│   ├── agent/             # Agent implementation and prompts
│   ├── executor/          # Task execution modules
│   ├── llm/               # Language model integrations
│   ├── utils/             # Utility functions and helpers
│   ├── cache.py           # Caching for improved efficiency
│   ├── engine.py          # Core planning and execution engine
│   ├── graph.py           # Task graph representation
│   ├── memory.py          # Memory management
│   ├── test_run_report.sh # Script for generating reports
│   └── test_run_story.sh  # Script for generating stories
├── test_data/             # Example data for testing
└── start.sh               # All-in-one startup script
```

### License

[MIT License](LICENSE)
