#!/usr/bin/env python3
from recursive.agent.prompts.base import PromptTemplate
from recursive.agent.prompts.base import prompt_register
from datetime import datetime
# 获取当前时间
now = datetime.now()


@prompt_register.register_module()
class MergeSearchResultVFinal(PromptTemplate):
    def __init__(self) -> None:
        system_message = """
# Your Task
Today is 02.13.2025, you are a search result integration specialist. Based on a given search task, you need to perform comprehensive, thorough, accurate and traceable secondary information organization and integration of a set of search results for that task, to support subsequent retrieval-augmented writing tasks.

# Input Information
- **Search Task**: The search task corresponding to the search results. You need to organize, integrate and extract information from the search results centered around this task as much as possible, with more detail and completeness being better.
- **Search Results and Short Summaries**: A set of search results (web pages) collected for the search task, represented in XML format. I will provide you the original web pages (summary), and a series of simple integrations of the search results which you need to integrate secondarily. The original web pages are optional.
    - search_result: The summary and metainfo of the each web pages.
    - web_pages_short_summary: **Simple integration** of search web pages. This integration will appear multiple times, with each integration covering search results before this tag appears (which I have not provided to you). The **index=x** or **id=x** indicates the source webpage number.

# Requirements  
- No fabrication allowed - all information must come entirely from the provided search result summaries
- Must mark information sources using "webpage[webpage index]" for traceability, where index in web_pages_short_summary indicates webpage ID
- More detailed and complete is better - details matter, do not lose any detailed information from **web_pages_short_summary**
- Do not invent content just to meet the requirement for detail
- Attention, not all web results are relevant and useful, be careful and organize useful things.

# Output Format
1. First, provide brief thoughts within <think></think> tags
2. in <result></result> tags, output your secondary information organization and integration results, which must be as complete, refined and thorough as possible, with source tracing through webpage IDs
Do not append any other information after </result>
""".strip()


        content_template = """
The overall writing task from the user is: **{to_run_root_question}**. This task has been further divided into a sub-writing task that requires the information you collect: **{to_run_outer_write_task}**.  

Within the context of the overall writing request and the sub-writing task, you need to understand the requirements of your assigned search result integration sub-task, and only integrate for it: **{to_run_search_task}**, from the **Search Results and Short Summarys**.  

---
**Search Results and Short Summarys**:
```
{to_run_search_results}
```
--

Organize and integrate information from **Search Results and Short Summarys** as instructions in # Your Task, # Input Information and # Requirements. Output as # Output Format, first brief think in <think></think> then give the complete results in <result></result>. Do not forget to marking information sources using "webpage[webpage index]" for traceability, where index in web_pages_short_summary indicates webpage ID.
""".strip()
        super().__init__(system_message, content_template)

        

