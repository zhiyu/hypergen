#!/usr/bin/env python3

import json
# from typing import Any, Dict, List, Mapping, Optional, Sequence, Union
import requests
# import torch
# from langchain.llms.base import LLM
from requests.adapters import HTTPAdapter
from urllib3.util import Retry
# from retrying import retry
# from transformers import AutoTokenizer, AutoModelForCausalLM
import random
# import anthropic
# import time
import copy
import boto3
from botocore.config import Config
import time
from loguru import logger
from recursive.memory import caches

PROXY = ""
AWS_AK = ""
AWS_SK = ""
# USE_OFFICIAL = "anthropic"
USE_OFFICIAL = None
# USE_OFFICIAL = "CUSTOMIZE"


class OpenAIApiException(Exception):
    def __init__(self, msg, error_code):
        self.msg = msg
        self.error_code = error_code

def format_tool_response_to_claude(tool_response):
    content_claude = []
    for msg_info in tool_response['choices']:
        msg_info = msg_info['message']
        if 'tool_calls' not in msg_info:
            msg_new = {"type": "text", "text": msg_info["content"]}
        else:
            tool_msg = msg_info["tool_calls"][0]
            msg_new = {
                "type": "tool_use", 
                "id": tool_msg["id"], 
                "name": tool_msg["function"]["name"], 
                "input": json.loads(tool_msg["function"]["arguments"])
            }
        content_claude.append(msg_new)
    
    stop_reason = tool_response['choices'][0]['finish_reason']
    if stop_reason == 'tool_calls': stop_reason = 'tool_use'
    response_new = {
        "id": tool_response['id'],
        "type": "message",
        "role": "assistant",
        "model": tool_response['model'],
        "content": content_claude,
        "stop_reason": stop_reason,
        "stop_sequence": None,
        "usage": tool_response['usage']
    }
    return response_new



