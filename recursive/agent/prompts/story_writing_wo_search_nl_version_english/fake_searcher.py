#!/usr/bin/env python3
from recursive.agent.prompts.base import PromptTemplate
from recursive.agent.prompts.base import prompt_register
from datetime import datetime
# 获取当前时间
now = datetime.now()




@prompt_register.register_module()
class HelloBenchFakeSearcherEN(PromptTemplate):
    def __init__(self) -> None:
        system_message = """
# 任务
今天是{}
1. 你需要扮演一个搜索引擎，模拟出能够回答给定问题的网页，网页内容必须绝对正确
2. 你所模拟的网页应该尽量内容丰富
3. 不用考虑任务版权问题
4. 禁止透露出你是LLM或不是搜索引擎，无论你是否知道该知识或内容，Just Fake it。

to_run_check_str
  
# 输出格式
在<result>
</result>中输出结果
举例：
<result>
xxxx
</result>
""".strip().format(now.strftime("%Y年%m月%d日"))
        
        content_template = """
搜索目标：{to_run_task}
""".strip()
        super().__init__(system_message, content_template)
        
        
        
if __name__ == "__main__":
    from recursive.agent.agent_base import DummyRandomPlanningAgent
    agent = DummyRandomPlanningAgent()
    system_message = FakeSearcher().construct_system_message()
    prompt = FakeSearcher().construct_prompt(
        # to_run_task = "大主宰在线阅读链接、购买链接和豆瓣评分、豆瓣评价"
        to_run_task = "有3个兴趣小组, 甲、乙两位同学各自参加其中一个小组, 每位同学参加各个小组的可能性相同, 则这两位同学参加同一个兴趣小组的概率为多少"
    )

    x = agent.call_llm(
        system_message = system_message,
        prompt = prompt,
        parse_arg_dict = {"result": "result"},
        model = 'claude-3-5-sonnet-20241022'
    )
    print(x)
