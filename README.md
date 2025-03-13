# Heterogeneous Recursive Planning

## Overview

Heterogeneous Recursive Planning is a general agent framework for long-form writing that achieves human-like adaptive writing through recursive task decomposition and dynamic integration of three fundamental task types: retrieval, reasoning, and composition.

Unlike traditional approaches that rely on predetermined workflows and rigid thinking patterns, this framework:

1. **Eliminates workflow restrictions** through a planning mechanism that interleaves recursive task decomposition and execution
2. **Facilitates heterogeneous task decomposition** by integrating different task types
3. **Adapts dynamically** during the writing process, similar to human writing behavior

Our evaluations on both fiction writing and technical report generation demonstrate that this method consistently outperforms state-of-the-art approaches across all evaluation metrics.

## Features

- Recursive task decomposition and execution
- Dynamic integration of retrieval, reasoning, and composition tasks
- Flexible adaptation during the writing process
- Support for both creative fiction and technical report generation

## Configuration

Configure settings in:
- `recursive/engine.py/story_writing` - Story generation settings
- `recursive/engine.py/report_writing` - Report generation settings

## API Keys

1. Create a file named `api_key.env` in the `recursive/` directory (see `api_key.env.example`)
2. Add the following API keys:
```
OPENAI=your_openai_api_key
CLAUDE=your_claude_api_key
SERPAPI=your_serpapi_api_key
```

## Installation

```bash
pip install -v -e .
```

## Usage

### Generate a Technical Report
```bash
cd recursive
bash test_run_report.sh
```

### Generate a Creative Story
```bash
cd recursive
bash test_run_story.sh
```

## Project Structure

```
recursive/
├── agent/              # Agent implementation and prompts
├── executor/           # Task execution modules
├── llm/                # Language model integrations
├── utils/              # Utility functions and helpers
├── cache.py            # Caching for improved efficiency
├── engine.py           # Core planning and execution engine
├── graph.py            # Task graph representation
├── memory.py           # Memory management
├── test_run_report.sh  # Script for generating reports
└── test_run_story.sh   # Script for generating stories
```

## Requirements

- Python 3.6+
- Dependencies listed in setup.cfg including:
  - Language model APIs (OpenAI, Claude)
  - Search capabilities (SerpAPI)
  - Various utility libraries

## Citation

If you use this code in your research, please cite our paper:

```bibtex
@misc{xiong2025beyondoutlining,
      title={Beyond Outlining: Heterogeneous Recursive Planning for Adaptive Long-form Writing with Language Models}, 
      author={Ruibin Xiong$^{*}$ and Yimeng Chen$^{*}$ and Dmitrii Khizbullin and Jürgen Schmidhuber},
      year={2025},
      eprint={2503.08275},
      archivePrefix={arXiv},
      primaryClass={cs.AI},
      url={https://arxiv.org/abs/2503.08275}
}
```