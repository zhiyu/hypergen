#!/bin/bash
cd /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/recursive
source /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/story-062750ba-69ef-4de9-8410-a38fa5f9b145/api_key.env
python engine.py --filename /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/story-062750ba-69ef-4de9-8410-a38fa5f9b145/input.jsonl --output-filename /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/story-062750ba-69ef-4de9-8410-a38fa5f9b145/result.jsonl --done-flag-file /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/story-062750ba-69ef-4de9-8410-a38fa5f9b145/done.txt --model gpt-4o --mode story
