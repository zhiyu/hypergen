from langchain_community.utilities import SearxSearchWrapper

# 使用API代理服务提高访问稳定性
s = SearxSearchWrapper(searx_host="http://172.17.138.4:8080")
result = s.results("java", num_results=10)
print(result)
