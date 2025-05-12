import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";

import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Chip,
  Button,
  Listbox,
  ListboxItem,
  cn,
} from "@heroui/react";

import ReactMarkdown from "react-markdown";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TokenIcon from "@mui/icons-material/Token";
import ArticleIcon from "@mui/icons-material/Article";
import io from "socket.io-client";
import { getWorkspace } from "../utils/api";

import {
  PiMagnifyingGlass,
  PiPencilSimpleLine,
  PiBrain,
  PiCheckCircleFill,
  PiHourglassSimpleHigh,
} from "react-icons/pi";

// Get the backend port from environment variable or use default
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "5001";
const SOCKET_URL =
  window.location.hostname === "localhost"
    ? `http://localhost:${BACKEND_PORT}` // For local development
    : `http://${window.location.hostname}:${BACKEND_PORT}`; // For EC2
const API_BASE_URL = `${SOCKET_URL}/api`;

// Create a singleton socket instance for the entire application
let socket;

// Function to get or create the socket instance
const getSocket = () => {
  if (!socket) {
    // Initialize socket connection - make sure this matches your backend URL
    // Using a dynamic approach that works with both development and production
    console.log("Creating new WebSocket connection to:", SOCKET_URL);

    socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"], // Try polling first, then WebSocket (more reliable initial connection)
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      timeout: 10000,
      autoConnect: true,
      query: { timestamp: Date.now() }, // Prevent caching issues
    });

    // Set up global error handlers
    socket.on("connect_error", (err) => {
      console.error("Global socket connection error:", err);
    });

    socket.on("error", (err) => {
      console.error("Global socket error:", err);
    });
  }

  return socket;
};

const getTaskIcon = (taskType) => {
  switch (taskType) {
    case "write":
      return <PiPencilSimpleLine />;
    case "search":
      return <PiMagnifyingGlass />;
    case "think":
      return <PiBrain />;
    default:
      return <PiPencilSimpleLine />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "FINISH": // Keep this for backward compatibility
      return "success";
    case "FINISHED":
      return "success";
    case "DOING": // Keep this for backward compatibility
      return "primary";
    case "IN PROGRESS":
      return "primary";
    case "READY":
      return "warning";
    case "FAILED":
      return "error";
    case "NOT_READY":
      return "default";
    default:
      return "default";
  }
};

const getStatusIcon = (status) => {
  // {task.status === "FINISH"
  //   ? "已完成"
  //   : task.status === "DOING"
  //   ? "处理中..."
  //   : task.status === "NOT_READY"
  //   ? "待处理"
  //   : task.status || "NOT READY"}
  switch (status) {
    case "FINISH": // Keep this for backward compatibility
      return <PiCheckCircleFill size={18} />;
    case "FINISHED":
      return "success";
    case "DOING": // Keep this for backward compatibility
      return "";
    case "IN PROGRESS":
      return "primary";
    case "READY":
      return "warning";
    case "FAILED":
      return "error";
    case "NOT_READY":
      return "default";
    default:
      return "default";
  }
};

