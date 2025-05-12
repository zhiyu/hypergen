import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Grid,
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HistoryIcon from "@mui/icons-material/History";
import RefreshIcon from "@mui/icons-material/Refresh";
import NoteIcon from "@mui/icons-material/Note";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getHistory, reloadTasks, deleteTask } from "../utils/api";

import { Accordion, AccordionItem, Chip } from "@heroui/react";
import { Card, CardBody } from "@heroui/react";

import {
  PiFileText,
  PiFiles,
  PiClockCounterClockwise,
  PiArrowCounterClockwise,
  PiTrash,
} from "react-icons/pi";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      // First reload all tasks to ensure we have the latest data
      await reloadTasks();

      // Then fetch the history
      const data = await getHistory();
      if (data && data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Failed to load generation history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleViewResult = (taskId, prompt, type) => {
    navigate(`/results/${taskId}`, {
      state: {
        taskId,
        prompt,
        type,
        status: "completed",
      },
    });
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleDeleteClick = (e, taskId) => {
    // Stop propagation to prevent card click event
    e.stopPropagation();

    // Set the task to delete and open confirmation dialog
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    setDeleteInProgress(true);
    try {
      await deleteTask(taskToDelete);
      // Filter out the deleted task from history
      setHistory(history.filter((item) => item.taskId !== taskToDelete));
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(`Failed to delete task: ${err.message}`);
    } finally {
      setDeleteInProgress(false);
    }
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    // Return date in format: "Mar 15, 2025 14:30"
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">提示</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            是否确认删除当前生成内容？该操作无法撤销，且所有关联文件都将被永久清除。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteInProgress}>
            取消
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            autoFocus
            disabled={deleteInProgress}
            startIcon={
              deleteInProgress ? <CircularProgress size={16} /> : <DeleteIcon />
            }
          >
            {deleteInProgress ? "正在删除..." : "删除"}
          </Button>
        </DialogActions>
      </Dialog>

      <Accordion defaultExpandedKeys={["1"]}>
        <AccordionItem
          key="1"
          aria-label=""
          title=""
          startContent={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <span className="font-medium">历史生成记录</span>
              <Chip size="sm" className="ml-4 rounded">
                {history.length}
              </Chip>
            </Box>
          }
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : (
            <>
              {history.length === 0 ? (
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    暂无数据
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={4} className="mb-4">
                  {history.map((item) => (
                    <Grid item xs={12} md={6} lg={4} key={item.taskId}>
                      <Card
                        isPressable
                        onPress={() =>
                          handleViewResult(item.taskId, item.prompt, item.type)
                        }
                        className="border border-gray-light shadow-lg shadow-gray-light w-full p-4 hover:shadow-gray-dark hover:scale-105"
                      >
                        <CardBody className="p-0">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                              position: "relative",
                            }}
                          >
                            {item.type === "story" ? (
                              <PiFileText
                                color="#db2777"
                                size={20}
                                className="mr-2"
                              />
                            ) : (
                              <PiFiles
                                color="#db2777"
                                size={20}
                                className="mr-2"
                              />
                            )}
                            <Typography variant="subtitle1" fontWeight="bold">
                              {item.type === "story" ? "Story" : "Report"}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                ml: "auto",
                              }}
                            >
                              <Chip
                                label={formatTimestamp(item.createdAt)}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem", mr: 1 }}
                              />
                              <Tooltip title="删除" placement="top">
                                <IconButton
                                  size="small"
                                  onClick={(e) =>
                                    handleDeleteClick(e, item.taskId)
                                  }
                                  sx={{
                                    p: 0.5,
                                    color: "rgba(150, 150, 150, 0.7)",
                                    borderRadius: "4px",
                                    "&:hover": {
                                      bgcolor: "rgba(244, 67, 54, 0.08)",
                                      color: "error.main",
                                    },
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  <PiTrash />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          <div className="text-default-600 text-ellipsis">
                            {item.prompt}
                          </div>
                        </CardBody>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default HistoryPage;