if __name__ == "__main__":
    from recursive.agent.agent_base import DummyRandomPlanningAgent
    agent = DummyRandomPlanningAgent()
    system_message = MergeSearchResultZH().construct_system_message()
    # prompt = MergeSearchResultZH().construct_prompt(
    #     to_run_target_write_tasks = "写作任务1，字数：100 words",
    #     to_run_search_task = "查找姚明的出生年份",
    #     to_run_search_results = "<web_page index=1>\n<title>\n姚明（亚洲篮球联合会主席、中国篮球协会主席）_百度百科\n</title>\n<url>\nhttps://baike.baidu.com/item/%E5%A7%9A%E6%98%8E/28\n</url>\n<page_time>\n未提供\n</page_time>\n<summary>\n姚明，1980年9月12日出生于上海市，祖籍江苏省苏州市。\n</summary>\n</web_page>\n\n\n\n<web_page index=2>\n<title>\nYao Ming - Wikipedia\n</title>\n<url>\nhttps://bcl.wikipedia.org/wiki/Yao_Ming\n</url>\n<page_time>\n2025-01-29 08:00:00\n</page_time>\n<summary>\n姚明于1980年9月12日出生。他是中国著名的职业篮球运动员，曾效力于NBA的休斯顿火箭队。\n</summary>\n</web_page>\n\n\n\n<web_page index=3>\n<title>\n姚明\n</title>\n<url>\nhttps://baike.sogou.com/v4957112.htm?fromTitle=%E5%A7%9A%E6%98%8E\n</url>\n<page_time>\n2024-11-04 08:00:00\n</page_time>\n<summary>\n姚明，1980年9月12日出生于上海市徐汇区，前中国男子篮球运动员，曾任中国篮协主席，现任亚洲篮球联合会主席。出生时体重5公斤，父母均为篮球运动员。\n</summary>\n</web_page>\n\n\n\n<web_page index=4>\n<title>\nYao Ming | Biography & Facts\n</title>\n<url>\nhttps://www.britannica.com/biography/Yao-Ming\n</url>\n<page_time>\n2024-12-23 08:00:00\n</page_time>\n<summary>\n姚明出生于1980年9月12日，地点是中国上海。他是一名中国篮球运动员，曾为NBA的休斯顿火箭队效力，成为国际篮球明星。\n</summary>\n</web_page>\n\n\n<web_pages_short_summary>\n根据多个权威来源的交叉验证，已经获得了明确且一致的信息：\n\n姚明的出生信息：\n- 出生日期：1980年9月12日（来源：index 1,2,3,4均一致确认）\n- 出生地点：上海市（index 1,3,4确认）\n- 具体行政区：上海市徐汇区（index 3补充）\n\n额外信息（虽然不是主要搜索目标）：\n- 出生体重：5公斤（index 3提供）\n- 家庭背景：父母均为篮球运动员（index 3提供）\n\n信息来源的可靠性分析：\n- 包含百度百科、搜狗百科、维基百科和大英百科等权威来源\n- 所有来源的信息高度一致\n- 信息更新时间较新（2024-2025年间）\n</web_pages_short_summary>",
    #     # to_run_task = "60岁高血压糖尿病患者能不能吃复方甲氧那明"
    # )
    # prompt = MergeSearchResultZH().construct_prompt(
    #     to_run_target_write_tasks = "写作任务1，字数：100 words",
    #     to_run_search_task = "根据姚明出生年份1980年，查找1980年NBA总决赛的对阵双方和亚军队主教练信息",
    #     to_run_search_results = "<search_result index=5>\n<title>\n1980年NBA总决赛\n</title>\n<url>\nhttps://baike.baidu.com/item/1980%E5%B9%B4NBA%E6%80%BB%E5%86%B3%E8%B5%9B/12787960\n</url>\n<page_time>\n1980-05-04 08:00:00\n</page_time>\n<summary>\n1980年NBA总决赛对阵双方为洛杉矶湖人队与费城76人队。费城76人队为亚军，其主教练为比利-康宁汉姆(Billy Cunningham)。比赛期间，湖人队在系列赛中以4-2战胜76人队，获得冠军。值得提到的是，湖人队中当家球星卡里姆-阿卜杜-贾巴尔在总决赛第五场曾因伤缺席，但在关键比赛中表现优秀。\n</summary>\n</search_result>\n\n\n\n<search_result index=6>\n<title>\n1980 NBA Finals\n</title>\n<url>\nhttps://basketball.fandom.com/wiki/1980_NBA_Finals\n</url>\n<page_time>\n2025-02-08 08:00:00\n</page_time>\n<summary>\n1980年NBA总决赛的对阵双方是洛杉矶湖人队（Los Angeles Lakers）和费城76人队（Philadelphia 76ers）。比赛结果是湖人队以4-2战胜76人队获得总冠军。76人队的主教练是比利·坎宁安（Billy Cunningham）。</content>\n</summary>\n</search_result>\n\n\n\n<search_result index=7>\n<title>\n1980年NBA总决赛 湖人vs76人 全部六场录像回放【优直播】\n</title>\n<url>\nhttps://www.yoozhibo.net/lanqiu/lijienbazongjuesai/video-40.html\n</url>\n<page_time>\n2020-06-15 08:00:00\n</page_time>\n<summary>\n1980年NBA总决赛的对阵双方是洛杉矶湖人队和费城76人队，湖人队以4:2战胜76人，夺得当年NBA总冠军奖杯。关于亚军的主教练信息，搜索结果中并未直接提供，因此暂无相关信息。但可以推测，费城76人的主教练在1980年的赛季中是唐·哈尔（Don Nelson），他在1977年至1985年期间担任主教练。\n</summary>\n</search_result>\n\n\n\n<search_result index=8>\n<title>\n1980 NBA Playoffs Summary\n</title>\n<url>\nhttps://www.basketball-reference.com/playoffs/NBA_1980.html\n</url>\n<page_time>\n2025-02-06 08:00:00\n</page_time>\n<summary>\n1980年NBA总决赛的对阵双方为：洛杉矶湖人（Los Angeles Lakers）对阵费城76人（Philadelphia 76ers）。最终，洛杉矶湖人以4-2战胜费城76人，获得冠军。费城76人的主教练是穆罕默德·阿卜杜勒-拉赫曼（Billy Cunningham）。\n</summary>\n</search_result>",
    #     # to_run_task = "60岁高血压糖尿病患者能不能吃复方甲氧那明"
    # )
    to_run_search_results = """
<web_page index=1>
<title>
梁文锋（DeepSeek创始人）_百度百科
</title>
<url>
https://baike.baidu.com/item/%E6%A2%81%E6%96%87%E9%94%8B/65336579
</url>
<page_time>
2025-01-20 08:00:00
</page_time>
<summary>
DeepSeek的创始人是梁文锋，1985年出生于广东省湛江市，毕业于浙江大学，拥有信息与电子工程学系的本科和硕士学位。他于2008年开始带领团队使用机器学习技术探索全自动量化交易。2015年，他成立了杭州幻方科技有限公司，并于2019年将其资金管理规模突破百亿元。

在技术发展方面：
- 2016年10月21日，幻方量化推出第一个AI模型，即由深度学习生成的交易仓位。
- 2017年，幻方量化实现了投资策略的全面AI化。
- 2019年，梁文锋带领团队研发了“萤火一号”训练平台，随后的“萤火二号”系统更是在性能和成本上有显著突破。

DeepSeek公司于2023年7月成立，专注于通用人工智能领域，以追求真正的人类级别的人工智能。2024年5月，DeepSeek发布了混合专家语言模型DeepSeek-V2，随后在同年12月推出了DeepSeek-V3，这款模型被业界称赞为“来自东方的神秘力量”。

总的来看，DeepSeek公司是从量化交易技术发展起来，逐步向人工智能领域拓展，创始人梁文锋在此过程中发挥了重要作用。
</summary>
</web_page>



<web_page index=2>
<title>
DeepSeek 团队深度分析报告
</title>
<url>
https://zhuanlan.zhihu.com/p/17123031866
</url>
<page_time>
2025-01-08 08:00:00
</page_time>
<summary>
- **公司全称**：杭州深度求索人工智能基础技术研究有限公司（DeepSeek）
- **成立时间**：2023年5月
- **总部地点**：浙江省杭州市
- **专注领域**：人工智能技术研发

### 创始人信息
- **创始人兼CEO**：梁文峰（Liang Wenfeng）
- **教育背景**：浙江大学人工智能专业
- **创业经历**：幻方（High-Flyer）量化对冲基金创始人
- **量化金融成就**：
- 幻方基金是中国四大量化对冲基金之一
- 基金估值达到80亿美元
- **行业背景**：在AI和金融领域具有深厚经验，对量化金融和AI技术创新有深入的理解

### 团队核心优势
- **快速迭代能力**：团队在短时间内多次发布开源大模型，不断突破性能。
- **创新架构设计**：实现了混合专家模型（MoE）和多头延迟注意力机制（MLA）的重要技术突破。
- **高效训练方法**：采用FP8混合精度与多令牌预测等先进方案，显著提升训练和推理效率。
</summary>
</web_page>



<web_page index=3>
<title>
“深度求索”创始人17岁考入浙大，团队成员大多来自国内顶尖院校_DeepSeek_梁文锋_中国公司
</title>
<url>
https://www.sohu.com/a/855187343_121124335
</url>
<page_time>
2025-02-02 08:00:00
</page_time>
<summary>
1. **公司基本信息**：
- 公司名称：杭州深度求索人工智能基础技术研究有限公司（DeepSeek）
- 成立时间：2023年7月

2. **创始团队背景**：
- 创始人：梁文锋
- 个人背景：出生在广东的五线城市，父亲为小学老师，17岁考入浙江大学，主修电子工程（人工智能方向）。
- 学历：本科及硕士均毕业于浙江大学，研究方向为目标跟踪算法。
- 职业经历：2015年与朋友共同创办杭州幻方科技有限公司，并于2016年推出第一个AI模型。2023年决定专注于通用人工智能，创办DeepSeek。

3. **团队构成**：
- 员工规模：约139人，主要是90后和95后年轻人。
- 教育背景：员工中85%以上拥有硕士学位，40%以上有博士学位，团队成员大多毕业于北大、清华等顶尖院校。

4. **技术突破**：
- 2024年12月26日，DeepSeek推出DeepSeek-V3模型，并同步开源。该模型以1/11的算力和仅2000个GPU芯片训练出超越GPT-4o的大模型，训练成本为557.6万美元，远低于GPT-4o的约1亿美元。

5. **市场表现与行业地位**：
- DeepSeek被称为“大模型界的拼多多”，因其创新的模型架构和性价比引发大厂之间的价格竞争。被国际媒体称作“来自东方的神秘力量”，成为“杭州六小龙”之一。
- 有业内人士表示，梁文锋的招聘策略偏向于年轻的高潜力人才，强调"轻经验、重潜力"的用人思路，推动了公司在AI领域的创新发展。

以上信息为收集到的DeepSeek公司的基本信息、创始团队背景、成立时间、技术突破及市场表现等关键信息。
</summary>
</web_page>



<web_page index=4>
<title>
DeepSeek
</title>
<url>
https://baike.baidu.com/item/DeepSeek/65258669
</url>
<page_time>
2025-02-07 08:00:00
</page_time>
<summary>
DeepSeek，全称杭州深度求索人工智能基础技术研究有限公司，成立于2023年7月17日。创始团队由知名私募巨头幻方量化团队组成，法定代表人为裴湉。公司总部位于浙江省杭州市，注册地址为拱墅区环城北路169号汇金国际大厦西1幢1201室。

公司性质为其他有限责任公司，经营范围包括人工智能应用软件开发以及技术服务、技术开发等。DeepSeek的员工数约为140人。

在产品发展方面，DeepSeek专注于开发先进的大语言模型（LLM）及相关技术。公司的主要产品发布历程如下：
- 2024年1月5日，发布DeepSeek LLM，包含670亿参数的模型，开源给研究社区使用。
- 2024年1月25日，发布DeepSeek-Coder，专注于代码语言模型。
- 2024年2月5日，发布DeepSeekMath，以数学为基调的模型。
- 2024年3月11日，推出DeepSeek-VL，视觉-语言模型。
- 2024年5月7日，发布第二代Mixure-of-Experts（MoE）模型DeepSeek-V2。
- 2024年6月17日，发布DeepSeek-Coder-V2。
- 2024年12月13日，发布DeepSeek-VL2模型系列。
- 2024年12月26日，推出全新DeepSeek-V3模型并开源。
- 2025年1月20日，发布DeepSeek-R1模型，并同步开源权重。

在技术突破方面，DeepSeek凭借其使用的数据蒸馏技术，优化了模型的数据处理能力。根据评估，DeepSeek的模型在性能方面表现超越了市场上许多主流产品。

从市场表现来看，DeepSeek的产品发布后迅速登顶多个市场应用商店的下载排行榜，并且在国际上引起了较大的关注和讨论，其技术被认为具有较高的性价比，进而对现有的市场格局产生了影响。

总体而言，DeepSeek的创新及其技术的快速演变，标志着其在人工智能研究和应用领域的崛起，显示出其在行业中极具潜力的地位。
</summary>
</web_page>



<web_page index=5>
<title>
从0到1了解DeepSeek
</title>
<url>
https://zhuanlan.zhihu.com/p/21348720890
</url>
<page_time>
2025-02-04 08:00:00
</page_time>
<summary>
DeepSeek，全称杭州深度求索人工智能基础技术研究有限公司，由幻方量化的联合创始人梁文峰创立。公司成立于2023年7月，始终专注于大语言模型(LLM)及其相关技术的深度研发。

在技术上，DeepSeek致力于技术创新，提出了多头潜在注意力机制(MLA)和DeepSeekMoE等创新架构。凭借这些创新成果，DeepSeek的大模型在多项权威测评中表现优秀。

DeepSeek的团队成员大多来自清华大学、北京大学、中山大学、北京邮电大学等国内顶尖高校，整体上呈现出“年轻高学历、注重开源、重视创新”的特点。

根据彭博社的报道，DeepSeek的AI助手在140个市场中成为下载量最多的移动应用，该应用在发布后前18天内获得了1600万次下载，并在苹果AppStore上登顶，并在美国Android Play Store中也位居榜首，展现出强劲的市场表现。
</summary>
</web_page>



<web_page index=6>
<title>
什么是DeepSeek？谁开发？能干什么？为什么美国调查打压？威胁？
</title>
<url>
https://baijiahao.baidu.com/s?id=1822573420205256929
</url>
<page_time>
2025-01-29 08:00:00
</page_time>
<summary>
1. **公司基本信息**：
- DeepSeek是中国本土企业“杭州深度求索人工智能基础技术研究有限公司”开发的一系列人工智能模型。

2. **创始团队背景**：
- DeepSeek由量化资管巨头幻方量化创立，创始人是梁文锋，他在量化投资和高性能计算领域具有深厚的背景和丰富的经验。

3. **公司背景**：
- 深度求索公司专注于开发先进的大语言模型（LLM）和相关技术，自成立以来在AI领域取得了显著成果。

4. **功能与应用**：
- DeepSeek模型的功能包括智能对话、准确翻译、创意写作、高效编程、智能解题和文件解读等。模型的“深度思考”和“联网搜索”功能使得DeepSeek能够更全面地理解用户问题并提供准确答案。
- DeepSeek被广泛应用于自然语言处理、机器学习、编码任务等多个领域，为用户提供了高效、便捷的AI服务。

5. **美国调查与打压**：
- 美国政府对DeepSeek展开国家安全调查，主要担忧其技术可能对美国国家安全构成威胁，同时也有观点认为DeepSeek可能涉及数据盗窃等不当行为。
- 美国海军已指示成员避免使用DeepSeek的人工智能技术，微软等公司也在调查相关问题。此外，可能采取其他措施限制DeepSeek在美国的发展。

6. **全球影响**：
- DeepSeek的快速发展和广泛应用可能对美国的技术优势构成挑战，尤其是在自然语言处理和机器学习领域，其开源策略推动了全球AI开发者社区的合作与发展。

信息来源于网页内容，包括开发者背景、公司功能及其在市场中的表现等关键信息。
</summary>
</web_page>


<web_pages_short_summary>
根据前序搜索结果，已经获得以下关键信息：

1. 公司基本信息：
- 全称：杭州深度求索人工智能基础技术研究有限公司（DeepSeek）[index=2,4]
- 成立时间：2023年7月17日[index=4]
- 总部地点：浙江省杭州市拱墅区[index=4]
- 员工规模：约140人，以90后和95后为主，85%以上拥有硕士，40%以上有博士[index=3]

2. 创始团队背景：
- 创始人：梁文锋，1985年生于广东[index=1]
- 教育背景：17岁考入浙大，本硕均为浙江大学[index=3]
- 职业经历：2015年创办幻方科技，2023年创立DeepSeek[index=1,3]

3. 产品发展历程（2024-2025）[index=4]：
- 2024年1月：发布DeepSeek LLM（670亿参数）和DeepSeek-Coder
- 2024年2-3月：发布DeepSeekMath和DeepSeek-VL
- 2024年5-6月：发布DeepSeek-V2和DeepSeek-Coder-V2
- 2024年12月：发布DeepSeek-VL2和DeepSeek-V3
- 2025年1月：发布DeepSeek-R1

4. 技术突破：
- 创新架构：混合专家模型（MoE）和多头延迟注意力机制（MLA）[index=2]
- 高效训练：使用FP8混合精度与多令牌预测[index=2]
- 成本优势：DeepSeek-V3仅用1/11算力和2000个GPU，训练成本557.6万美元[index=3]

5. 市场表现：
- 产品影响力：被称为"大模型界的拼多多"和"杭州六小龙"之一[index=3]
- 国际影响：AI助手在140个市场成为下载量最多的移动应用[index=5]
- 争议：受到美国政府国家安全调查关注[index=6]
</web_pages_short_summary>


<web_page index=7>
<title>
深度求索（DeepSeek）A轮融资是2023年AI领域的重要事件，以下是对其股东构成和融资方案关键信息的梳理：- 融资... - 雪球
</title>
<url>
https://xueqiu.com/7736568262/322455937
</url>
<page_time>
2025-02-06 08:00:00
</page_time>
<summary>
- 融资历史：
- A轮融资总金额约10亿元人民币，反映了市场对深度求索在人工智能领域潜力的高度认可，为后续研发和业务拓展提供了坚实的资金基础。
- 领投方：由腾讯投资和博裕资本领投。腾讯为深度求索带来丰富的技术资源、数据优势以及庞大的用户生态支持；博裕资本在资本运作和产业整合方面经验丰富，有助于优化战略布局和提升运营效率。
- 跟投方包括智度股份等，其在数字营销、区块链等领域的业务经验可能与深度求索的AI技术产生协同效应，促进双方创新应用。
- 股权结构调整：A轮融资后，深度求索股权结构发生变化，新股东的加入带来多元化的资源和视角，有利于技术研发、市场拓展和商业合作，但具体股权比例未公开披露。
</summary>
</web_page>



<web_page index=8>
<title>
IDC：DeepSeek爆火的背后，大模型/生成式AI市场生态的潜在影响引人关注
</title>
<url>
https://www.idc.com/getdoc.jsp?containerId=prCHC53185925
</url>
<page_time>
2025-02-09 08:00:00
</page_time>
<summary>
1. **产品发展历程**：DeepSeek共发布了三款大模型：
- 基座模型：DeepSeek V3
- 推理模型：R1
- 多模态模型：JanusPro

2. **技术突破**：
- 引入了一系列创新的模型训练和推理优化技术，例如多令牌预测（MTP）、FP8精度训练、混合专家模型等，显著降低了模型训练与推理的成本和复杂性。

3. **市场表现**：
- DeepSeek模型的推出在大模型/生成式AI市场上引起了轰动，连接大模型和应用之间的产品演变促使AI产业链的重新审视。
- 产品影响力强，不仅影响大模型的研发与定价机制，还可能加速整个AI生态系统的商业化。

4. **商业化进展和应用**：
- 预计未来的应用场景将广泛，包括文案撰写、AI助手、在线会议总结等，显示出大模型在提升个人和企业效率中的潜力。

虽然该网页没有提供关于DeepSeek的融资历史、用户规模或营收情况的具体数据，但提供了有关公司当前产品、技术突破和市场表现的重要信息，这对进一步分析DeepSeek公司的整体框架非常有帮助。
</summary>
</web_page>



<web_page index=9>
<title>
Deepseek 的资金来源 支撑梁文峰创立并运营人工智能公司DeepSeek的资金来源，主要与其创立的量化对冲基金“High - Flyer Qua... - 雪球
</title>
<url>
https://xueqiu.com/1870617651/322213609
</url>
<page_time>
2025-02-04 08:00:00
</page_time>
<summary>
1. 融资历史：
- DeepSeek的资金来源主要依赖于其创始人梁文锋创办的量化对冲基金“High - Flyer Quantitative Investment Management”（幻方量化）。自2023年成立以来，DeepSeek完全由High - Flyer提供资金支持，未引入外部风险投资。这种内部输血模式使公司能够专注于长期基础研究而不受短期商业化压力影响。
- High - Flyer量化基金自2015年创立以来，通过AI驱动的交易策略在金融市场获取显著收益，2021年管理资产规模一度超过千亿元人民币（约合140亿美元），成为中国量化投资领域的“四大天王”之一。

2. 支持与成本优势：
- High - Flyer在算力资源上的提前布局为DeepSeek提供了核心支撑，例如，2019年建成的“萤火一号”集群和2021年投资建设的“萤火二号”集群，这些资产使DeepSeek的研发成本大幅低于竞争对手。
- 例如，DeepSeek-V3模型的训练成本仅为558万美元，显著低于其它大模型的数十亿美元投入，得益于其拥有的GPU集群和优化算法。

3. 政策与市场定位：
- DeepSeek的技术成果被视为中国突破技术封锁的重要成果，梁文锋在2025年1月参加了国务院总理李强主持的座谈会，显示出公司与政策导向的高度契合，未来可能获得更多政策支持。
- 在中美科技竞争的背景下，DeepSeek的国产化策略符合国家战略需求，可能获得政府采购或产业协同资源。

4. 开源策略与市场影响力：
- DeepSeek选择开源其核心模型，通过技术共享快速建立行业影响力，虽然开源策略在短期内难以直接盈利，但通过提供企业级AI服务获得适度利润。

5. 发展展望：
- DeepSeek团队小型化，有效降低人力成本，团队人数仅约10人，通过扁平化管理进一步减少资金消耗。未来的发展将取决于其技术突破及商业化路径的拓展。
</summary>
</web_page>



<web_page index=10>
<title>
利欧股份投资DeepSeek的消息属实，具体投资情况如下：2023年天使轮融资：_财富号_东方财富网
</title>
<url>
https://caifuhao.eastmoney.com/news/20250204171705744083340
</url>
<page_time>
2025-02-04 08:00:00
</page_time>
<summary>
### 融资历史
1. **2023年天使轮融资**:
- 投资方：利欧股份的全资子公司浙江利欧创投
- 投资金额：5000万元人民币
- 股权比例：约1.5%

2. **2023年半年度**:
- 投资方：利欧股份
- 投资金额：2000万美元
- 股权比例：约0.625%

3. **2023年12月A轮融资**:
- 投资方：利欧股份（领投方）
- 投资金额：2.73亿元人民币

4. **2024年A轮融资**:
- 投资方：利欧股份通过全资子公司平潭利恒
- 投资金额：5000万美元
</summary>
</web_page>



<web_page index=11>
<title>
深度求索DeepSeek-R1：中国AI的“成本核弹”与全球产业链重估机遇
</title>
<url>
https://xueqiu.com/1686227375/322204783
</url>
<page_time>
2025-02-04 08:00:00
</page_time>
<summary>
1. 技术突破：
- DeepSeek-R1以1/55的成本实现与GPT-oi同级的性能，标志着AI竞争的重点从算力转向算法效率。
- 采用强化学习优化，通过动态奖励模型提升训练效率300%。
- 采用蒸馏技术升级将千亿参数模型压缩至32B/70B，推理能耗降低90%，能在手机端部署。
- 开放思维链输出功能可以追溯AI决策路径，解决大模型“黑箱”问题，吸引企业级客户。

2. 市场表现：
- DeepSeek的定价策略被称为“降维打击”，可能促使中小开发者转移并导致云计算厂商调整AI服务定价。
- 预测智能硬件厂商在成本降低后利润率空间将打开。

3. 投资图谱：
- 涉及到的投资逻辑说明了突破算力卡脖子预期可能重估中国AI资产，提到了几个相关的重点标的公司，如腾讯控股、商汤科技等，显示出市场对AI产业链重构的关注。

4. 风险与机遇：
- 提到的风险包括技术迭代和地缘政治博弈，且2025年第二季度的财报将是商业化验证的关键时刻。

虽然提供了一些关于技术和市场表现的详细信息，融资历史及具体市场数据尚未包含在内，仍需进一步搜索进一步补充这些信息。
</summary>
</web_page>



<web_page index=12>
<title>
What Is DeepSeek and How Should It Change How You Invest in AI?
</title>
<url>
https://www.investopedia.com/deepseek-ai-investing-8782152
</url>
<page_time>
2025-01-31 08:00:00
</page_time>
<summary>
1. **公司基本信息**：
- **全称**：杭州深度求索人工智能基础技术研究有限公司（DeepSeek）
- **成立时间**：2023年7月
- **总部地点**：浙江省杭州市

2. **创始团队背景**：
- **创始人**：梁文锋，前对冲基金执行官
- **教育背景和经历**：背景强调其在金融行业的经验，推动了DeepSeek的创立。

3. **融资历史**：
- DeepSeek得到了来自量化投资巨头High-Flyer Quant的支持。

4. **产品发展历程**：
- 自成立以来，DeepSeek推出了一系列新模型，包括：
- DeepSeek-V3和DeepSeek-R1，声称其推理能力与OpenAI相媲美，成本仅约$5.6百万的培训费用。

5. **技术突破**：
- **技术创新**：
- 采用混合专家模型（MoE）架构和强化学习，通过激活部分参数来降低计算成本。
- 使用代价更低的模型压缩技术来开发更小、更便宜的版本。
- **高效训练**：在约2,000个Nvidia GPU上进行了为期55天的训练。

6. **市场表现**：
- DeepSeek的成功颠覆了对人工智能开发需要大量资金的常规认知，导致美国一些主要技术公司的股票大幅下跌。
- DeepSeek的模型和方法被认为可能降低人工智能的开发成本，这可能会在AI领域创造新的投资机会。

7. **争议和问题**：
- DeepSeek的AI产品在准确性方面存在问题，某些测试显示其聊天机器人的准确率极低，且经常提供错误信息。

总结：DeepSeek公司在短时间内快速发展，依靠创新的技术和高效的成本控制，引发了广泛的市场关注与投资者的重新思考。
</summary>
</web_page>


<web_pages_short_summary>
整合最新搜索结果，补充了以下关键信息：

1. 融资历史[index=7,9,10]：
- 资金来源：早期主要依赖创始人梁文锋的量化基金High-Flyer提供支持
- 天使轮（2023年）：利欧股份投资5000万元人民币，获1.5%股权
- 2023年半年度：利欧股份追投2000万美元，获0.625%股权
- A轮融资（2023年12月）：
- 总金额约10亿元人民币
- 领投方：腾讯投资和博裕资本
- 跟投方包括智度股份等
- 2024年A轮追加：利欧股份子公司平潭利恒投资5000万美元

2. 技术突破补充[index=8,11]：
- DeepSeek-R1实现与GPT相当性能，成本仅为1/55
- 通过强化学习优化提升训练效率300%
- 蒸馏技术实现模型压缩，能耗降低90%
- 开放思维链功能解决"黑箱"问题

3. 商业化进展[index=8,9]：
- 采用开源策略快速建立行业影响力
- 主要通过企业级AI服务获取收益
- 应用场景包括：文案撰写、AI助手、会议总结等
- 团队保持小型化（约10人），采用扁平化管理降低成本

4. 政策支持[index=9]：
- 2025年1月创始人参加国务院总理座谈会
- 被视为突破技术封锁的重要成果
- 符合国家战略需求，可能获得政府采购支持

5. 挑战与风险[index=11,12]：
- AI产品在准确性方面存在改进空间
- 面临技术迭代和地缘政治博弈风险
- 2025年第二季度财报将是商业化验证关键
</web_pages_short_summary>
"""

    prompt = MergeSearchResultZHDetailed().construct_prompt(
    to_run_target_write_tasks = "写作任务1，字数：7000字",
    to_run_search_task = "全面收集DeepSeek的公司信息，包括：创始团队背景、成立时间、融资历史、产品发展历程、技术突破、市场表现等关键信息，为确定整体文章结构做准备",
    # to_run_search_results = "<web_page index=1>\n<title>\n揭秘DeepSeek:一个更极致的中国技术理想主义故事 ｜36氪独家\n</title>\n<url>\nhttps://www.36kr.com/p/2872793466982535\n</url>\n<page_time>\n2024-07-22 08:00:00\n</page_time>\n<summary>\n1. **基础信息与创始团队**：\n- **公司名称**：DeepSeek（深度求索）\n- **创始人**：梁文锋\n- 背景：梁文锋为80后，早年就读于浙江大学电子工程系，专攻人工智能方向；在创办DeepSeek之前，曾在量化私募巨头幻方任职，从事技术研究。\n- 特点：被描述为兼具工程能力和研究能力的技术理想主义者，具备强大的学习能力。\n\n2. **成立时间与定位**：\n- DeepSeek是中国大模型创业公司之一，成立时间未明确提及，但相关访谈暗示其较为年轻，且在一年前开始受到关注。该公司聚焦于技术创新，未进行商业化运作，目前还未进行融资。\n\n3. **产品与技术发展**：\n- **主要产品**：DeepSeek V2模型，推出时以超高性价比闻名，推理成本极低。\n- **技术突破**：提出MLA（多头潜在注意力机制）架构和DeepSeekMoESparse结构，对模型架构进行了全方位创新，减少了显存占用和计算量。梁文锋强调，DeepSeek的目标是参与AGI（通用人工智能）的研究，认为模型架构的创新是实现更强模型能力的基础。\n\n4. **市场表现**：\n- DeepSeek V2的发布引发了中国大模型价格战，称其为“AI界拼多多”，其他大厂如字节、腾讯等公司随后降价以应对。\n- 深受关注的反响与其架构创新相关，受到硅谷分析师的高度评价。\n\n5. **融资历史**：\n- 目前DeepSeek未进行任何融资，短期内没有融资计划。梁文锋指出，公司的发展面临的问题主要是高端芯片被禁运，而不是资金。\n\n总结：DeepSeek致力于技术创新与研发，未追求快速的商业化，选择开源路线，保持技术的前沿地位，强调技术能力的积累和团队的成长。该公司显然在中国大模型领域中占有独特位置并推动了行业变革。\n</summary>\n</web_page>\n\n\n\n<web_page index=2>\n<title>\nDeepSeek 团队深度分析报告\n</title>\n<url>\nhttps://zhuanlan.zhihu.com/p/17123031866\n</url>\n<page_time>\n2025-01-08 08:00:00\n</page_time>\n<summary>\n**1. 公司概况**\n- **公司名称**：杭州深度求索人工智能基础技术研究有限公司（DeepSeek）\n- **成立时间**：2023年5月\n- **总部地点**：浙江省杭州市\n- **公司定位**：专注于人工智能技术研发，致力于在AI领域的快速崛起，凭借其深厚的学术背景与开源生态策略。\n\n**2. 创始人简介**\n- **创始人兼CEO**：梁文峰（Liang Wenfeng）\n- **教育背景**：浙江大学人工智能专业\n- **创业经历**：幻方（High-Flyer）量化对冲基金创始人\n- **量化金融成就**：\n- 将幻方发展为中国四大型量化对冲基金之一\n- 基金估值达到80亿美元\n- **专业领域**：梁文峰在AI和金融领域的深厚积累，让他对量化金融和AI技术创新有着深刻的理解。\n\n**3. 团队实力与背景**\n- **技术优势**：\n- **快速迭代能力**：团队在短时间内多次发布开源大模型，性能不断突破。\n- **创新架构设计**：包括混合专家模型（MoE）和多头延迟注意力机制（MLA）等技术突破。\n- **高效训练方法论**：采用FP8混合精度、多令牌预测等先进方案，显著提升训练和推断效率。\n\n此信息涉及DeepSeek公司的基本信息、创始团队背景及其团队的技术优势，符合用户对公司信息全面收集的需求。\n</summary>\n</web_page>\n\n\n\n<web_page index=3>\n<title>\nDeepSeek现象级崛起，融资谜团引发创投界热议_梁文峰_公司_投资方\n</title>\n<url>\nhttps://www.sohu.com/a/858386504_121798711\n</url>\n<page_time>\n2025-02-12 11:12:00\n</page_time>\n<summary>\n1. **公司介绍**：\n- DeepSeek是一款人工智能平台，近日在全球范围内引发热议。\n- 上线7天内用户量突破1亿，创造了历史上用户增长速度的新纪录，超越ChatGPT的表现。\n\n2. **创业团队与创始人背景**：\n- 创始人是梁文峰，他是一名量化基金从业者，管理着近千亿的资金，具备自筹资金的能力。\n\n3. **融资历史**：\n- 有传言称，DeepSeek在2024年6月完成了种子轮融资，投资方包括High-FlyerQuan等。\n- 后续融资参与方有杭州东方嘉富资产管理公司、长三角AI产业基金等。\n- 涉及润和软件通过产业基金向DeepSeek投资5000万元的传闻，均未得到官方确认。\n- 杭州深度求索人工智能基础研究有限公司的股东名单并未出现投资机构，股东均为梁文峰及其合伙人，可能支持DeepSeek未融资的判断。\n\n4. **市场表现与反响**：\n- DeepSeek的崛起让业界震惊，并引发了对科技企业影响力的深度思考。\n- 对于DeepSeek是否融资的讨论较为广泛，创投界内有人认为该公司未经历融资，而是独立发展。\n\n5. **行业反思与未来展望**：\n- DeepSeek的成功引发业界对于技术创新重要性的讨论，表明资本并非万能。\n- 提出创投界应更加关注技术创新的核心价值，而非追逐市场热点。\n\n总结：DeepSeek是一款引起广泛关注的人工智能平台，创始人梁文峰具备自筹资金能力，融资传闻众多但未获得官方确认，公司可能选择保持独立发展。\n</summary>\n</web_page>\n\n\n\n<web_page index=4>\n<title>\n【一文读懂】DeepSeek的发展历史\n</title>\n<url>\nhttps://blog.csdn.net/Bl_a_ck/article/details/145461360\n</url>\n<page_time>\n2025-02-06 08:43:20\n</page_time>\n<summary>\nDeepSeek（全称：杭州深度求索人工智能基础技术研究有限公司）成立于2023年7月17日，总部位于浙江省杭州市，注册资本为1000万元人民币。公司法定代表人为裴湉，是一家专注于开发先进的大语言模型（LLM）及相关技术的创新型科技公司，得到了私募巨头幻方量化的大力支持，特别是在硬件支持（如A100芯片的储备）方面。\n\n自成立以来，DeepSeek在技术进展和市场关注度上取得了显著成就，以下为其发展历程中的关键事件：\n- 2024年1月5日：发布DeepSeek LLM，包含670亿参数，使用2万亿token的数据集进行训练。\n- 2024年1月25日：发布DeepSeek-Coder，专注于代码生成和补全。\n- 2024年2月5日：推出DeepSeekMath，专注于数学相关任务。\n- 2024年3月11日：发布DeepSeek-VL，开源视觉-语言模型，具备高效的视觉任务处理能力。\n- 2024年5月7日：发布DeepSeek-V2，使用Mixture-of-Experts（MoE）架构，提升性能。\n- 2024年6月17日：推出DeepSeek-Coder-V2，增强了编码和数学推理能力。\n- 2024年12月13日：发布DeepSeek-VL2，改善视觉语言模型的多模态理解能力。\n- 2024年12月26日：推出DeepSeek-V3模型，显著提高知识类任务和生成速度。\n- 2025年1月20日：发布DeepSeek-R1，采用强化学习技术提升模型推理能力。\n\nDeepSeek的主要产品包括：\n1. **DeepSeek LLM**：具备出色的语言理解能力，超越了Llama2 70B Base和GPT-3.5。\n2. **DeepSeek-Coder**：支持多种编程语言的代码编程模型。\n3. **DeepSeekMath**：在数学相关任务上与GPT-4相当的模型。\n4. **DeepSeek-VL**：视觉-语言融合模型。\n5. **DeepSeek-V2**：基于MoE架构的语言模型，优化了训练和推理成本。\n6. **DeepSeek-R1**：强化学习优化的大语言模型。\n\n此外，DeepSeek采用Mixture of Experts（MoE）架构、强化学习和知识蒸馏等核心技术，以推动其模型的性能和效率。\n\n最新动态表明，DeepSeek的技术创新在全球范围内，特别是在硅谷的技术圈内引起了广泛关注，其模型已被接入多个平台以便为开发者提供服务。\n</summary>\n</web_page>\n\n\n\n<web_page index=5>\n<title>\nDeepSeek创始人专访：中国的AI不可能永远跟随，需要有人站到技术的前沿\n</title>\n<url>\nhttps://www.163.com/dy/article/JLDDAREI05566TJ2.html\n</url>\n<page_time>\n2025-01-08 08:00:00\n</page_time>\n<summary>\n1. **创始团队背景**：\n- 创始人梁文锋是一个注重技术与原创式创新的理想主义者，强调中国AI需要站到技术前沿。他拥有丰富的技术背景，团队主要由应届高校毕业生和年轻研究人员组成，未从海外挖人，强调培养本土技术人才。\n\n2. **成立时间**：\n- 网页内容未明确指出DeepSeek的成立时间。\n\n3. **融资历史**：\n- DeepSeek至今未进行融资，创始人表示公司未全面考虑商业化，坚定选择开源路线，是唯一一家没有融过资的公司。\n\n4. **产品发展历程**：\n- 2024年5月，DeepSeek发布了名为DeepSeek V2的开源模型，并迅速引发大模型价格战，随后在2025年发布了V3版本，并在外网引起关注。这款模型在训练成本和效果上与国际竞争对手（如Llama 3.1）相比具备显著优势。\n\n5. **技术突破**：\n- DeepSeek在开源模型方面取得了突破，其V3模型达到了开源领域的SOTA（state-of-the-art）水平，超越了Llama 3.1 405B模型，仅以11分之一的训练成本达到同样的表现。其架构创新（MLA）将显存占用显著降低，使得模型训练更高效。\n\n6. **市场表现**：\n- 在市场竞争中，DeepSeek以更低的价格和更高的质量，为AI市场带来了新的产品选择。它在Chatbot Arena大模型排行榜中名列第七。其市场影响力主要体现在国产大模型价格战的引发和对外国模型的直接竞争。\n\n总结：尽管网页没有提供DeepSeek的具体成立时间与融资详情，但在创始团队的背景、技术突破及市场表现方面提供了扎实的信息，强调其不依赖外部融资、专注于技术创新的经营方针。\n</summary>\n</web_page>\n\n\n\n<web_page index=6>\n<title>\nDeepSeek创始人梁文锋：从实习生到行业先锋的成长之路_技术_艾麒_周朝\n</title>\n<url>\nhttps://www.sohu.com/a/857641432_121798711\n</url>\n<page_time>\n2025-02-10 16:26:00\n</page_time>\n<summary>\n1. **创始团队背景**: DeepSeek的创始人是梁文锋，他于2009年在上海闵行的艾麒信息科技公司实习，从实习生晋升为新技术部经理，展示了出色的技术才能和管理能力。\n\n2. **成立时间**: 没有明确提及DeepSeek的成立时间。\n\n3. **职业经历**: 梁文锋在实习期间表现突出，获得了高薪，并在技术和管理上展现了出色才能，推行扁平化管理，招募了多个高技能的团队成员。\n\n4. **技术架构与创新**: DeepSeek是一个AI大模型的开发项目，强调自主研发，具有低使用成本和易于接入的免费使用体验，相比于高昂注册费用的其他AI服务更具优势。\n\n5. **社会责任**: 梁文锋关注技术的社会责任，曾开放万卡平台支持科研项目，并捐赠1.38亿元给慈善机构。\n\n6. **市场表现**: 文章提到DeepSeek在竞争激烈的市场中脱颖而出的原因是其技术创新，尤其是在降低对高性能硬件依赖方面的突破。未来的垂直领域大模型可能会颠覆传统商业模式。\n\n总体而言，这篇文章主要聚焦于梁文锋的个人成长经历以及对DeepSeek的技术和社会责任的看法，但对用户希望了解的系统信息，如成立时间、融资历史等未涉及。\n</summary>\n</web_page>\n\n\n\n<web_page index=7>\n<title>\nDeepSeek引爆AI烧钱大战，三大独角兽密集融资，四巨头怒砸2万亿\n</title>\n<url>\nhttps://www.36kr.com/p/3157758791670535\n</url>\n<page_time>\n2025-02-10 02:22:00\n</page_time>\n<summary>\n1. **融资历史**: DeepSeek近期被传获得阿里10亿美元的投资，估值达到100亿美元，但此消息在当晚被阿里辟谣。金沙江创投的朱啸虎表示如果DeepSeek开放融资，他会进行投资，显示出对DeepSeek的关注。\n\n2. **市场表现**: DeepSeek的出现引发了大模型融资热潮，许多大型AI企业如OpenAI和Anthropic也正在进行高额融资。文章提到DeepSeek的技术路线不需要过度依赖AI基础设施，引发对AI公司维持高估值能力的讨论。\n\n3. **整体影响**: DeepSeek的出现为AI领域带来了新的投资动态和技术创新，其发展状况可以对整个市场的投资格局产生影响。尤其是在全球科技巨头正在增加AI领域的投资，预计2025年相关开支将显著增长。\n\n以上信息虽然没有全面涵盖用户所需的所有维度，但提供了DeepSeek在AI投资市场中的位置和影响力的初步了解。\n</summary>\n</web_page>\n\n\n\n<web_page index=8>\n<title>\nDeepSeek 发展历程（截止到25年1月）\n</title>\n<url>\nhttps://zhuanlan.zhihu.com/p/17511493759\n</url>\n<page_time>\n2025-01-10 08:00:00\n</page_time>\n<summary>\n1. **发展历程：**\n- **2023年11月2日**：发布首个开源模型DeepSeek Coder。\n- **事件**：DeepSeek发布了首个开源代码大模型，支持多种编程语言的代码生成、调试和数据分析任务。\n- **特点**：完全开源，免费商用。在HumanEval等编程基准测试中表现优异，超越了CodeLlama等开源模型。\n- **相关链接**：GitHub链接提供（[deepseek-ai/deepseek-coder](https://github.com/deepseek-ai/deepseek-coder)）。\n\n- **2023年11月29日**：推出DeepSeek LLM。\n- **事件**：DeepSeek发布了参数规模达670亿的通用大模型，包括7B和67B的base及chat版本。\n- **特点**：支持多种自然语言任务，如对话、文本生成等，并提供在线体验平台，用户可通过网页端直接试用。\n- **相关链接**：在线体验链接提供。\n\n2. **技术突破**：\n- 首个开源代码大模型（DeepSeek Coder）在编程基准测试中表现优异，标志着技术能力的提升。\n\n3. **发布时间**：\n- 网页内容截至2025年1月10日，提供了截至此时间点的DeepSeek的发展历程概览。\n\n**未涉及信息**：创始团队背景、成立时间、融资历史、市场表现等信息在当前网页内容中没有介绍。\n</summary>\n</web_page>\n\n\n<web_pages_short_summary>\n基于第一轮搜索结果，我已获得以下关键信息：\n\n1. 公司基本信息：\n- 公司全称：杭州深度求索人工智能基础技术研究有限公司（DeepSeek）[index=4]\n- 成立时间：2023年7月17日[index=4]\n- 注册资本：1000万元人民币[index=4]\n- 总部地点：浙江省杭州市[index=2]\n\n2. 创始团队背景：\n- 创始人：梁文锋[index=1,2]\n- 教育背景：浙江大学人工智能专业[index=2]\n- 先前经历：幻方量化基金创始人，管理近千亿资金[index=2,3]\n- 团队特点：以应届高校毕业生和年轻研究人员为主，注重本土人才培养[index=5]\n\n3. 产品发展历程（2024-2025）[index=4]：\n- 2024.1.5：发布DeepSeek LLM（670亿参数）\n- 2024.5.7：发布DeepSeek-V2\n- 2024.12.26：发布DeepSeek-V3\n- 2025.1.20：发布DeepSeek-R1\n\n4. 技术突破：\n- MLA架构创新：显著降低显存占用[index=1]\n- V3模型成本优势：仅用Llama 3.1 405B模型11分之一的成本达到更好效果[index=5]\n- 在Chatbot Arena排名第7，为前十名中唯一开源模型[index=5]\n\n5. 融资情况：\n- 目前未进行任何融资[index=1,5]\n- 有传言称获得阿里10亿美元投资（已被辟谣）[index=7]\n- 获得幻方量化在硬件方面的支持[index=4]\n</web_pages_short_summary>\n\n\n<web_page index=9>\n<title>\n深度求索的Deepseek免费开源，这家公司怎么盈利模式是怎样的呢？\n</title>\n<url>\nhttps://www.zhihu.com/question/11257058347\n</url>\n<page_time>\n未提供\n</page_time>\n<summary>\nDeepSeek的盈利模式主要基于以下几个方面：\n\n1. **开源与生态构建**：DeepSeek作为一个开源大模型，其主要目标是扩大生态影响力。通过开源的方式，吸引更多用户和合作伙伴，从而形成一个庞大的技术用户群体。\n\n2. **技术服务**：通过与各大云服务商的合作，例如青云科技、阿里云、腾讯云等，DeepSeek提供集成与API服务，使用户能够按token数量付费使用DeepSeek模型，DeepSeek与云厂商之间可能共享收益。\n\n3. **反哺母公司金融业务**：作为幻方量化的技术中台，DeepSeek通过提供底层能力，提升量化模型的性能，为母公司的金融业务服务，从而实现技术能力的商业化价值转化。\n\n整体来看，DeepSeek并不是依赖于自身的模型销售盈利，而是通过构建生态和技术服务，来实现对母公司的支持和商业化变现的探索。\n</summary>\n</web_page>\n\n\n\n<web_page index=10>\n<title>\n2024年人工智能行业专题分析：比较试用DeepSeek看模型走向应用的新迹象\n</title>\n<url>\nhttps://www.vzkoo.com/read/20241231a8dd279c0d46ace368a1270f.html\n</url>\n<page_time>\n2024-12-31 08:00:00\n</page_time>\n<summary>\n1. **DeepSeek-V3产品信息**：\n- **上线时间**：DeepSeek-V3系列模型于2024年12月上线。\n- **技术提升**：相较于DeepSeek-V2.5，DeepSeek-V3在数学和编程样本的比例上有所提升，并且扩展了多语言覆盖范围。\n\n2. **模型架构**：\n- DeepSeek-V3采用了自研的混合专家（MoE）架构，总参数量达到671B，但可以动态激活较少的参数以降低费用。\n- 使用FP8混合精度训练框架，优化了训练效率。\n\n3. **性能评测**：\n- DeepSeek-V3在知识类任务上的表现接近当前最优模型，同时在逻辑推理和代码生成领域展现出强项，如在密文解码中是唯一给出正确答案的大模型。\n- 模型的生成速度提升显著，从20 TPS提高至60 TPS。\n\n4. **商业模式和市场表现**：\n- DeepSeek-V3 API服务的定价调整，输入和输出成本相较于DeepSeek-V2有所提升，但仍体现出较高性价比，尤其与其他如GPT、Claude等模型相比。\n- 市场表现方面，DeepSeek在模型性能和成本控制上显示出竞争优势，有潜力成为市场的强劲参与者。\n\n5. **与竞争对手的对比**：\n- 在与其他大模型（如豆包、Kimi、通义千问）的竞品对比中，DeepSeek在推理能力和代码生成上表现相当，具备独特的空间推理和文本生成优势。\n\n6. **未来发展战略**：\n- 通过优化数据处理和算法，DeepSeek-V3在算力利用和成本控制方面展示了新的可能，推动业务和技术的发展。\n- 未来可能从开发大规模模型转向一些更具特色且成本更低的应用模型，扩展其市场潜力。\n\n此网页内容提供了DeepSeek公司在产品、市场表现和技术创新方面的重要信息，为用户进一步了解该公司的市场位置和未来发展方向提供了必要的背景资料。\n</summary>\n</web_page>\n\n\n\n<web_page index=11>\n<title>\nDeepSeek技术发展研究：驱动因素、社会影响与未来展望\n</title>\n<url>\nhttps://blog.csdn.net/wlred1980/article/details/145441464\n</url>\n<page_time>\n2025-02-05 02:31:34\n</page_time>\n<summary>\n1. **技术创新**:\n- DeepSeek采用专家混合（MoE）架构和多头潜在注意力（MLA）技术。MoE架构将大模型拆分成多个“专家”，通过分工协作提高资源利用效率，MLA技术则能动态调整注意力，降低内存占用，显著提升模型性能。\n- 训练成本大幅降低，运用FP8混合精度训练技术，使得千亿参数级模型在保持高性能的条件下，相对于传统模型推理效率提升且成本下降。\n\n2. **市场表现**:\n- DeepSeek - V3在语言能力测试中表现优异，尤其在处理中文、方言和多项语言任务中，并在推理能力上与OpenAI的GPT-4o相当，生成速度显著提升，达到60TPS。\n- 其API服务价格低于GPT-4o等模型，吸引了许多中小企业和个人开发者，降低了高性能AI服务的成本门槛。\n- DeepSeek的开源策略增加了市场接受度，使其在中美应用商店免费榜中登顶，超越ChatGPT。\n\n3. **未来应用前景**:\n- DeepSeek在多个领域（金融、医疗、制造）提供定制化AI解决方案，推动企业智能转型。在教育领域可开发个性化学习辅导工具，也可为贫困地区提供远程医疗服务。\n\n4. **总结与影响**:\n- DeepSeek的崛起打破了原有的人工智能行业格局，缩小了中美科技差距。其开源模式促进了技术生态的形成，推动人工智能技术的普及和发展。\n- 尽管存在稳定性不足和多模态功能有限等劣势，DeepSeek依靠技术创新和市场策略有望继续推进人工智能产业的变革。\n\n整体来看，DeepSeek通过创新技术、成本控制和市场策略，展示了广泛的商业化潜力和市场影响力，对未来的AI发展具有重要意义。\n</summary>\n</web_page>\n\n\n\n<web_page index=12>\n<title>\n中小企业加速应用DeepSeek的正确方式\n</title>\n<url>\nhttps://www2.deloitte.com/cn/zh/pages/deloitte-analytics/articles/deepseek-industry-applications.html\n</url>\n<page_time>\n2025-02-12 08:00:00\n</page_time>\n<summary>\n1. **DeepSeek在中小企业的应用现状**：随着大模型技术的发展，中小企业开始寻找可行的AI应用路径。DeepSeek凭借高性价比和开源策略，降低了使用门槛，支持灵活的部署方案，使中小企业能够进行智能化升级。\n\n2. **市场渗透率**：目前，大模型在中小企业中的渗透率仍然较低，未来应用潜力巨大。DeepSeek通过多层次的部署方案，帮助企业克服了传统应用中的高昂成本和复杂技术壁垒，进而提升了市场竞争力。\n\n3. **商业模式**：\n- DeepSeek采用了**普惠化的部署模式**，大型企业通常选择私有化部署，而中小企业则可以采用云端API快速接入的方式。\n- DeepSeek在多个行业中实现专业化应用，例如金融、医疗、智能制造等，推动企业建立差异化优势。\n\n4. **主要行业应用**：\n- **金融行业**：提升合同质检和资产对账效率，精准数据分析赋能决策，金融服务的智能化升级。\n- **医疗行业**：辅助医生决策优化，支持药物研发加速。\n- **智能制造**：通过技术知识图谱和工艺优化提升生产效率。\n\n5. **技术创新**：\n- DeepSeek利用混合专家架构（MoE）和高效训练策略，显著降低推理成本，推动AI技术的普惠化发展。\n- 提供开放环境，支持企业进行模型定制与场景适配。\n\n6. **安全风险与现实挑战**：\n- 企业在部署DeepSeek时面临数据安全治理、模型安全和投资效益评估等挑战。\n- 德勤建议企业通过数据安全防护、模型输出可靠性监测、科学评估投资回报以及建立合规治理框架来应对这些挑战。\n\n总结以上，DeepSeek在助力中小企业智能化转型方面展现了显著的应用价值和技术优势。虽然没有直接提供融资历史或具体市场份额数据，但展示了其在市场的活跃表现和实施的商业模式。\n</summary>\n</web_page>\n\n\n\n<web_page index=13>\n<title>\n中国AI巨头市占率：DeepSeek 异军突起，2025市场谁主沉浮？\n</title>\n<url>\nhttps://baijiahao.baidu.com/s?id=1823761292924557244\n</url>\n<page_time>\n2025-02-11 08:00:00\n</page_time>\n<summary>\n1. **市场表现**：\n- DeepSeek凭借“开源+低成本+高性能”模式异军突起，在中国AI市场扮演关键变量，预计2025年在开源大模型市场占有15%市场份额。\n- 公司上线20天内，日活用户突破2000万，海外用户占比达70%，成为国内第二大AI应用。\n- 其开源策略吸引全球开发者，包括微软、英伟达、华为云等已接入其模型服务。\n\n2. **技术突破**：\n- 发布的推理大模型DeepSeek-R1，其性能对标GPT-4，训练成本仅为GPT-4的1/10。\n- 通过创新的MLA机制（多头潜在注意力）显著降低显存占用，降至传统模型的5%-13%。\n\n3. **商业化路径**：\n- DeepSeek通过低成本API（价格仅为OpenAI的3%）和与硬件厂商合作（如华为昇腾云、小米AI眼镜）迅速渗透B端和C端市场。\n\n4. **竞争分析**：\n- 传统巨头如百度、华为、商汤科技等继续保持在各自领域的市场份额，但均面临DeepSeek的冲击。\n- 百度市占率30%，华为20%，商汤40%。\n- DeepSeek的图像分析模型和教育场景模型对传统竞争对手构成威胁。\n\n5. **未来发展趋势**：\n- 开源驱动下，DeepSeek可能成为新巨头，预计2025年占据20%以上的市场份额。\n- 端侧AI市场的爆发将使搭载DeepSeek技术的设备销量暴增，预期出货量突破百万。\n- 算力成本的优化助力DeepSeek提高在国产算力市场的竞争力，预计提高其在市场的地位。\n\n6. **结论**：\n- DeepSeek以技术突破和生态合作为核心，有望重新定义中国AI市场，在开源模型、端侧AI领域大幅提升市场份额。\n</summary>\n</web_page>\n\n\n<web_pages_short_summary>\n基于第二轮搜索结果，我整理出以下新增关键信息：\n\n1. 商业模式与盈利策略 [index=9]：\n- 主要通过开源生态构建扩大影响力\n- 与云服务商合作提供API服务，按token收费\n- 通过技术服务支持母公司幻方量化的金融业务\n\n2. 技术创新与性能 [index=10,11]：\n- 采用自研MoE架构，总参数量671B\n- 使用FP8混合精度训练框架提升效率\n- 生成速度从20 TPS提升至60 TPS\n- 在密文解码等特定任务上有独特优势\n\n3. 市场表现与占有率 [index=13]：\n- 上线20天内日活用户突破2000万，海外用户占比70%\n- 在国内开源大模型市场预计占15%份额\n- 已与微软、英伟达、华为云等接入合作\n- 对标GPT-4，但训练成本仅为其1/10\n\n4. 行业应用场景 [index=12]：\n主要覆盖三大领域：\n- 金融行业：合同质检、资产对账、决策支持\n- 医疗行业：辅助决策、药物研发\n- 智能制造：技术知识图谱、工艺优化\n\n5. 未来发展战略 [index=10,13]：\n- 从大规模模型转向特色应用模型开发\n- 深化端侧AI市场布局\n- 预计2025年市场份额有望超20%\n</web_pages_short_summary>\n\n\n<web_page index=14>\n<title>\n知识产权视角下 DeepSeek 与 OpenAI 的技术、产业策略对比分析\n</title>\n<url>\nhttps://www.163.com/dy/article/JO51R9E40511D98B.html\n</url>\n<page_time>\n2025-02-11 08:00:00\n</page_time>\n<summary>\n1. **技术创新特点**：\n- DeepSeek的核心驱动力是高效能架构设计与低成本工程实践。具体技术创新如下：\n- 采用MoE架构，总参数扩展至671B，使用动态激活机制每个token仅激活37B参数，从而大幅降低推理计算量。\n- 结合多头潜在注意力机制（MLA）、低秩联合压缩技术与多令牌预测（MTP）机制，显著提高处理效率。\n- V3模型构建了万亿token训练体系，通过渐进式训练显著提升内存效率。\n- 采用FP8混合精度训练和硬件优化技术，使模型训练成本降至头部企业的1/3。\n\n2. **知识产权布局**：\n- DeepSeek的专利涵盖集群资源管理、网络通信与数据传输、分布式模型训练、数据处理与存储等多个核心技术领域，共计已有公开的17项专利申请。\n- 专利内容包括：\n- 在容器资源管理、RDMA通信等方面的布局优化资源利用率和任务执行效率的技术方案。\n- 针对数据文件异步读取的方法及其装置等，旨在提高数据处理效率。\n- DeepSeek的专利主要在中国申请，显示出对中国市场的重视。\n\n3. **竞品分析（对比OpenAI）**：\n- DeepSeek与OpenAI的专利数量接近，致力于保护核心技术的同时，注重实际应用的优化。\n- 相较OpenAI更多集中于应用层面的技术，DeepSeek专利更偏向底层技术和系统优化，提高性能和效率。\n\n4. **开源生态建设**：\n- DeepSeek采取开源策略以吸引开发者，并通过社区协作提升模型性能，从而推动技术的普及。\n- 设计分层开源与商业版隔离策略以平衡开放性与核心商业价值的保护。\n\n5. **行业应用场景**：\n- DeepSeek的技术广泛应用于人工智能的模型训练和数据处理，特别是在集群训练任务和数据异步读取等关键环节。\n\n综上所述，整体信息展现了DeepSeek在技术创新、知识产权布局和开源生态建设方面的综合实力，提供了全面的公司信息，有利于后续文章结构的设计。\n</summary>\n</web_page>\n\n\n\n<web_page index=15>\n<title>\n全网都在扒的DeepSeek团队，是清北应届生撑起一片天\n</title>\n<url>\nhttps://www.huxiu.com/article/3869427.html\n</url>\n<page_time>\n2025-01-04 08:00:00\n</page_time>\n<summary>\n1. 创始团队背景：\n- DeepSeek的创始人是梁文锋，团队以应届生和年轻人才为核心，特别是来自清华大学和北京大学的学生。\n- 核心团队成员包括朱琪豪（北大计算机学院博士）、Peiyi Wang（北大博士生）、代达劢（北大计算语言所博士）等。团队以年轻的研究者和创新者为主导。\n\n2. 成立时间：\n- 网页内容未直接提及DeepSeek的成立时间。\n\n3. 融资历史：\n- 网页内容未提供具体的融资轮次或投资方详情。\n\n4. 产品发展历程：\n- DeepSeek推出了多个版本的大模型，包括DeepSeek-V2（2024年5月发布）和DeepSeek-v3，采用了MLA（Multi-head Latent Attention）和GRPO（Group Relative Policy Optimization）等关键技术。\n- 朱琪豪主导开发了DeepSeek-Coder-V1，并多项关键成果均由团队年轻成员完成。\n\n5. 技术突破：\n- DeepSeek-v3在算力效率上显著超越竞争者，以1/11的算力训练出比Llama 3更高性能的模型。\n- 采用新型注意力和强化学习算法，在减少计算量和推理显存的同时，提升了整体性能。\n\n6. 市场表现：\n- DeepSeek在AI圈内受到广泛关注，尤其是其技术创新和团队构成引起了业内的讨论，显示出强劲的市场表现。\n\n7. 未来发展战略：\n- 文章中未明确提到DeepSeek的未来发展战略。\n\n总结：DeepSeek的团队年轻、创新，技术发展迅速，但仍需补充关于融资、成立时间等方面的信息。\n</summary>\n</web_page>\n\n\n\n<web_page index=16>\n<title>\n【关于DeepSeek，国内外大厂的反应对比】国外大厂对DeepSeek的评价技术性能方面• Artificial An... - 雪球\n</title>\n<url>\nhttps://xueqiu.com/8315851674/322063413\n</url>\n<page_time>\n2025-02-01 08:00:00\n</page_time>\n<summary>\n1. **技术性能与创新**：\n- DeepSeek-V3被认为超越了所有开源模型，在多项评测中表现优异，直逼顶尖闭源模型如GPT-4和Claude-3.5-Sonnet。\n- 受到了OpenAI创始成员Karpathy的赞赏，特别是在有限算力预算的模型预训练能力上，认为其算力消耗仅为Llama-3-405B的1/11。\n- 微软CTO凯文·斯科特承认DeepSeek以1/5的成本实现微软90%的性能。\n\n2. **市场表现**：\n- DeepSeek迅速影响了市场，促使摩根士丹利报告称“中国AI突破将引发行业重新估值”，对纳斯达克AI概念股产生重大影响。\n- 国际风险投资机构如红杉资本设立专项基金投资DeepSeek技术生态项目。\n\n3. **国内外大厂反应**：\n- 国外大厂对DeepSeek的技术性能高度评价并将其视为竞争对手，微软将其列为Azure云“战略合作伙伴”，显示出合作的意愿。\n- 国内大厂如字节跳动、腾讯与阿里在市场策略上受到DeepSeek的极致性价比影响而选择跟进降价。\n\n4. **市场策略调整**：\n- DeepSeek的成功促使国际大厂重新审视自身AI战略，关注开源生态及性价比。国内大厂则更关注DeepSeek对自身业务的影响，采取相对谨慎的态度。\n\n总体来说，该网页提供了对DeepSeek市场表现及技术创新的高层次评价，以及国内外企业在其影响下所做出的战略调整。这些信息可以帮助理解DeepSeek的竞争环境及其市场地位。\n</summary>\n</web_page>\n\n\n\n<web_page index=17>\n<title>\n【DeepSeek朋友圈】根据搜索结果，DeepSeek（深度求索）作为2025年AI领域的“黑马”，其技术生态和商业合... - 雪球\n</title>\n<url>\nhttps://xueqiu.com/8452074505/322334736\n</url>\n<page_time>\n2025-02-05 08:00:00\n</page_time>\n<summary>\nDeepSeek（深度求索）被视为2025年AI领域的“黑马”，其技术生态和商业合作网络广泛覆盖云计算、芯片、AI基础设施及垂直应用等多个领域。以下是其核心合作伙伴的梳理：\n\n1. **国内云巨头**\n- 六大主流云平台（华为云、阿里云、腾讯云、百度智能云、火山引擎、京东云）均已上线DeepSeek系列模型（如R1、V3），提供一键部署服务，支持公有云和私有化部署模式。\n- 天翼云接入了DeepSeek模型，拓展其生态覆盖。\n\n2. **海外云厂商**\n- 亚马逊AWS、微软Azure已宣布支持DeepSeek模型，提供全球范围的云服务支持。\n- 谷歌云未明确提及但可能会未来合作。\n\n3. **芯片与算力厂商**\n- **国产芯片适配**：昇腾（华为）支持DeepSeek-R1/V3推理服务，沐曦、天数智芯、摩尔线程、海光信息等已完成对DeepSeek蒸馏版模型的适配。\n- **国际芯片巨头**：英伟达、AMD、英特尔早期适配DeepSeek模型。\n\n4. **AI基础设施与技术服务商**\n- 硅基流动与华为云联合推出DeepSeek推理服务，无问芯穹、Gitee AI 提供模型蒸馏及优化部署解决方案。\n\n5. **垂直行业应用伙伴**\n- 拓尔思与中信证券联合开发金融舆情大模型。\n- 当虹科技融合DeepSeek-R1于工业数据分析。\n\n6. **投资与生态支持方**\n- 浙江东方通过旗下基金参与DeepSeek天使轮投资。\n- 华金资本参与Pre-A轮融资。\n- 浪潮信息和中科曙光提供AI服务器基础设施。\n\n总结来看，DeepSeek通过开放模型架构吸引开发者，推动AI算力自主可控，并在各行业合作中实现低成本优势转化为生产力。风险提示提到国际芯片巨头的技术反制及开源模型商业化的可持续性问题。\n\n注意：该信息未详细包括创始团队背景、成立时间、具体融资轮次及投资方详情、技术突破、核心技术团队构成及国际市场拓展策略等关键信息，仍需寻找其他来源以进行补全。\n</summary>\n</web_page>\n\n\n\n<web_page index=18>\n<title>\nDeepSeek为何一边“开源大模型”，一边“申请专利”？\n</title>\n<url>\nhttp://www.iprdaily.cn/article1_38977_20250208.html\n</url>\n<page_time>\n2025-02-08 08:00:00\n</page_time>\n<summary>\n根据Maxipat的专利分析，DeepSeek在其关联企业名下（包括北京、杭州、宁波等）围绕大模型训练优化、网络通信、数据管理等领域申请了17项核心专利。其中，重要的技术专利包括：\n\n1. **数据序列索引技术（CN118246542A）**：将训练数据集拆分成固定大小的数据序列，采用“索引”方式混合、打乱、切分，显著节省存储空间和减少数据重复。\n\n2. **多平面RDMA并行数据传输（CN118503194A）**：该技术允许跨节点GPU直接访问内存，减少延迟，在大规模分布式训练中提升网络吞吐量。\n\n3. **无损压缩与分布式异步I/O（CN117707416A）**：动态选择数据压缩策略，以提高大规模数据的读写效率，降低对高端存储硬件的依赖。\n\n4. **异构断点续训（CN117669701A）**：允许模型在不同的训练策略或集群结构中快速恢复训练进度，减少重复工作。\n\nDeepSeek不仅在核心技术的申请上形成了强有力的法律保护，还通过开源方式迅速扩大用户基础和市场影响力。这种“开源 + 专利”的双轨策略，有助于在保护自身技术的同时，也吸引社区开发者进行技术迭代。\n\n此外，DeepSeek的开源策略带来了一系列好处，包括构建全球化的开发者生态、加速技术迭代、减少研发成本和提高公司估值等。通过开源，DeepSeek能够在市场上迅速建立影响力，并形成用户与社区的规模效应，同时保持对核心专利的控制，以确保商业收益和技术壁垒。\n\n综上所述，DeepSeek的专利布局和开源策略不仅展示了其技术实力，同时也指引了其长远的市场拓展计划和盈利模式。\n</summary>\n</web_page>\n\n\n<web_pages_short_summary>\n基于第三轮搜索结果，我整理出以下新增关键信息：\n\n1. 技术专利布局 [index=14,18]：\n- 已申请17项核心专利，主要覆盖：\n* 集群资源管理\n* 网络通信与数据传输\n* 分布式模型训练\n* 数据处理与存储\n- 重要专利包括：\n* 数据序列索引技术（CN118246542A）\n* 多平面RDMA并行数据传输（CN118503194A）\n* 无损压缩与分布式异步I/O（CN117707416A）\n* 异构断点续训（CN117669701A）\n\n2. 核心团队构成 [index=15]：\n- 高管团队：\n* 朱琪豪（北大计算机学院博士）\n* Peiyi Wang（北大博士生）\n* 代达劢（北大计算语言所博士）\n- 团队特点：以清华、北大应届生为主，重视年轻创新人才\n\n3. 战略合作伙伴关系 [index=16,17]：\n国内外云平台合作：\n- 国内：华为云、阿里云、腾讯云、百度智能云等六大主流云平台\n- 海外：亚马逊AWS、微软Azure已完成接入\n芯片厂商合作：\n- 国内：昇腾、沐曦、天数智芯等\n- 国际：英伟达、AMD、英特尔\n\n4. 市场地位与影响力 [index=16]：\n- 受到OpenAI创始成员Karpathy赞赏\n- 微软CTO承认其以1/5成本实现微软90%性能\n- 影响力扩大到国际资本市场，促使摩根士丹利发布重要研报\n- 促使国内外大厂调整市场策略和定价\n\n5. 技术创新特点补充 [index=14]：\n- MoE架构：总参数671B，每token仅激活37B参数\n- 采用多头潜在注意力机制（MLA）\n- 低秩联合压缩技术与多令牌预测（MTP）机制\n- FP8混合精度训练优化\n</web_pages_short_summary>",
    to_run_search_results = to_run_search_results
    # to_run_task = "60岁高血压糖尿病患者能不能吃复方甲氧那明"
)

    x = agent.call_llm(
        system_message = system_message,
        prompt = prompt,
        parse_arg_dict = {"result": "result"},
        # model = 'gpt-4o-mini'
        # model = 'gpt-4o'
        model = 'claude-3-5-sonnet-20241022'
        
        
    )
    print(x["original"])