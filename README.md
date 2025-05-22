## HyperGen

HyperGen 是一个参考 [WriteHERE](https://github.com/principia-ai/WriteHERE) 开发的长文本生成应用，对 WriteHERE 原有功能和交互设计进行了优化和调整，同时增加了多语言、多租户、多场景等产品功能的支持。

<p align="center">
  <a href="https://arxiv.org/abs/2503.08275"><img src="https://img.shields.io/badge/arXiv-2503.08275-b31b1b.svg" alt="arXiv"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

### 路线图

- 多语言支持 ( in progress )
- 多租户支持 ( in progress )
- 多场景支持 ( in progress )
- OpenAI-compatible API 支持 ( in progress )
- searxng 支持 ( 已完成 )
- WriteHERE 代码优化 ( in progress )

### 应用截屏

##### 首页

![screenshots](./assets/1.png)

##### 报告生成页面

![screenshots](./assets/2.png)

##### 生成结果页面

![screenshots](./assets/3.png)

### 安装

#### 下载项目代码到本地

```bash
git clone https://github.com/zhiyu/hypergen
cd hypergen
```

#### 安装 uv

参考 https://docs.astral.sh/uv/getting-started/installation/

#### 创建 Python 虚拟环境

```bash
uv venv
```

##### 启动后端服务

1. 安装依赖:

```bash
uv pip install -v -e .
uv sync
```

2. 启动服务:

```bash
uv run python  backend/server.py
```

##### 启动前端服务

1. 安装依赖:

```bash
cd frontend
npm install
```

2. 启动服务:

```bash
npm start
```

### License

[MIT License](LICENSE)
