#coding: utf8
from collections import defaultdict, deque
from enum import Enum
from typing import List, Dict
from recursive.utils.register import Register
from recursive.agent.proxy import AgentProxy
from abc import ABC, abstractmethod
from datetime import datetime
from overrides import overrides
import uuid
from loguru import logger
import json
from copy import deepcopy

task_register = Register('task_register')

class Graph:
    def __init__(self, outer_node):
        # 创建用处存储图中点之间关系的dict{v: [u, i]}(v,u,i都是点,表示边<v, u>, <v, i>)：边集合
        # parent.nid -> child1, child2
        self.graph_edges = {}
        self.nid_list = []
        self.node_list = []
        self.topological_task_queue = []
        self.outer_node = outer_node
    
    def clear(self):
        self.graph_edges = {}
        self.nid_list = []
        self.node_list = []
        self.topological_task_queue = []
        
    def add_edge(self, parent, cur):
        # 添加边<parent, cur>
        assert parent.nid in self.graph_edges
        self.graph_edges[parent.nid].append(cur)
    
    def add_node(self, node):
        if node.nid in self.nid_list:
            raise Exception("Duplicate Node")
        self.nid_list.append(node.nid)
        self.node_list.append(node)
        self.graph_edges[node.nid] = []

    def topological_sort(self, mode="bfs"):
        # mode is bfs or dfs
        # 返回拓扑排序好的节点顺序
        queue = []
        visited_nids = set()
        # 入度数量
        in_degree_recorder = defaultdict(int)
        # 遍历出边
        for par_idx, childs in self.graph_edges.items():
            for child in childs:
                in_degree_recorder[child.nid] += 1
        # print(in_degree_recorder)            
        if mode == "bfs":
            while len(queue) != len(self.node_list):
                # 获取所有入度为0的节点，加入拓扑序列
                current_batch_nids = []
                for node in self.node_list:
                    if in_degree_recorder.get(node.nid, 0) == 0 and node.nid not in visited_nids:
                        queue.append(node)
                        visited_nids.add(node.nid)
                        current_batch_nids.append(node.nid)
                # 重新计算子节点入度
                for nid in current_batch_nids:
                    for child in self.graph_edges[nid]:
                        in_degree_recorder[child.nid] -= 1
                # print(queue)
                # print(in_degree_recorder)
                # 若没有遍历到任何节点，且有节点没有选到，则说明存在错误
                if len(current_batch_nids) == 0 and len(queue) != len(self.node_list):
                    raise Exception("Error, some node is not reachable")
        elif mode == "dfs":
            raise Exception("Error! the topological_sort mode () is unvalid".format(mode))
        else:
            raise Exception("Error! the topological_sort mode () is unvalid".format(mode))
        self.topological_task_queue = queue
        return queue

    def to_json(self):
        json_ret = {
            "task_list": [node.task_str() for node in self.topological_task_queue],
            "topological_task_queue": [node.to_json() for node in self.topological_task_queue]
        }
        return json_ret
        
        
class TaskStatus(Enum):
    # 依赖节点尚未执行完毕
    NOT_READY = 1 
    # 依赖节点均执行完毕，可以开始执行
    READY = 2 
    # 需要通过依赖节点进行更新
    NEED_UPDATE = 3
    # 内部节点均执行完毕，需要执行收拢操作
    FINAL_TO_FINISH = 4
    # 收拢操作执行完毕，需要进行后验反思
    NEED_POST_REFLECT = 5
    # 规划-规划反思-执行-后验反思全部完成且通过
    FINISH = 6
    # 规划完成
    PLAN_DONE = 7
    # 内部节点执行中 = 规划反思完成
    DOING = 8
    # 任务失败
    FAILED = 9

    
class NodeType(Enum):
    PLAN_NODE = 1
    EXECUTE_NODE = 2
