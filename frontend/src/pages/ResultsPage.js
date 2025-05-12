import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Link,
  Accordion,
  AccordionItem,
  Chip,
  addToast,
  ToastProvider,
  Progress,
} from "@heroui/react";

import {
  PiImage,
  PiMusicNotes,
  PiVideoCamera,
  PiArrowRight,
  PiMagnifyingGlass,
  PiBrain,
  PiPencilSimpleLine,
  PiFileText,
  PiFiles,
  PiTreeStructure,
} from "react-icons/pi";

import LiveTaskList from "../components/LiveTaskList";
import LiveTaskResult from "../components/LiveTaskResult";

import {
  getGenerationStatus,
  getGenerationResult,
  getTaskGraph,
  reloadTasks,
  stopTask,
} from "../utils/api";

// Mock data for task graph - this would come from your backend in a real implementation
const mockGraphData = {
  id: "",
  goal: "Write a report on AI writing agents",
  task_type: "write",
  status: "FINISH",
  sub_tasks: [
    {
      id: "0",
      goal: "Plan the report structure",
      task_type: "think",
      status: "FINISH",
      sub_tasks: [],
    },
    {
      id: "1",
      goal: "Research commercial applications",
      task_type: "search",
      status: "FINISH",
      sub_tasks: [],
    },
    {
      id: "2",
      goal: "Analyze market trends",
      task_type: "think",
      status: "FINISH",
      sub_tasks: [],
    },
    {
      id: "3",
      goal: "Write introduction",
      task_type: "write",
      status: "FINISH",
      sub_tasks: [],
    },
    {
      id: "4",
      goal: "Write benefits section",
      task_type: "write",
      status: "FINISH",
      sub_tasks: [],
    },
    {
      id: "5",
      goal: "Write challenges section",
      task_type: "write",
      status: "FINISH",
      sub_tasks: [],
    },
    {
      id: "6",
      goal: "Write conclusion",
      task_type: "write",
      status: "FINISH",
      sub_tasks: [],
    },
  ],
};

// Mock content for the generated report/story - would come from your backend
const mockContent = `# The Commercial Value of Long-Article Writing AI Agents

## Introduction

Long-article writing AI agents represent a significant advancement in artificial intelligence technology, offering a powerful tool for content creation that combines the efficiency of automation with increasingly sophisticated writing capabilities. These AI agents are designed to generate extended pieces of content—from blog posts and articles to reports and creative narratives—with minimal human intervention. As businesses and organizations continue to prioritize content marketing and information dissemination, the commercial potential of these tools has grown substantially.

## Market Overview

The global market for AI writing tools is experiencing rapid growth, with the long-form content segment emerging as a particularly valuable niche. According to recent market analyses, the AI content creation market is expected to reach $2.6 billion by 2026, with long-form content generation tools representing approximately 35% of this value. This growth is driven by increasing demand for content across multiple industries, from media and publishing to education and enterprise documentation.

## Key Commercial Applications

Long-article writing AI agents offer commercial value across numerous sectors:

### Content Marketing

Content marketing remains one of the primary applications for long-form AI writers. Businesses can generate blog posts, white papers, and industry analyses at scale, maintaining consistent publishing schedules without proportionally increasing their content team. This enables companies to maintain a robust content marketing strategy even with limited human resources.

### Publishing and Media

Media organizations can utilize AI writing agents to produce routine reporting, freeing human journalists to focus on investigative work, interviews, and complex storytelling. This hybrid approach allows publishers to maintain or increase output while directing human talent toward higher-value activities.

### E-commerce

Product descriptions, category pages, and buying guides represent significant content needs for e-commerce businesses. Long-form AI writers can generate detailed product content that incorporates SEO best practices while maintaining consistent brand voice across thousands of products.

### Education and Training

Educational institutions and corporate training departments can leverage AI writers to develop course materials, study guides, and instructional content. This application is particularly valuable for technical subjects where clear, structured explanation is essential.

## ROI Considerations

The commercial value of long-article writing AI agents can be assessed through several ROI factors:

1. **Labor Cost Reduction**: AI writers can reduce the cost of content production by 60-80% compared to professional human writers, particularly for routine content needs.

2. **Time Efficiency**: Content that might take a human writer several days can be generated in minutes, allowing for faster publication cycles and more responsive content strategies.

3. **Scalability**: Businesses can scale content operations without proportional increases in staff, enabling content marketing at enterprise scale even for smaller organizations.

4. **Consistency**: AI writers maintain consistent tone, style, and quality across all content, eliminating variations that can occur with multiple human writers.

## Challenges and Limitations

Despite their commercial promise, long-article writing AI agents face several challenges that impact their commercial value:

### Quality Considerations

While AI writing quality has improved dramatically, the output still requires human review and editing for high-stakes content. This creates a hybrid workflow rather than full automation, somewhat limiting cost savings.

### Originality Concerns

AI-generated content may lack truly original insights or creative approaches that human writers can provide, potentially limiting its value for thought leadership content or creative applications.

### Technical Limitations

Current AI models still struggle with factual accuracy for specialized topics, requiring subject matter expert review to prevent misinformation, which adds to the workflow cost.

## Future Commercial Potential

The commercial value of long-article writing AI agents is likely to increase as the technology evolves:

1. **Improved Specialization**: Industry and domain-specific AI writers will offer higher quality for specialized fields like legal, medical, or technical writing.

2. **Enhanced Integration**: AI writing tools integrated with content management systems, SEO tools, and analytics platforms will provide end-to-end content solutions.

3. **Multimodal Capabilities**: Future AI writers will likely incorporate image generation, video script creation, and interactive content capabilities, increasing their value proposition.

## Conclusion

Long-article writing AI agents offer substantial commercial value through cost reduction, efficiency gains, and content scalability. While they don't fully replace human writers, they represent a powerful augmentation tool that enables organizations to produce more content at lower cost. The most successful commercial applications currently involve a human-AI collaboration model, where AI handles initial drafting and humans provide editing, fact-checking, and creative direction.

As technology continues to advance, the commercial value of these tools will likely increase further, with more specialized capabilities and improved quality reducing the need for human intervention. Organizations that effectively integrate AI writing agents into their content workflows stand to gain significant competitive advantages in content production capacity, potentially transforming content from a cost center to a scalable business asset.`;

