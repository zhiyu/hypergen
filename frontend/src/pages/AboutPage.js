import React from "react";
import { Container, Typography, Box, Grid } from "@mui/material";

import {
  Tabs,
  Tab,
  Chip,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Link,
  Divider,
} from "@heroui/react";

const AboutPage = () => {
  return (
    <Container maxWidth="lg">
      <div className="mt-12">
        <Card className="border border-gray-light shadow-lg shadow-gray-light p-2">
          <CardHeader className="block">
            <Typography component="div" sx={{ fontWeight: 700 }}>
              概述
            </Typography>
          </CardHeader>
          <CardBody>
            <Typography variant="body1" paragraph>
              异构递归规划（Heterogeneous Recursive
              Planning）是一种面向长文本创作的通用智能体框架，它通过递归式任务分解与动态整合三种基础任务类型（检索、推理、组合），实现类人类的自适应写作能力，是AI内容生成领域的一项重大突破。
            </Typography>

            <Typography variant="body1" paragraph>
              与传统依赖预设流程和固定思维模式的方法不同，该框架具有以下特性：
            </Typography>

            <div className="flex flex-col gap-2 mb-4">
              <div>
                1. <strong>消除工作流限制</strong>{" "}
                通过递归任务分解与执行交替进行的规划机制，打破线性工作流约束。
              </div>
              <div>
                2. <strong>支持异构任务分解n</strong>{" "}
                融合不同任务类型实现多层次创作需求。
              </div>
              <div>
                3. <strong>动态适配</strong>{" "}
                在写作过程中持续自我优化，模拟人类写作的适应性行为。
              </div>
            </div>

            <Typography variant="body1" paragraph>
              我们在小说创作与技术报告生成任务上的实验表明，该方法在所有评估指标上均显著优于当前最先进方案。
            </Typography>
          </CardBody>
        </Card>
      </div>

      <div className="my-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="border border-gray-light shadow-lg shadow-gray-light p-2 hover:shadow-gray-dark hover:scale-105">
            <CardHeader className="block">
              <Typography component="div" sx={{ fontWeight: 700 }}>
                关键特性
              </Typography>
            </CardHeader>
            <CardBody className="gap-2">
              <div>
                <strong>递归式任务分解与执行</strong> -
                将复杂写作任务拆解为可处理的子任务
              </div>
              <div>
                <Typography variant="body1">
                  <strong>多类型任务动态整合</strong> -
                  无缝协调检索、推理与创作三大功能
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <strong>写作过程灵活调适</strong> -
                  根据上下文演进实时调整规划方案
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <strong>多领域写作支持</strong> -
                  同时适用于创意小说与技术报告撰写
                </Typography>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-light shadow-lg shadow-gray-light p-2 hover:shadow-gray-dark hover:scale-105">
            <CardHeader className="block">
              <Typography component="div" sx={{ fontWeight: 700 }}>
                技术实现
              </Typography>
            </CardHeader>
            <CardBody>
              <Typography variant="body1" paragraph>
                该框架采用​​任务图谱架构​​，将写作任务表示为具有依赖关系的节点。每个节点可属于以下三种类型之一：
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>创作（写作）</strong> - 生成实际文本内容
                </Typography>
                <Typography variant="body1">
                  <strong>检索（搜索）</strong> - 收集相关信息
                </Typography>
                <Typography variant="body1">
                  <strong>推理（思考）</strong> - 进行分析与规划
                </Typography>
              </Box>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default AboutPage;
