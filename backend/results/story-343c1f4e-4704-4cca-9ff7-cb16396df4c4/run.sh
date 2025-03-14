#!/bin/bash
cd /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/recursive
source /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/story-343c1f4e-4704-4cca-9ff7-cb16396df4c4/api_key.env
python engine.py --filename /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/story-343c1f4e-4704-4cca-9ff7-cb16396df4c4/input.jsonl --output-filename /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/story-343c1f4e-4704-4cca-9ff7-cb16396df4c4/result.jsonl --done-flag-file /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/story-343c1f4e-4704-4cca-9ff7-cb16396df4c4/done.txt --model claude-3-5-sonnet-20241022 --mode story