# class CustomizeEncoder(json.JSONEncoder):
#     def default(self, obj):
#         if isinstance(obj, Enum):
#             return obj.name  # 或者使用 obj.value,取决于你想序列化名称还是值
#         return super().default(obj)
   
def process_all_node_to_node_str(obj):
    if isinstance(obj, dict):
        str_obj = {}
        for k, v in obj.items():
            str_obj[k] = process_all_node_to_node_str(v)
    elif isinstance(obj, list):
        str_obj = []
        for v in obj:
            str_obj.append(process_all_node_to_node_str(v))
    elif isinstance(obj, AbstractNode):
        str_obj = str(obj)
    else:
        str_obj = str(obj)
        # raise NotImplementedError("No such class for node convert: {}".format(type(obj).__name__))
    return str_obj
        

class AbstractNode(ABC):
    def __init__(self, config, nid, node_graph_info, 
                       task_info, node_type=None):
        """
        node_graph_info:
            - outer_node：归属的外层节点
            - root_node：整个嵌套任务的根节点
            - parent_nodes：该节点在当前所属Graph的依赖节点
            - layer：该节点所处层数，root为0
        task_info:
            - goal: 任务目标
            - inclusion
            - exclusion
            - verify_standard
            - task_type
        """
        self.config = config
        self.nid = nid
        self.hashkey = str(uuid.uuid4())
        self.node_graph_info = node_graph_info
        self.task_info = task_info
        self.inner_graph = Graph(self)     # 内部Planning Graph
        self.raw_plan = None # planner返回的raw plan，以JSON格式表示
        self.node_type = node_type  # 节点类型
        self.status = TaskStatus.NOT_READY  # 执行状态，默认为NOT_READY
        self.agent_proxy = AgentProxy(config)
        
        # Result
        self.result = {}
        
        # -------- 状态定义 -------
        self.status_list = {
            "silence": [],
            "suspend": [],
            "activate": []
        }

        # Status-Condtion-Action-NextStatus mapping
        self.status_action_mapping = {}
        # Status-Condtion-NextStatus mapping
        self.status_exam_mapping = {}
        
        self.define_status()
        self.check_status_valid()
 
    @property
    def required_task_info_keys(self):
        require_keys = self.config["require_keys"][self.task_type_tag]
        return require_keys

    @property
    def task_type_tag(self):
        if self.config.get("no_type", False):
            return "通用"
        return self.config["tag2task_type"][self.task_info["task_type"]]
        
    # ----- 状态定义 -------
    @abstractmethod
    def define_status(self):
        return
    
    @abstractmethod
    def get_node_final_info(self):
        pass

    @abstractmethod
    def get_node_final_result(self):
        pass
    
    def get_outer_write_task(self):
        cur_node = self.node_graph_info["outer_node"] if self.node_type == NodeType.EXECUTE_NODE else self
        outer_node = cur_node.node_graph_info["outer_node"]
        return outer_node

    @property
    def is_atom(self):
        return ((self.node_type == NodeType.EXECUTE_NODE) and (len(self.node_graph_info["outer_node"].topological_task_queue) == 1))
    
    
    def get_direct_depend_write_task(self):
        cur_node = self.node_graph_info["outer_node"] if self.node_type == NodeType.EXECUTE_NODE else self
        outer_node = cur_node.node_graph_info["outer_node"]
            
        logger.error("Current: {}\t\tOuter: {}".format(
            cur_node, outer_node
        ))
        if outer_node is None:
            return None
        graph = outer_node.inner_graph.topological_task_queue
        depend_write_tasks = []
        for node in graph:
            if node.task_type_tag == "写作":
                for par_node in node.node_graph_info["parent_nodes"]:
                    if par_node.nid == cur_node.nid:
                        depend_write_tasks.append(node)
        logger.error(str(depend_write_tasks))
        return depend_write_tasks

    def get_all_previous_writing_plan(self):
        all_tasks = []
        # dfs traverse, exclude search and think task, 
        def inner(cur_node, prefix_tab, cur_write_id_list):
            layer = cur_node.node_graph_info["layer"]
            if (cur_node.node_type == NodeType.EXECUTE_NODE) and (len(cur_node.node_graph_info["outer_node"].topological_task_queue) == 1):
                # 兼容一下老版本和新版本，新版本execute节点直接指定，老版本execute节点会是一个内部节点（只有一个的graph），只有后者的情况才需要
                return None
            if cur_node.task_type_tag != "写作":
                return None
            
            if not self.config.get("offer_global_writing_plan", False):
                if (cur_node.status not in (TaskStatus.FINISH, TaskStatus.DOING)) and (cur_node.hashkey != self.hashkey):
                    return None
            
            content = "{}【{}】.{}: {}".format(prefix_tab, ".".join(map(str, cur_write_id_list)), cur_node.task_info["length"], cur_node.task_info["goal"])
            all_tasks.append(content)
            
            if cur_node.status == TaskStatus.FINISH:
                all_tasks[-1] += " :**FINISHED**"
            elif cur_node.status == TaskStatus.DOING:
                all_tasks[-1] += " :**DOING**"
                widx = 1
                for next_node in cur_node.topological_task_queue:
                    if next_node.task_type_tag != "写作": continue
                    inner(next_node, prefix_tab+"\t", deepcopy(cur_write_id_list) + [widx])
                    widx += 1
            else:
                if cur_node.hashkey == self.hashkey:
                    all_tasks[-1] += " :**You Need To Write**"
                else:
                    all_tasks[-1] += " :**Not Started Yet, You should avoid content related to this part**"  

        inner(self.node_graph_info["root_node"], "", [])
        if len(all_tasks) > 0:
            all_tasks = all_tasks[1:]
        return "\n".join(all_tasks)
        

    def get_all_layer_plan(self):
        # if self.task_type_tag == "写作"
        target_layer = self.node_graph_info["layer"] + 1
        def inner(cur_node):
            layer = cur_node.node_graph_info["layer"]
            if (cur_node.node_type == NodeType.EXECUTE_NODE) and (len(cur_node.node_graph_info["outer_node"].topological_task_queue) == 1):
                # 兼容一下老版本和新版本，新版本execute节点直接指定，老版本execute节点会是一个内部节点（只有一个的graph），只有后者的情况才需要
                return None
            if layer <= target_layer:
                plan_node = {
                    "id": cur_node.nid,
                    "task_type": cur_node.task_info["task_type"],
                    "goal": cur_node.task_info["goal"],
                    "dependency": [n.nid for n in cur_node.node_graph_info["parent_nodes"] if n.task_type_tag != "写作"],
                    "finish": cur_node.status == TaskStatus.FINISH,
                    "is_current_to_plan_task": cur_node.hashkey == self.hashkey,
                    "sub_tasks": []
                }
                if layer < target_layer:
                    sub_tasks = [inner(child) for child in cur_node.topological_task_queue]
                    sub_tasks = [st for st in sub_tasks if st is not None]
                    plan_node["sub_tasks"] = sub_tasks
                return plan_node
    
        plan_json = inner(self.node_graph_info["root_node"])
        return plan_json
        
    def get_all_lt_layer_plan(self):
        # 所有layer 小于等于的都添加
        plan_string = []
        target_layer = self.node_graph_info["layer"]
        def inner(cur_node, prefix_tab):
            layer = cur_node.node_graph_info["layer"]
            if (cur_node.node_type == NodeType.EXECUTE_NODE) and (len(cur_node.node_graph_info["outer_node"].topological_task_queue) == 1):
                # 兼容一下老版本和新版本，新版本execute节点直接指定，老版本execute节点会是一个内部节点（只有一个的graph），只有后者的情况才需要return
                return
            if layer <= target_layer:
                if cur_node.hashkey == self.hashkey:
                    content = "{}**{}.{} {}**".format(
                        prefix_tab, cur_node.nid, 
                        "【{}】".format(cur_node.task_info["task_type"]) if cur_node.task_info["task_type"] != "" else "", cur_node.task_info["goal"]
                    )
                else:
                    content = "{}{}.{} {}".format(
                        prefix_tab, cur_node.nid, 
                        "【{}】".format(cur_node.task_info["task_type"]) if cur_node.task_info["task_type"] != "" else "", cur_node.task_info["goal"]
                    )
                plan_string.append(content)
                for next_node in cur_node.topological_task_queue:
                    inner(next_node, prefix_tab+"\t")
        inner(self.node_graph_info["root_node"], "")
        return "\n".join(plan_string)

    # 状态检查
    def check_status_valid(self):
        assert "silence" in self.status_list
        assert "suspend" in self.status_list
        assert "activate" in self.status_list
        
        # 当且仅当激活类型的状态注册可执行的动作，且全部必需注册
        for status in self.status_list["activate"]:
            if status not in self.status_action_mapping:
                raise Exception("status {} is activate status but not register action".format(status))
        for status in self.status_action_mapping.keys():
            if status not in self.status_list["activate"]:
                raise Exception("status {} register action but is not activate category".format(status))

        
        # 当且仅当挂起类型（和not ready）的状态必需注册检查条件，且全部必须注册
        for status in self.status_list["suspend"]:
            if status not in self.status_exam_mapping:
                raise Exception("status {} is activate status but not register exam condition".format(status))
        for status in self.status_exam_mapping.keys():
            if status not in self.status_list["suspend"]:
                raise Exception("status {} register action but is not suspend category".format(status))
        
        return True
        
    # ======= Run =======
    def next_action_step(self, memory, *args, **kwargs): 
        # --- RUN ---
        if not self.is_activate:
            raise NotImplementedError("Error Status process, status ({}) is not actiavate category".format(self.status))
        
        for condition_func, action_name, next_status in self.status_action_mapping[self.status]:
            if condition_func(self, memory, *args, **kwargs):
                logger.info("Do Action: {}, make {} -> {}".format(action_name, self.status, next_status))
                self.do_action(action_name, memory, *args, **kwargs)
                self.status = next_status
                break
        else: # 没有找到条件，报错！action必须找到条件
            raise Exception("No Condition Matched for status action, Error!")
    
        return action_name

    # ======= Exam =======
    def do_exam(self, verbose):
        if not self.is_suspend:
            raise NotImplementedError("Error Status process, status ({}) is not suspend category".format(self.status))
        for condition_func, next_status in self.status_exam_mapping[self.status]:
            # print(self.status, condition_func, next_status,)
            # if self.status == TaskStatus.NOT_READY:
                # print(self.node_graph_info["outer_node"] == TaskStatus.DOING)
                # print(len(self.node_graph_info["parent_nodes"]) == 0 )
                # print((len(self.node_graph_info["parent_nodes"]) == 0 or
                #      all([parent.status == TaskStatus.FINISH for parent in self.node_graph_info["parent_nodes"]])))
            if condition_func(self):
                if verbose:
                    logger.info("Do Exam, {}:{} make {} -> {}".format(self.nid, self.task_info["goal"], self.status, next_status))
                self.status = next_status
                break

    # ======= Save and display Part ======
    def __str__(self):
        return self.task_str()
    
    def task_str(self):
        if self.task_type_tag == "写作":
            tag = "【{}.{}】".format(self.task_info["task_type"], self.task_info["length"])
        elif self.task_type_tag != "":
            tag = "【{}】".format(self.task_info["task_type"])
        else:
            tag = ""
            
        return "{}{}{}.({}).{:10s}: {}".format(
            self.nid,
            "" if self.node_type == NodeType.PLAN_NODE else "*",
            tag, 
            self.task_info["goal"],
            ",".join(str(x.nid) for x in self.node_graph_info["parent_nodes"] if x.task_type_tag != "写作"),
            self.status.name,
        )

    def __repr__(self):
        return self.__str__()

    def to_json(self):
        obj = {
            "nid": self.nid,
            "task_info": process_all_node_to_node_str(self.task_info),
            "node_graph_info": process_all_node_to_node_str(self.node_graph_info),
            "raw_plan": self.raw_plan,
            "node_type": self.node_type.name,
            "status": self.status.name,
            "result": self.result,
            "inner_graph": self.inner_graph.to_json()
        }
        return obj

    @property
    def topological_task_queue(self):
        # TODO：有可能需要考虑下plan node和execute node的区别
        return self.inner_graph.topological_task_queue
    
    # ===== Status category ==========
    @property
    def is_silence(self):
        return self.status in self.status_list["silence"]
    
    @property
    def is_suspend(self):
        return self.status in self.status_list["suspend"]
    
    @property
    def is_activate(self):
        return self.status in self.status_list["activate"]
    
    # ===== Utils ====
    def plan2graph(self, raw_plan):
        if len(raw_plan) == 0: # 原子任务，依然创建执行图，但执行图只有一个execute节点，遍历required_task_info_keys并获取
            raw_plan.append({
                "id": 0,
                "dependency": [],
                "atom": True,
            })
            for key in self.required_task_info_keys:
                if key not in raw_plan[-1]:
                    raw_plan[-1][key] = self.task_info[key]
        # raw plan is a jsonlist
        nodes = []
        id2node = {}
        for task in raw_plan:
            task["goal"] = task["goal"].replace("\n", ";")
            node_graph_info = {
                "outer_node": self,
                "root_node": self.node_graph_info["root_node"],
                "parent_nodes": task["dependency"],
                "layer": self.node_graph_info["layer"] + 1
            }
            if self.config["tag2task_type"][task["task_type"]] == "写作":
                # 若是唯一的写作任务，可以通过规则赋值length
                if len([st for st in raw_plan if self.config["tag2task_type"][st["task_type"]] == "写作"]) == 1:
                    if "length" not in task:
                        task["length"] = self.task_info["length"]

            task_info = {key:task[key] for key in self.config["require_keys"][self.config["tag2task_type"][task["task_type"]]]}
            
            # Bug Fix: sub_tasks, older one is sub_task, make all candidate_plan missing
            if "sub_tasks" in task:
                task_info["candidate_plan"] = task["sub_tasks"]
                for st in task["sub_tasks"]:
                    st["goal"] = st["goal"].replace("\n", ";")
            else:
                task_info["candidate_plan"] = "Missing" # older one is "空缺"
 
            node = self.__class__(
                config = self.config,
                nid = task["id"],
                node_graph_info = node_graph_info,
                task_info = task_info,
                node_type = NodeType.PLAN_NODE if not task.get("atom") else NodeType.EXECUTE_NODE
            )
            nodes.append(node)
            id2node[task["id"]] = node
            
        # Modify dependency for reasoning tasks, all reasoning tasks must dependent all previous reasoning tasks
        sorted_nodes = sorted(nodes, key=lambda x: int(str(x.nid).split(".")[-1]))
        for i in range(len(sorted_nodes)):
            cur = sorted_nodes[i]
            parent_nodes = cur.node_graph_info["parent_nodes"]
            if cur.task_type_tag == "推理":
                for j in range(i):
                    if sorted_nodes[j].task_type_tag == "推理" and sorted_nodes[j].nid not in parent_nodes:
                        parent_nodes.append(sorted_nodes[j].nid)
                cur.node_graph_info["parent_nodes"] = sorted(parent_nodes, key=lambda x: int(str(x).split(".")[-1]))
            
        # 在这里处理写作任务之间的隐含依赖关系（顺序性）
        prev_action_node = []
        for node in sorted(nodes, key=lambda x: int(str(x.nid).split(".")[-1])):
            if node.task_type_tag == "写作":
                for prev in prev_action_node:
                    if prev.nid not in node.node_graph_info["parent_nodes"]:
                        node.node_graph_info["parent_nodes"].append(prev.nid)
                node.node_graph_info["parent_nodes"] = node.node_graph_info["parent_nodes"]
                prev_action_node.append(node)
        # 替换parent node为真实node，
        for node in nodes:
            # 过滤掉不合法的dependency
            node.node_graph_info["parent_nodes"] = [id2node[str(nid)] for nid in node.node_graph_info["parent_nodes"] if str(nid) in id2node]
        # 建立Graph
        self.inner_graph.clear()
        # 添加节点
        for node in nodes:
            self.inner_graph.add_node(node)
        # 添加边
        for node in nodes:
            for parent_node in node.node_graph_info["parent_nodes"]:
                self.inner_graph.add_edge(parent_node, node)
        self.inner_graph.topological_sort()
        return
    
    def do_action(self, action_name, memory, *args, **kwargs):
        agent = self.agent_proxy.proxy(action_name)
        result = getattr(self, action_name)(
            agent, memory, *args, **kwargs   
        )
        # 保存信息
        self.result[action_name] = {
            "result": result,
            "time": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "agent": self.config["action_mapping"][action_name]
        }
        
        if action_name not in ("update", "prior_reflect", "planning_post_reflect", "execute_post_reflect"):
            if not (action_name in ("execute", "final_aggregate") and self.task_type_tag == "搜索"): 
                logger.info("{} Action: {} Result: \n{}".format(
                    self.task_str(), action_name, json.dumps(self.result[action_name], ensure_ascii=False, indent=4)
                ))
        return result
    