const LiveTaskResult = ({ taskId, onTaskClick }) => {
  const [connected, setConnected] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isTaskComplete, setIsTaskComplete] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [workspace, setWorkspace] = useState("");
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");

  // Function to toggle task details expansion
  const toggleTaskExpansion = (taskId, event) => {
    event.stopPropagation(); // Prevent clicking the expand button from triggering the task selection
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Function to fetch the workspace content
  const fetchWorkspace = async () => {
    if (!taskId) return;

    setWorkspaceLoading(true);
    setWorkspaceError("");

    try {
      const data = await getWorkspace(taskId);
      if (data && data.workspace) {
        setWorkspace(data.workspace);
      } else {
        setWorkspace("暂无可用内容");
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
      setWorkspaceError(error.message || "Failed to load workspace content");
      setWorkspace("");
    } finally {
      setWorkspaceLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);

    // Fetch workspace content when switching to workspace tab
    if (newValue === 1 && !workspace && !workspaceLoading) {
      fetchWorkspace();
    }
  };

  // Process tasks hierarchically for better visualization
  const flattenTasks = (
    task,
    result = [],
    skipRoot = false,
    level = 0,
    parent = null
  ) => {
    if (!task) return result;

    // Skip execute nodes for cleaner task list
    const isExecuteNode =
      task.is_execute_node || task.node_type === "EXECUTE_NODE";

    // Add the current task with hierarchy information
    if (!skipRoot && !isExecuteNode) {
      result.push({
        ...task,
        level, // Add level for indentation
        parent,
      });
    }

    // Process subtasks if they exist
    if (Array.isArray(task.sub_tasks) && task.sub_tasks.length > 0) {
      // Sort the subtasks by ID
      const sortedSubTasks = [...task.sub_tasks].sort((a, b) => {
        const aId = String(a.id).split(".").pop() || "0";
        const bId = String(b.id).split(".").pop() || "0";
        return parseInt(aId) - parseInt(bId);
      });

      // Process each subtask with increased indentation level
      for (const subTask of sortedSubTasks) {
        flattenTasks(subTask, result, false, level + 1, task.id);
      }
    }

    return result;
  };

  useEffect(() => {
    // First try to get task graph data directly from API for completed tasks
    const fetchTaskGraph = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/task-graph/${taskId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.taskGraph) {
            const flatTasks = flattenTasks(data.taskGraph, [], false, 0, null);
            setTasks(flatTasks);
            setLoading(false);

            // Check if the task is already complete
            const taskStatus = await fetch(`${API_BASE_URL}/status/${taskId}`);
            if (taskStatus.ok) {
              const statusData = await taskStatus.json();
              if (
                statusData.status &&
                (statusData.status === "completed" ||
                  statusData.status === "error" ||
                  statusData.status === "stopped")
              ) {
                console.log(
                  "Task is already complete with status:",
                  statusData.status
                );
                setIsTaskComplete(true);
              }
            }

            // Try to fetch the workspace content initially
            fetchWorkspace();

            // Still connect to socket for potential additional updates
            return true;
          }
        }
        return false;
      } catch (error) {
        console.log(
          "Error fetching task graph, will try socket connection",
          error
        );
        return false;
      }
    };

    // Try to fetch the task graph data
    fetchTaskGraph();

    // Initialize socket connection
    console.log("Initializing socket connection");
    const newSocket = getSocket();
    setSocket(newSocket);

    // Set up event handlers for this component instance
    if (newSocket) {
      // Add socket connection debug events
      const onConnectError = (err) => {
        console.error("Connection error:", err);
        setError(`Connection error: ${err.message}`);
        setConnected(false);
      };

      const onConnectTimeout = () => {
        console.error("Connection timeout");
        setError("Connection timeout - server might be unavailable");
        setConnected(false);
      };

      const onSocketError = (err) => {
        console.error("Socket error:", err);
        setError(`Socket error: ${err.message || "Unknown error"}`);
      };

      const onConnect = () => {
        console.log("Socket connected successfully");
        setConnected(true);
        setError("");

        // Subscribe to task updates for this taskId
        console.log("Subscribing to task updates for:", taskId);
        newSocket.emit("subscribe_to_task", { taskId });
      };

      const onDisconnect = () => {
        console.log("Socket disconnected");
        setConnected(false);
        setSubscribed(false);
      };

      const onSubscriptionStatus = (data) => {
        console.log(
          "Subscription status received:",
          JSON.stringify(data).slice(0, 200) + "..."
        );
        if (data.taskId === taskId) {
          if (data.status === "subscribed") {
            console.log("Successfully subscribed to task updates");
            setSubscribed(true);
            setError("");
          } else {
            console.error("Failed to subscribe:", data.message);
            setError(
              `Failed to subscribe to task updates: ${
                data.message || "Unknown error"
              }`
            );
          }
        }
      };

      const onTaskUpdate = (data) => {
        console.log(
          "Task update received:",
          JSON.stringify(data).slice(0, 200) + "..."
        );
        if (data.taskId === taskId) {
          setLoading(false);

          // Check if this is the final update
          if (
            data.status &&
            (data.status === "completed" ||
              data.status === "error" ||
              data.status === "stopped")
          ) {
            console.log("Task is complete with status:", data.status);
            setIsTaskComplete(true);
          }

          if (data.taskGraph) {
            // Flatten tasks for display with hierarchy information
            const flatTasks = flattenTasks(data.taskGraph, [], false, 0, null);
            console.log(`Received update with ${flatTasks.length} tasks`);

            // Debug: Log the fields available in the first task to see if thinking/result/agent_response fields exist
            if (flatTasks.length > 0) {
              console.log("Task fields available:", Object.keys(flatTasks[0]));

              // Look for task_info field which might contain the thinking content
              if (flatTasks[0].task_info) {
                console.log(
                  "task_info fields:",
                  Object.keys(flatTasks[0].task_info)
                );

                // Copy fields from task_info to the main task object for display
                flatTasks.forEach((task) => {
                  if (task.task_info) {
                    if (task.task_info.candidate_think)
                      task.candidate_think = task.task_info.candidate_think;
                    if (task.task_info.input) task.input = task.task_info.input;
                  }
                });
              }

              console.log(
                "Sample task data:",
                JSON.stringify(flatTasks[0]).slice(0, 500) + "..."
              );
            }

            setTasks(flatTasks);

            // Try to fetch workspace content when we receive an update
            // but only if we're on the workspace tab
            if (activeTab === 1) {
              fetchWorkspace();
            }
          }
        }
      };

      // Add a test handler for connection verification
      const onConnectionTest = (data) => {
        console.log(
          "Received connection test message:",
          JSON.stringify(data).slice(0, 200) + "..."
        );
        setConnected(true);
        setError("");
      };

      // Register all event handlers
      newSocket.on("connect_error", onConnectError);
      newSocket.on("connect_timeout", onConnectTimeout);
      newSocket.on("error", onSocketError);
      newSocket.on("connect", onConnect);
      newSocket.on("disconnect", onDisconnect);
      newSocket.on("subscription_status", onSubscriptionStatus);
      newSocket.on("task_update", onTaskUpdate);
      newSocket.on("connection_test", onConnectionTest);

      // If socket is already connected, subscribe immediately
      if (newSocket.connected) {
        console.log("Socket already connected, subscribing immediately");
        setConnected(true);
        newSocket.emit("subscribe_to_task", { taskId });
      } else {
        console.log(
          "Socket not yet connected, will subscribe on connect event"
        );
      }

      // Cleanup function
      return () => {
        console.log("Cleaning up socket listeners");
        newSocket.off("connect_error", onConnectError);
        newSocket.off("connect_timeout", onConnectTimeout);
        newSocket.off("error", onSocketError);
        newSocket.off("connect", onConnect);
        newSocket.off("disconnect", onDisconnect);
        newSocket.off("subscription_status", onSubscriptionStatus);
        newSocket.off("task_update", onTaskUpdate);
        newSocket.off("connection_test", onConnectionTest);
      };
    }

    return () => {}; // Empty cleanup if no socket
  }, [taskId]); // Only re-run if taskId changes

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: "center" }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body1">Loading task data...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1">
          Unable to show live task updates. You can still view the final result
          when generation completes.
        </Typography>
      </Paper>
    );
  }

  if (!connected) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Not connected to the server
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {error || "Trying to reconnect to see live task updates..."}
        </Typography>
        <Button
          onPress={() => {
            console.log("Manual reconnect attempt");
            if (socket) {
              socket.disconnect();
              setTimeout(() => {
                socket.connect();
                socket.emit("subscribe_to_task", { taskId });
              }, 500);
            } else {
              const newSocket = getSocket();
              setSocket(newSocket);
            }
          }}
        >
          Try Reconnecting
        </Button>
      </Paper>
    );
  }

  if (tasks.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Task Progress
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Waiting for tasks to start...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 2 }}></Box>

      {/* Tab navigation */}
      <Tabs aria-label="Options" variant="underlined" size="lg">
        <Tab key="photos" title="任务列表">
          <Card className="border border-gray-light shadow-lg shadow-gray-light">
            <CardBody>
              <div className="mb-4">
                {tasks.length > 0 ? (
                  <>
                    <Chip
                      color={connected ? "success" : "default"}
                      size="sm"
                      variant="light"
                    >
                      {connected ? "已连接" : "Using saved data"}
                    </Chip>
                    {connected && (
                      <Chip
                        color={
                          isTaskComplete
                            ? "success"
                            : subscribed
                            ? "success"
                            : "warning"
                        }
                        size="sm"
                        variant="light"
                      >
                        {isTaskComplete
                          ? "已完成"
                          : subscribed
                          ? "正在更新任务状态..."
                          : "Not subscribed"}
                      </Chip>
                    )}
                  </>
                ) : (
                  <>
                    <Chip
                      color={connected ? "success" : "error"}
                      size="sm"
                      variant="light"
                    >
                      {connected ? "Connected" : "Disconnected"}
                    </Chip>
                    <Chip
                      color={
                        isTaskComplete
                          ? "success"
                          : subscribed
                          ? "success"
                          : "warning"
                      }
                      size="sm"
                      variant="light"
                    >
                      {isTaskComplete
                        ? "Final"
                        : subscribed
                        ? "Receiving updates"
                        : "Not subscribed"}
                    </Chip>
                  </>
                )}
              </div>
              <Listbox
                aria-label="Listbox menu with descriptions"
                variant="flat"
              >
                {tasks.map((task, index) => (
                  <ListboxItem
                    key="edit"
                    description={
                      task.dependency && task.dependency.length > 0
                        ? "依赖项: " + task.dependency.join(", ")
                        : ""
                    }
                    startContent={
                      <div>
                        {/* Show hierarchy connector with a subtle dashed line */}
                        {task.level > 0 && (
                          <div
                            className="flex justify-end mr-2"
                            style={{
                              width: 24 * task.level,
                              zIndex: 1,
                            }}
                          >
                            {getTaskIcon(task.task_type)}
                          </div>
                        )}
                      </div>
                    }
                    className="py-2 border-b border-gray-light last:border-none"
                  >
                    <div className="flex items-center mb-2">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                          pr: 2,
                        }}
                      >
                        <Typography variant="subtitle1">
                          {task.id ? task.id + ". " : ""}
                          {task.goal}
                        </Typography>
                        <Chip
                          color={getStatusColor(task.status)}
                          size="sm"
                          variant="faded"
                          startContent={getStatusIcon(task.status)}
                        >
                          {task.status === "FINISH"
                            ? "已完成"
                            : task.status === "DOING"
                            ? "处理中..."
                            : task.status === "NOT_READY"
                            ? "待处理"
                            : task.status === "READY"
                            ? "已就绪"
                            : task.status || "NOT READY"}
                        </Chip>

                        {task.start_time && task.end_time && (
                          <Tooltip title="Execution time">
                            <Chip
                              icon={<AccessTimeIcon fontSize="small" />}
                              size="sm"
                              color="default"
                              variant="light"
                            >{`${Math.round(
                              (new Date(task.end_time) -
                                new Date(task.start_time)) /
                                1000
                            )}s`}</Chip>
                          </Tooltip>
                        )}

                        {task.token_usage && (
                          <Tooltip title="Token usage (input/output)">
                            <Chip
                              icon={<TokenIcon fontSize="small" />}
                              size="sm"
                              color="default"
                              variant="light"
                            >{`${task.token_usage.input_tokens || 0}/${
                              task.token_usage.output_tokens || 0
                            }`}</Chip>
                          </Tooltip>
                        )}
                      </Box>
                    </div>
                    <div>
                      {/* Show a brief description or snippet if available */}
                      {task.description && (
                        <Typography
                          component="p"
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5, fontStyle: "italic" }}
                        >
                          {task.description.length > 100
                            ? task.description.substring(0, 100) + "..."
                            : task.description}
                        </Typography>
                      )}
                    </div>
                  </ListboxItem>
                ))}
              </Listbox>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="music" title="生成结果">
          <Card className="border border-gray-light shadow-lg shadow-gray-light">
            <CardBody>
              <Box>
                {workspaceLoading && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      my: 3,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}

                {workspaceError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {workspaceError}
                  </Alert>
                )}

                {!workspaceLoading && !workspaceError && workspace && (
                  <ReactMarkdown className="markdown-content p-8">
                    {workspace}
                  </ReactMarkdown>
                )}

                {!workspaceLoading && !workspaceError && !workspace && (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 5,
                      border: "1px dashed rgba(0, 0, 0, 0.12)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No workspace content available yet.
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      The article.txt file will appear here once the generation
                      has started.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </Box>
  );
};

export default LiveTaskResult;
