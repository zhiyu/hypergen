
# Heterogeneous Recursive Planning

## Configuration

Configure settings in:
- `recursive/engine.py/story_writing` - Story generation settings
- `recursive/engine.py/report_writing` - Report generation settings

## API Keys

1. Create a file named `api_key.env` in the `recursive/` directory
2. Add the following API keys:
```
OPENAI=your_openai_api_key
CLAUDE=your_claude_api_key
SERPAPI=your_serpapi_api_key
```

## Installation & Usage

First, install the package:
```bash
pip install -v -e .
```

### Generate a Report
```bash
cd recursive
bash test_run_report.sh
```

### Generate a Story
```bash
cd recursive
bash test_run_story.sh
```