@task_register.register_module()
class RegularDummyNode(AbstractNode):   
    @overrides
    def get_node_final_info(self):
        if self.node_type is NodeType.PLAN_NODE:
            if self.status == TaskStatus.FINISH:
                return self.result["final_aggregate"]
            else:
                return None
        elif self.node_type is NodeType.EXECUTE_NODE:
            if self.status == TaskStatus.FINISH:
                # return self.result["execute"]['result']
                return self.result["execute"] # {"result": {"original": "xxx", "result": "xxx"}}
            else:
                return None
        else:
            raise NotImplementedError()

    @overrides
    def get_node_final_result(self):
        final_info = self.get_node_final_info()
        if final_info is None:
            return None
        return final_info["result"]
 
    @overrides
    def define_status(self):
        self.status_list = {
            "silence": [TaskStatus.FINISH, TaskStatus.FAILED],
            "suspend": [TaskStatus.NOT_READY, TaskStatus.DOING],
            "activate": [
                TaskStatus.READY,
                TaskStatus.NEED_UPDATE,
                TaskStatus.PLAN_DONE,
                TaskStatus.FINAL_TO_FINISH,
                TaskStatus.NEED_POST_REFLECT,
            ]
        }
        self.status_action_mapping = {
            # key is status, value is (condition, action_name, next_status)
            # plan node ready时执行plan，execute node ready时执行execute
            TaskStatus.READY: [
                (lambda node, *args, **kwargs: node.node_type == NodeType.PLAN_NODE,
                 "plan",
                 TaskStatus.PLAN_DONE),
                (lambda node, *args, **kwargs: node.node_type == NodeType.EXECUTE_NODE,
                 "execute",
                 TaskStatus.NEED_POST_REFLECT)
            ],
            TaskStatus.NEED_UPDATE: [
                (lambda node, *args, **kwargs: True,
                 "update",
                 TaskStatus.READY),
            ],
            # plan_done时，执行完plan反思，直接进入doing，不再设置plan_reflect_done状态
            TaskStatus.PLAN_DONE: [
                (lambda node, *args, **kwargs: True,
                 "prior_reflect",
                 TaskStatus.DOING),
            ],
            TaskStatus.FINAL_TO_FINISH: [
                (lambda node, *args, **kwargs: True,
                 "final_aggregate",
                 TaskStatus.NEED_POST_REFLECT),
            ],
            TaskStatus.NEED_POST_REFLECT: [
                (lambda node, *args, **kwargs: node.node_type == NodeType.PLAN_NODE,
                 "planning_post_reflect",
                 TaskStatus.FINISH),
                (lambda node, *args, **kwargs: node.node_type == NodeType.EXECUTE_NODE,
                 "execute_post_reflect",
                 TaskStatus.FINISH)
            ],
        }
        # key is status, value is (condition, next_status)
        self.status_exam_mapping = {
            TaskStatus.NOT_READY: [
                # 外部节点进入doing状态，无依赖节点时，直接进入ready状态
                (lambda node, *args, **kwargs: node.node_graph_info["outer_node"].status == TaskStatus.DOING and \
                                               len(node.node_graph_info["parent_nodes"]) == 0,
                 TaskStatus.READY),
                # 外部节点进入doing状态，有依赖节点且依赖节点均finish时，进入need_update状态
                (lambda node, *args, **kwargs: node.node_graph_info["outer_node"].status == TaskStatus.DOING and \
                                               all([parent.status == TaskStatus.FINISH for parent in node.node_graph_info["parent_nodes"]]),
                 TaskStatus.NEED_UPDATE),
            ],
            # 内部节点全部finish时，变为final_to_finish，开始汇聚信息
            TaskStatus.DOING: [
                (lambda node, *args, **kwargs: all([inner_node.status == TaskStatus.FINISH for inner_node in node.topological_task_queue]),
                TaskStatus.FINAL_TO_FINISH)
            ],
        }


    def plan(self, agent, memory, *args, **kwargs):
        # 组装数据
        # agent的plan
        result = agent.forward(self, memory, *args, **kwargs)
        self.raw_plan = result["result"]            
        # 解析agent产生的规划
        self.plan2graph(self.raw_plan)
        return result

    # def update(self, agent, memory, *args, **kwargs):
    #     result = agent.forward(self, memory, *args, **kwargs)
    #     self.task_info["goal"] = result["result"]
    #     return result

    # def update(self, agent, memory, *args, **kwargs):
    #     result = agent.forward(self, memory, *args, **kwargs)
    #     # for key in ("goal", "inclusion", "exclusion", "verify_standard"):
    #     for key in ("goal", "inclusion", "exclusion"):
    #         self.task_info[key] = result["result"][key]
    #     return result

    def update(self, agent, memory, *args, **kwargs):
        result = agent.forward(self, memory, *args, **kwargs)
        # for key in ("goal", "inclusion", "exclusion", "verify_standard"):
        # for key in ("goal", "inclusion", "exclusion"):
        #     self.task_info[key] = result["result"][key]
        return result
    
        
    def execute(self, agent, memory, *args, **kwargs):
        result = agent.forward(self, memory, *args, **kwargs)
        return result
    
    def prior_reflect(self, agent, memory, *args, **kwargs):
        result = agent.forward(self, memory, *args, **kwargs)
        return result
    
    def planning_post_reflect(self, agent, memory, *args, **kwargs):
        result = agent.forward(self, memory, *args, **kwargs)
        return result

    def execute_post_reflect(self, agent, memory, *args, **kwargs):
        result = agent.forward(self, memory, *args, **kwargs)
        return result

    def final_aggregate(self, agent, memory, *args, **kwargs):
        if len(self.topological_task_queue) == 1 and self.topological_task_queue[0].node_type == NodeType.EXECUTE_NODE:
            return self.topological_task_queue[0].get_node_final_result()
        else:
            result = agent.forward(self, memory, *args, **kwargs)
        return result


if __name__ == "__main__":
    pass
    