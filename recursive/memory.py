#coding: utf8
from copy import deepcopy
from collections import defaultdict
import re
from recursive.cache import Cache


article = ""
caches = {
    "search": None,
    "llm": None,
    "web_page": None
}

class Memory:
    def __init__(self, root_node, format, config):
        self.root_node = root_node
        self.init()
        self.database = {} 
        self.load_database()
        self.format = format
        self.config = config
        self.article = ""
        self.all_search_results = []
        self.global_start_index = 1
        assert self.format in ("xml", "nl")
        
        
    def add_search_result(self, page):
        # page["global_index"] = len(self.all_search_results) + 1
        self.all_search_results.append(page)
        self.global_start_index += 1
        return page
  

    def init(self):
        self.info_nodes = {
            self.root_node.hashkey: InfoNode(
                self.root_node.hashkey, self.root_node.nid, None, [], 0, self.root_node.task_info)
        } # key: hashkey, value: infonode

    def save(self, folder):
        import json
        with open("{}/memory.jsonl".format(folder), "w") as f:
            f.write(json.dumps({
                "article": self.article,
                "all_search_results": self.all_search_results
            }, ensure_ascii=False))

    def load(self, folder):
        return
            
    def database_set(self, key, value):
        # if self.multiprocess_manager is not None:
        self.database[key] = value
       
    def get_database_key(self, key):
        pass
            
    def load_database(self):
        pass

    def collect_infos(self, node_list):
        self.init()
        def inner(node):
            if node.hashkey in self.info_nodes:
                return self.info_nodes[node.hashkey]
            # 若不存在则创建新的infoNode
            # 先创建其外部节点和依赖节点
            outer_info_node = inner(node.node_graph_info["outer_node"])
            parent_info_nodes = [inner(parent) for parent in node.node_graph_info["parent_nodes"]]
        
            info = deepcopy(node.task_info)
            info["final_result"] = node.get_node_final_result()
            
            info_node = InfoNode(node.hashkey, node.nid, outer_info_node, parent_info_nodes, 
                                 node.node_graph_info["layer"], info)
            self.info_nodes[node.hashkey] = info_node
            return info_node
        for node in node_list:
            inner(node)
            
    def update_infos(self, node_list):
        """
        node_list是需要更新信息的node
        """
        self.collect_infos(node_list)

    def _process_node_info(self, cur):
        if self.format == "xml":
            content = """
    <任务 id={}>
    <依赖任务>
    {}
    </依赖任务>
    <任务目标>
    {}
    </任务目标>
    <任务结果>
    {}
    </任务结果>
    </任务>
    """.format(cur.nid, 
            ",".join(str(par.nid) for par in cur.parent_nodes) if len(cur.parent_nodes) > 0 else "无", 
            cur.info["goal"], cur.info["final_result"]["result"]).strip()
        elif self.format == "nl":
            content = "{}. {}: \n{}\n".format(cur.nid, cur.info["goal"], cur.info["final_result"]["result"])
        return content 
        
    def get_json_node_info(self, graph_node):
        if graph_node.task_type_tag == "写作":
            return None
        info_node = self.info_nodes[graph_node.hashkey]
        represent = {
            "id": graph_node.nid,
            "task_type": graph_node.task_info["task_type"],
            "goal": graph_node.task_info["goal"],
            "dependency": [n.nid for n in graph_node.node_graph_info["parent_nodes"] if n.task_type_tag != "写作"],
            "result": info_node.info["final_result"]["result"]
        }
        return represent
        
        
    # def _collect_inner_graph_infos(self, graph_node, max_dist=100000):
    #     # return dist_group_precedents, reverse sorted by dist [[dist=k precedents], .., [dist=2 precedents], [dist=1 precedents]]
    #     need_info_nodes = defaultdict(set)
    #     existed_need_info_nodes = set()
    #     def get_need_info_nodes(cur, dist):
    #         if dist >= max_dist or (cur.hashkey in existed_need_info_nodes):
    #             return
    #         need_info_nodes[dist].add(cur.hashkey)
    #         existed_need_info_nodes.add(cur.hashkey)
    #         for par in sorted(cur.parent_nodes, key=lambda x: int(str(x.nid).split(".")[-1])):
    #             get_need_info_nodes(par, dist+1)
        
    #     # 获取所有需要信息的前序节点
    #     for par_graph_node in graph_node.node_graph_info["parent_nodes"]:
    #         par_info_node = self.info_nodes[par_graph_node.hashkey]
    #         get_need_info_nodes(par_info_node, 1)
            
    #     dist_group_precedents = []
    #     for dist, hashkeys in sorted(need_info_nodes.items(), reverse=True):
    #         precedents = sorted([self.info_nodes[hashkey] for hashkey in hashkeys], key=lambda x: int(str(x.nid).split(".")[-1]))
    #         dist_group_precedents.append([])
    #         dist_group_precedents[-1].extend(precedents)
    #         for precedent in precedents: # should be FINISH-ed
    #             dist_group_precedents[-1].append(precedent)
    #     return dist_group_precedents

    def _collect_inner_graph_infos(self, graph_node, max_dist=100000):
        # return dist_group_precedents, reverse sorted by dist [[dist=k precedents], .., [dist=2 precedents], [dist=1 precedents]]
        need_info_nodes = defaultdict(set)
        existed_need_info_nodes = set()
        
        def get_need_info_nodes(cur, dist):
            if dist > max_dist or (cur.hashkey in existed_need_info_nodes):
                return
            need_info_nodes[dist].add(cur)
            existed_need_info_nodes.add(cur.hashkey)
            for par in sorted(cur.node_graph_info["parent_nodes"], key=lambda x: int(str(x.nid).split(".")[-1])):
                get_need_info_nodes(par, dist+1)

        # 获取所有需要信息的前序节点
        for par_graph_node in graph_node.node_graph_info["parent_nodes"]:
            get_need_info_nodes(par_graph_node, 1)
            
        dist_group_precedents = []
        for dist, precedents in sorted(need_info_nodes.items(), reverse=True): # dist从大到小排序
            precedents = sorted(precedents, key=lambda x: int(str(x.nid).split(".")[-1])) # 同距离的父节点，按照创建顺序来排序
            dist_group_precedents.append(precedents)
        return dist_group_precedents
    
   
    def _collect_outer_infos(self, node):
        # return outer infos until the root
        # for outer level dependency, only collect dist=1 inner level dependency
        # [[outer_dist precendents with parent dist = M],]
        outer_dependent_nodes = []
        def get_need_info_nodes(cur, dist):
            if cur is None: return
            outer = cur
            outer_inner_dist_group_precedents = self._collect_inner_graph_infos(outer, max_dist=3)
            if "se a 300-word structured response that: 1) Opens with" in node.task_info["goal"]:
                print("outer_inner_dist_group_precedents", outer_inner_dist_group_precedents, flush=True)
            all_outer_inner_dist_group_precedents = []
            if len(outer_inner_dist_group_precedents) > 0: # has level 1
                for each in outer_inner_dist_group_precedents:
                    all_outer_inner_dist_group_precedents.extend(each)
                outer_inner_dist_group_precedents = all_outer_inner_dist_group_precedents
            outer_dependent_nodes.append(outer_inner_dist_group_precedents)
            get_need_info_nodes(outer.node_graph_info["outer_node"], dist+1)
        
        # get all outer_dependent nodes
        get_need_info_nodes(node.node_graph_info["outer_node"], 1)
        # if "se a 300-word structured response that: 1) Opens with" in node.task_info["goal"]:
        #     print("final outer_dependent_nodes")
        #     print(outer_dependent_nodes)
        
        # reverse
        outer_dependent_nodes = outer_dependent_nodes[::-1]
        # if "se a 300-word structured response that: 1) Opens with" in node.task_info["goal"]:
        #     print("final outer_dependent_nodes2")
        #     print(outer_dependent_nodes)
        return outer_dependent_nodes

    
    def collect_node_run_info(self, graph_node):
        # Fix, 
        # if "se a 300-word structured response that: 1) Opens with" in graph_node.task_info["goal"]:
        #     print("graph_node", graph_node)
        #     print(graph_node.is_atom)
            
        
        if graph_node.is_atom:# 原子任务，取得结果设定为其Planning节点
            # graph_node = graph_node.node_graph_info["outer_node"].topological_task_queue[0]
            graph_node = graph_node.node_graph_info["outer_node"]
            
        
        # if "se a 300-word structured response that: 1) Opens with" in graph_node.task_info["goal"]:
        #     print("final graph node", graph_node)
        
        same_graph_precedents = self._collect_inner_graph_infos(graph_node)
        # print("same graph precedents\n{}".format(same_graph_precedents))
        upper_graph_precedents = self._collect_outer_infos(graph_node)
        
        # if "se a 300-word structured response that: 1) Opens with" in graph_node.task_info["goal"]:
        #     print("same graph")
        #     print(same_graph_precedents)
        #     print("\n\n\n")
        #     print("upper graph")
        #     print(upper_graph_precedents)
        #     # exit()
            
        
        # process
        same_graph_precedents_repre = []
        upper_graph_precedents_repre = []
        for dist_nodes in same_graph_precedents:
            for dist_node in dist_nodes:
                repre = self.get_json_node_info(dist_node)
                if repre is not None:
                    same_graph_precedents_repre.append(repre)
        for dist_nodes in upper_graph_precedents:
            cur_dist_repre = []
            for dist_node in dist_nodes:
                repre = self.get_json_node_info(dist_node)
                if repre is not None:
                    cur_dist_repre.append(repre)
            if len(cur_dist_repre) > 0:
                upper_graph_precedents_repre.append(cur_dist_repre)
        
        # if "se a 300-word structured response that: 1) Opens with" in graph_node.task_info["goal"]:
        #     print("upper_graph_precedents_repre")
        #     print(upper_graph_precedents_repre)
        #     exit()
            
        result = {
            "same_graph_precedents": same_graph_precedents_repre,
            "upper_graph_precedents": upper_graph_precedents_repre
        }
        
        return result

        
        
        
    # def collect_node_run_info(self, graph_node, outer_level=0):
    #     precedent_infos = self._collect_precedent_infos(graph_node)
    #     precedent_infos = "\n".join(["\n".join(layer_info) for layer_info in precedent_infos])
    #     outer_infos = self._collect_outer_infos(graph_node)
    #     global_info = "用户原始问题：{}".format(self.root_node.task_info["goal"])
    #     single_outer_info = "本层级整体需要回答的子问题：{}".format(graph_node.node_graph_info["outer_node"].task_info["goal"])
    #     return global_info + "\n\n" + single_outer_info + "\n\n" + "为解决本层级整体子问题，已完成的子问题和答案：\n" + precedent_infos
    #     # return global_info + "\n\n\n" + precedent_infos
    
    # def collect_node_run_info_seperate_direct_precedent(self, graph_node, add_prefix=True, outer_level=0, merge_background_and_direct=False):
    #     precedent_infos = self._collect_precedent_infos(graph_node)
    #     background = []
    #     direct = []
    #     if len(precedent_infos) > 0:
    #         direct = precedent_infos[-1]
    #         background = precedent_infos[:-1]
    #         direct_precedent_infos = "\n\n".join(direct)
    #         background_precedent_infos = "\n\n".join(["\n\n".join(x) for x in background]) if len(background) > 0 else "无"
    #     else:
    #         background_precedent_infos = "无"
    #         direct_precedent_infos = "无"
            
    #     global_info = self.root_node.task_info["goal"]
    #     if graph_node.node_graph_info["outer_node"] is not None:
    #         single_outer_info = graph_node.node_graph_info["outer_node"].task_info["goal"]
    #     else:
    #         single_outer_info = self.root_node.task_info["goal"]
    #     # direct_precedent_infos = direct_precedent_infos
    #     # background_precedent_infos = background_precedent_infos
        
    #     if add_prefix:
    #         global_info = "原始问题（根问题）：{}".format(global_info)
    #         single_outer_info = "本层级整体需要回答的子问题：{}".format(single_outer_info)
    #         background_precedent_infos = "为解决本层级整体子问题，已完成的子问题和答案：\n" + background_precedent_infos
    #         direct_precedent_infos = direct_precedent_infos
            
    #     if merge_background_and_direct:
    #         if direct_precedent_infos != "无":
    #             background_precedent_infos += "\n\n" + direct_precedent_infos 
    #         return {
    #             "global": global_info,
    #             "single_out": single_outer_info,
    #             "background_precedent": background_precedent_infos,
    #         }
    #     else:
    #         return {
    #             "global": global_info,
    #             "single_out": single_outer_info,
    #             "background_precedent": background_precedent_infos,
    #             "direct_precedent": direct_precedent_infos
    #         }

class InfoNode:
    def __init__(self, hashkey, nid, outer_node, parent_nodes, layer, info):
        self.hashkey = hashkey
        self.nid = nid
        self.outer_node = outer_node
        self.parent_nodes = parent_nodes
        self.layer = layer
        self.info = info