// Pass the task graph directly to the TaskList component which handles hierarchy internally

const ResultsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [generationStatus, setGenerationStatus] = useState("generating");
  const [copySuccess, setCopySuccess] = useState("");
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stopConfirmOpen, setStopConfirmOpen] = useState(false);
  const [stopInProgress, setStopInProgress] = useState(false);

  // Get the generation details from location state
  const generationDetails = location.state || {
    prompt: "Loading prompt...",
    model: "Loading model...",
    type: "unknown",
    status: "unknown",
  };

  // Poll status and fetch result when ready
  useEffect(() => {
    let pollInterval;
    let pollCount = 0;

    const fetchStatus = async () => {
      try {
        setLoading(true);

        // Try to reload tasks first to ensure the task is in the backend's memory
        if (pollCount === 0) {
          try {
            await reloadTasks();
          } catch (reloadErr) {
            console.warn("Failed to reload tasks:", reloadErr);
          }
        }

        // Get status from backend
        const statusData = await getGenerationStatus(id);

        if (statusData) {
          setGenerationStatus(statusData.status);

          if (statusData.elapsedTime) {
            setElapsedTime(Math.round(statusData.elapsedTime));
          }

          // Update model information if available
          if (statusData.model && statusData.model !== "unknown") {
            generationDetails.model = statusData.model;
          }

          if (statusData.searchEngine) {
            generationDetails.searchEngine = statusData.searchEngine;
          }

          // Update progress based on status
          if (statusData.status === "completed") {
            setProgress(100);

            // Fetch the result
            const resultData = await getGenerationResult(id);
            if (resultData && resultData.result) {
              setResult(resultData.result);

              // Update model information from result if available
              if (resultData.model && resultData.model !== "unknown") {
                generationDetails.model = resultData.model;
              }

              if (resultData.searchEngine) {
                generationDetails.searchEngine = resultData.searchEngine;
              }

              // Fetch the task graph data
              try {
                const graphData = await getTaskGraph(id);
                if (graphData && graphData.taskGraph) {
                  // Pass the task graph directly without flattening
                  setTaskList(graphData.taskGraph);
                } else {
                  console.warn(
                    "Task graph data not available, using mock data as fallback"
                  );
                  setTaskList(mockGraphData);
                }
              } catch (graphErr) {
                console.warn("Failed to fetch task graph:", graphErr);
                // Fallback to mock data if task graph fetch fails
                setTaskList(mockGraphData);
              }

              clearInterval(pollInterval);
              setLoading(false);
            }
          } else if (statusData.status === "error") {
            setError(statusData.error || "An error occurred during generation");
            clearInterval(pollInterval);
            setLoading(false);
          } else if (statusData.status === "stopped") {
            setError("Task has been stopped by user request.");
            clearInterval(pollInterval);
            setLoading(false);
          } else {
            // Still processing, increment progress
            pollCount++;
            // Simple simulated progress: 10% immediately, then gradually up to 90% while waiting
            const simulatedProgress = Math.min(10 + 80 * (pollCount / 60), 90);
            setProgress(simulatedProgress);
          }
        }
      } catch (err) {
        console.error("Error polling status:", err);

        // If this is the first attempt and we got an error, try to load directly
        if (pollCount === 0) {
          try {
            // Try to get the result directly
            const resultData = await getGenerationResult(id);
            if (resultData && resultData.result) {
              setResult(resultData.result);
              setGenerationStatus("completed");
              setProgress(100);

              // Update model information from result if available
              if (resultData.model && resultData.model !== "unknown") {
                generationDetails.model = resultData.model;
              }

              if (resultData.searchEngine) {
                generationDetails.searchEngine = resultData.searchEngine;
              }

              // Fetch the task graph data
              try {
                const graphData = await getTaskGraph(id);
                if (graphData && graphData.taskGraph) {
                  // Pass the task graph directly without flattening
                  setTaskList(graphData.taskGraph);
                } else {
                  setTaskList(mockGraphData);
                }
              } catch (graphErr) {
                setTaskList(mockGraphData);
              }

              clearInterval(pollInterval);
              setLoading(false);
              return;
            }
          } catch (directErr) {
            console.error("Error fetching result directly:", directErr);
          }
        }

        setError(
          "Error checking generation status: " +
            (err.message || "Unknown error")
        );
        clearInterval(pollInterval);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchStatus();

    // Set up polling every 5 seconds
    pollInterval = setInterval(fetchStatus, 5001);

    return () => {
      clearInterval(pollInterval);
    };
  }, [id]);

  const handleTaskClick = (task) => {
    console.log("Task clicked:", task);
    // Here you could show details about the specific task
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${id}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(result).then(
      () => {
        addToast({
          title: "提示",
          description: "已复制内容到剪贴板",
        });
      },
      () => {
        setCopySuccess("Failed to copy");
        setTimeout(() => setCopySuccess(""), 3000);
      }
    );
  };

  const handleStopGeneration = () => {
    setStopInProgress(true);
    stopTask(id)
      .then((response) => {
        setGenerationStatus("stopped");
        setError("Task has been stopped by user request.");
      })
      .catch((err) => {
        setError(`Failed to stop task: ${err.message}`);
      })
      .finally(() => {
        setStopConfirmOpen(false);
        setStopInProgress(false);
      });
  };

  if (loading && generationStatus !== "completed") {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        {/* Stop Confirmation Dialog */}
        <Dialog
          open={stopConfirmOpen}
          onClose={() => setStopConfirmOpen(false)}
          aria-labelledby="stop-dialog-title"
          aria-describedby="stop-dialog-description"
        >
          <DialogTitle id="stop-dialog-title">提示</DialogTitle>
          <DialogContent>
            <DialogContentText id="stop-dialog-description">
              确定要终止吗? 该操作不可撤销，且生成过程将立即终止。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onPress={() => setStopConfirmOpen(false)}
              isDisabled={stopInProgress}
            >
              取消
            </Button>
            <Button onPress={handleStopGeneration} color="danger">
              {stopInProgress ? "处理中..." : "终止"}
            </Button>
          </DialogActions>
        </Dialog>

        <Card className="border border-gray-light shadow-lg shadow-gray-light p-2 mt-12">
          <CardHeader className="justify-between">
            <div className="flex items-center">
              <Box
                sx={{
                  display: "inline-flex",
                  p: 0,
                  color: "#db2777",
                }}
                className="mr-2"
              >
                {generationDetails.type === "story" ? (
                  <PiFileText size={20} className="mr-1" />
                ) : (
                  <PiFiles size={20} className="mr-1" />
                )}
              </Box>
              <Typography variant="h6">
                {generationStatus === "generating"
                  ? "正在生成内容..."
                  : "正在加载结果..."}
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="py-4 text-md gap-2">
            <div className="flex">
              <span className="text-gray-500 min-w-24 ">提示词 </span>
              {generationDetails.prompt}
            </div>
            <div variant="body1" className="flex">
              <span className="text-gray-500 min-w-24 ">大模型 </span>
              {generationDetails.model}
            </div>
            {generationDetails.searchEngine && (
              <div variant="body1" className="flex">
                <span className="text-gray-500 min-w-24 ">搜索引擎 </span>
                {generationDetails.searchEngine}
              </div>
            )}
            <div variant="body1" className="flex">
              <span className="text-gray-500 min-w-24 ">状态 </span>
              {generationStatus === "completed" ? (
                <span style={{ color: "green" }}>已完成</span>
              ) : generationStatus === "stopped" ? (
                <span style={{ color: "red" }}>已停止</span>
              ) : (
                <span>处理中</span>
              )}
            </div>
          </CardBody>
          <CardFooter>
            <div className="w-full">
              <div>
                <Progress isIndeterminate aria-label="Loading..." size="sm" />
                <div className="text-right my-2 text-sm">
                  {elapsedTime > 0
                    ? ` ${Math.floor(elapsedTime / 60)}:${String(
                        elapsedTime % 60
                      ).padStart(2, "0")} elapsed`
                    : ""}
                  ，根据任务的复杂程度，可能需要十几分钟时间。
                </div>
                {/* <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mb: 1,
                  }}
                /> */}

                {/* <Typography
                  variant="body2"
                  color="text.secondary"
                  align="right"
                >
                  {progress.toFixed(2)}%
                  {elapsedTime > 0
                    ? ` ${Math.floor(elapsedTime / 60)}:${String(
                        elapsedTime % 60
                      ).padStart(2, "0")} elapsed`
                    : ""}
                </Typography> */}
              </div>
              <div className="mt-4">
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    color="danger"
                    onPress={() => setStopConfirmOpen(true)}
                  >
                    终止任务
                  </Button>
                </Box>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Show live task list during generation */}
        <div className="mt-12">
          <LiveTaskList taskId={id} onTaskClick={handleTaskClick} />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button variant="contained" onClick={() => navigate(-1)}>
            返回
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <ToastProvider placement="top-center" toastOffset={60} />
      <Card className="border border-gray-light shadow-lg shadow-gray-light p-2 mt-12">
        <CardHeader className="justify-between">
          <div className="flex items-center">
            <Box
              sx={{
                display: "inline-flex",
                p: 0,
                color: "#db2777",
              }}
              className="mr-2"
            >
              {generationDetails.type === "story" ? (
                <PiFileText color="secondary" size={20} className="mr-1" />
              ) : (
                <PiFiles color="secondary" size={20} className="mr-1" />
              )}
            </Box>
            <Typography variant="h6">
              {generationDetails.type === "story" ? "故事已生成" : "报告已生成"}
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="py-0 text-small gap-2">
          <Typography variant="body1" className="flex">
            <span className="text-gray-500 min-w-24 ">提示词 </span>
            {generationDetails.prompt}
          </Typography>
          <Typography variant="body1" className="flex">
            <span className="text-gray-500 min-w-24 ">大模型 </span>
            {generationDetails.model}
          </Typography>
          {generationDetails.searchEngine && (
            <Typography variant="body1" className="flex">
              <span className="text-gray-500 min-w-24 ">搜索引擎 </span>
              {generationDetails.searchEngine}
            </Typography>
          )}
          <Typography variant="body1" className="flex">
            <span className="text-gray-500 min-w-24 ">状态 </span>
            {generationStatus === "completed" ? (
              <span style={{ color: "green" }}>已完成</span>
            ) : generationStatus === "stopped" ? (
              <span style={{ color: "red" }}>已停止</span>
            ) : (
              <span style={{ color: "orange" }}>处理中</span>
            )}
          </Typography>
        </CardBody>
        <CardFooter className="pt-8">
          {generationStatus === "completed" && (
            <div>
              <Button
                className="bg-gradient-to-tr from-pink-600 to-amber-300 text-white shadow-lg hover:scale-105"
                radius="full"
                size="sm"
                onPress={handleDownload}
              >
                下载
              </Button>
              <Button
                className="ml-4"
                radius="full"
                variant="bordered"
                size="sm"
                onPress={handleCopyToClipboard}
              >
                复制内容
              </Button>
              {copySuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {copySuccess}
                </Alert>
              )}
            </div>
          )}
        </CardFooter>
      </Card>

      <div className="mt-12">
        <LiveTaskResult taskId={id} onTaskClick={handleTaskClick} />
      </div>
    </Container>
  );
};

export default ResultsPage;
