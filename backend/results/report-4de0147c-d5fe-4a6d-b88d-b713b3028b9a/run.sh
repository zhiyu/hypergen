#!/bin/bash
cd /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/recursive
source /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/report-4de0147c-d5fe-4a6d-b88d-b713b3028b9a/api_key.env
python engine.py --filename /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/report-4de0147c-d5fe-4a6d-b88d-b713b3028b9a/input.jsonl --output-filename /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/report-4de0147c-d5fe-4a6d-b88d-b713b3028b9a/result.jsonl --done-flag-file /Users/cheny0x/Documents/Projects/heterogeneous-recursive-planning/backend/results/report-4de0147c-d5fe-4a6d-b88d-b713b3028b9a/done.txt --model claude-3-5-sonnet-20241022 --engine-backend bing --mode report
