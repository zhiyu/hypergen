## HyperGen

HyperGen 是一个基于 [WriteHERE](https://github.com/principia-ai/WriteHERE) 开发的长文本生成应用，对 WriteHERE 原有功能和交互设计进行了优化和调整，同时增加了多语言、多租户、多场景等产品功能的支持。

<p align="center">
  <a href="https://arxiv.org/abs/2503.08275"><img src="https://img.shields.io/badge/arXiv-2503.08275-b31b1b.svg" alt="arXiv"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

### 路线图

- 多语言支持 ( in progress )
- 多租户支持 ( in progress )
- 多场景支持 ( in progress )
- OpenAI-compatible API 支持 ( in progress )
- searxng 支持 ( 已完成 )
- WriteHERE 代码优化 ( in progress )

### 应用截屏

##### 首页

![screenshots](./assets/1.png)

##### 报告生成页面

![screenshots](./assets/2.png)

##### 生成结果页面

![screenshots](./assets/3.png)

### 快速开始

#### 一键启动

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

#### Anaconda/Miniconda 用户

If you're using Anaconda and encounter dependency conflicts, use:

```bash
./run_with_anaconda.sh
```

This script creates a dedicated Anaconda environment called 'writehere' with the correct dependencies and runs both servers.

You can customize ports with this script:

```bash
./run_with_anaconda.sh --backend-port 8080 --frontend-port 8000
```

#### 手动安装

If you prefer to set up the components manually:

##### 后端服务

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

##### 前端服务

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

### 项目结构

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