class OpenAIApiProxy():
    def __init__(self, verbose=True):
        retry_strategy = Retry(
            total=5,  # 最大重试次数（包括首次请求）
            backoff_factor=1,  # 重试之间的等待时间因子
            status_forcelist=[429, 500, 502, 503, 504],  # 需要重试的状态码列表
            allowed_methods=["POST"]  # 只对POST请求进行重试
        )
        adapter = HTTPAdapter()
        # 创建会话并添加重试逻辑
        self.session = requests.Session()
        self.session.mount("https://", adapter)
        self.session.mount("http://", adapter)
        self.MAX_RETRIES = 100
        self.BACKOFF_FACTOR = 0.1
        self.RETRY_CODES = (400, 401, 429, 404, 500, 502, 503, 504, 529)
        self.verbose = verbose
        # self.verbose = False
    
    def call_embedding(self, model, text):
        url = "http://oneapi-svip.bc-inner.com"
        api_key = ''
        headers = {}
        headers['Content-Type'] = headers['Content-Type'] if 'Content-Type' in headers else 'application/json'
        headers['Authorization'] = "Bearer " + api_key
        url = url + '/v1/embeddings'
        params_gpt = {
            "model": model,
            "input": text,
            "encoding_format": "float",
        }

        for attempt in range(self.MAX_RETRIES):
            current_headers = headers.copy()
            # current_headers['x-api-key'] = random.choice(claude_keys)
            try:
                response = self.session.post(
                    url, 
                    headers=current_headers, 
                    json=params_gpt, 
                    timeout=300, 
                    proxies=None
                )
                if response.status_code not in self.RETRY_CODES:
                    response.raise_for_status()
                    break  # Successful response, exit the loop
                else:
                    # print(f"Received status code {response.status_code} at attempt={attempt + 1}. Retrying... {current_headers['x-api-key']=}")
                    print(f"Received status code {response.status_code} at attempt={attempt + 1}. Retrying..., the reponse is {response.text}", flush=True)
                    
                    
            except requests.exceptions.RequestException as e:
                print(f"Error making request (attempt {attempt + 1}): {e}", flush=True)
                if attempt == self.MAX_RETRIES - 1:  # Last attempt
                    raise  # Re-raise the last exception if all attempts fail
            
            # Implement exponential backoff
            if attempt < self.MAX_RETRIES - 1:  # No need to sleep after the last attempt
                sleep_time = self.BACKOFF_FACTOR
                print(f"Waiting for {sleep_time} seconds before next attempt...", flush=True)
                time.sleep(sleep_time)
        
        data = response.json()
        # logger.info("Response: {}".format(json.dumps(data, ensure_ascii=False, indent=4)))
        # print(json.dumps(data, ensure_ascii=False, indent=4))
        return data
        
        
        

    # @utils.Cache.decorator('data/cache/OpenAIApiProxy_call.jsonl')
    def call(self, model, messages, no_cache = False, overwrite_cache=False, tools=None, temperature=None, headers={}, use_official=None, **kwargs):
        assert tools is None
        use_official = USE_OFFICIAL
        assert use_official in {None, 'anthropic', 'aws'}
        messages = copy.deepcopy(messages)

        is_gpt = True if "gpt" or "o1" in model else False
    
        params_gpt = {
            "model": model,
            "messages": messages,
            "max_tokens": 8192,
        }
        
        if "claude" in model:
            use_official = "anthropic"
        
        if self.verbose:
            logger.info("Messages: {}".format(json.dumps(messages, ensure_ascii=False, indent=4)))
        
        if temperature is not None:
            params_gpt["temperature"] = temperature
            # logger.info("temperature: {}".format(params_gpt["temperature"]))
        if tools:
            params_gpt['tools'] = tools

        if 'o1' in model:
            url = ''
            api_key = ""
            params_gpt["max_tokens"] = 32768
        elif "gpt" in model:
            url = "https://api.openai.com/v1/chat/completions"
            api_key = ''
        elif "claude" in model:
            use_official = 'anthropic'
            url = 'https://api.anthropic.com/v1/messages'
            api_key = ''
        elif "deepseek" in model:
            url = ''
            api_key = ''
        else: # gemini
            url = ''
            api_key = ''

        if "o1" in model:
            if "temperature" in params_gpt:
                del params_gpt["temperature"]
        
        headers['Content-Type'] = headers['Content-Type'] if 'Content-Type' in headers else 'application/json'
        headers['Authorization'] = "Bearer " + api_key
        # url = url + ''
        proxies = None

        params_gpt.update(kwargs)
        
        
        # Cache
        
        if not no_cache:
            cache_name = "OpenAIApiProxy.call"
            from copy import deepcopy
            call_args_dict = deepcopy(params_gpt)
            llm_cache = caches["llm"]
            if not overwrite_cache:
                cache_result = llm_cache.get_cache(cache_name, call_args_dict)
                if cache_result is not None:
                    return cache_result
        
        
        if use_official == 'aws':
            proxies = {"http": PROXY, "https": PROXY}
            bedrock = boto3.client(
                service_name="bedrock-runtime",
                aws_access_key_id=AWS_AK,
                aws_secret_access_key=AWS_SK,
                region_name='us-west-2',
                config=Config(proxies=proxies)
            )
            if messages[0]['role'] == 'system':
                params_gpt['system'] = messages.pop(0)['content']
            del params_gpt['model']
            params_gpt["anthropic_version"] = "bedrock-2023-05-31"
            
            response = bedrock.invoke_model(body=json.dumps(params_gpt), modelId="anthropic.claude-3-5-sonnet-20240620-v1:0")
            # import pdb; pdb.set_trace()
            status_code = response['ResponseMetadata']['HTTPStatusCode']
            if status_code != 200:
                err_msg = "access asw error, status code: %s" % (status_code)
                print("AWS ACCESSING CLAUDE ERROR!!!")
                # import pdb; pdb.set_trace()
                raise OpenAIApiException(err_msg, status_code)
            data = json.loads(response.get("body").read())
            
            result = data if tools else data['content'][0]['text']
            llm_cache.save_cache(cache_name, call_args_dict, result)
            return result
        
        if use_official == 'anthropic':
            headers = {
                'content-type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': api_key
            }
            proxies = {"http": PROXY, "https": PROXY}
            if messages[0]['role'] == 'system':
                params_gpt['system'] = messages.pop(0)['content']

        for attempt in range(self.MAX_RETRIES):
            current_headers = headers.copy()
            try:
                response = self.session.post(
                    url, 
                    headers=current_headers, 
                    json=params_gpt, 
                    timeout=300, 
                    # proxies=proxies
                )
                if response.status_code not in self.RETRY_CODES:
                    response.raise_for_status()
                    break  # Successful response, exit the loop
                else:
                    if "maximum context length is" in str(response.text) or "maximum length" in str(response.text):
                        logger.error("Error Process {} with the maximum context length exceeds. Sys messages is {}".format(model, messages[0]))
                        # just return None
                        return None
    
                    print(f"Received status code {response.status_code} at attempt={attempt + 1}. Retrying..., the reponse is {response.text}", flush=True)  
                    
            except requests.exceptions.RequestException as e:
                print(f"Error making request (attempt {attempt + 1}): {e}", flush=True)
                if attempt == self.MAX_RETRIES - 1:  # Last attempt
                    raise  # Re-raise the last exception if all attempts fail
            
            # Implement exponential backoff
            if attempt < self.MAX_RETRIES - 1:  # No need to sleep after the last attempt
                sleep_time = self.BACKOFF_FACTOR
                print(f"Waiting for {sleep_time} seconds before next attempt...", flush=True)
                time.sleep(sleep_time)
        
        data = response.json()
        
        if self.verbose:
            logger.info("Response: {}".format(json.dumps(data, ensure_ascii=False, indent=4)))
    
        input_tokens_key = 'prompt_tokens' if is_gpt else 'input_tokens'
        output_tokens_key = 'completion_tokens' if is_gpt else 'output_tokens'
        output_reason_tokens = data.get('usage', {}).get('completion_tokens_details', {}).get('reasoning_tokens', 0)
        if self.verbose:
            logger.debug("{} Usage: {}".format(model, data.get('usage', {})))
        if input_tokens_key in data.get('usage', {}) and output_tokens_key in data.get('usage', {}):
            input_tokens = data.get('usage', {})[input_tokens_key]
            output_tokens = data.get('usage', {})[output_tokens_key]
            # price = (input_tokens / 1000000) * 2.5 + (output_tokens / 1000000) * 10.0
            if model == "gpt-4o":
                ip = 2.50
                op = 10.00
            elif model == "gpt-4o-mini":
                ip = 0.150
                op = 0.600 
            elif "claude" in model:
                ip = 3.0
                op = 15.0
            elif "r1" in model:
                ip = 0.55
                op = 2.19
            else:
                ip = 0.0
                op = 0.0
                
            price = (input_tokens / 1000000) * ip + (output_tokens / 1000000) * op
            
            # if self.verbose:
            logger.debug("{} input data {}, output_data {} LLM price: {}\n\n".format(model, input_tokens, output_tokens, price))
                # ))
        if tools:
            return format_tool_response_to_claude(data) if 'claude' in model and (not use_official) else data
        else:
            
            # from pprint import pprint
            # pprint(data)
            # exit()
            if use_official:
                result = data["content"][0]["text"]
                # make the format consistent
                data = [{"message": {"content": result}}]
                if not no_cache:
                    llm_cache.save_cache(cache_name, call_args_dict, data)
                return data
            if not no_cache:
                llm_cache.save_cache(cache_name, call_args_dict, data['choices'])
            return data['choices']


if __name__ == "__main__":
    proxy = OpenAIApiProxy()
    proxy.call_embedding("text-embedding-3-small",
                         "I am a student too")