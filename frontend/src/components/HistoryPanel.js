import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';
import NoteIcon from '@mui/icons-material/Note';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getHistory, reloadTasks, deleteTask } from '../utils/api';

const HistoryPanel = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      // First reload all tasks to ensure we have the latest data
      await reloadTasks();
      
      // Then fetch the history
      const data = await getHistory();
      if (data && data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load generation history. Please try again later.');
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
        status: 'completed'
      }
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
      setHistory(history.filter(item => item.taskId !== taskToDelete));
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(`Failed to delete task: ${err.message}`);
    } finally {
      setDeleteInProgress(false);
    }
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    // Return date in format: "Mar 15, 2025 14:30"
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this generated content? This action cannot be undone, and all associated files will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteInProgress}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            autoFocus
            disabled={deleteInProgress}
            startIcon={deleteInProgress ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deleteInProgress ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    
      <Accordion
        expanded={expanded}
        onChange={handleToggle}
        sx={{
          mb: 4,
          backgroundColor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: '8px !important',
          '&:before': {
            display: 'none',
          },
        }}
      >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="history-panel-content"
        id="history-panel-header"
        sx={{ borderRadius: 2 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HistoryIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Previous Generations</Typography>
          <Chip 
            label={history.length} 
            size="small" 
            color="primary" 
            sx={{ ml: 2 }} 
            variant="outlined"
          />
        </Box>
      </AccordionSummary>
      
      <AccordionDetails>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchHistory}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            {history.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No generation history found. Generate your first story or report!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {history.map((item) => (
                  <Grid item xs={12} md={6} lg={4} key={item.taskId}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: 2
                        },
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      onClick={() => handleViewResult(item.taskId, item.prompt, item.type)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, position: 'relative' }}>
                          {item.type === 'story' ? (
                            <NoteIcon color="secondary" sx={{ mr: 1 }} />
                          ) : (
                            <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                          )}
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.type === 'story' ? 'Story' : 'Report'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                            <Chip 
                              label={formatTimestamp(item.createdAt)} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', mr: 1 }}
                            />
                            <Tooltip title="Delete" placement="top">
                              <IconButton 
                                size="small"
                                onClick={(e) => handleDeleteClick(e, item.taskId)}
                                sx={{ 
                                  p: 0.5,
                                  color: 'rgba(150, 150, 150, 0.7)',
                                  borderRadius: '4px',
                                  '&:hover': {
                                    bgcolor: 'rgba(244, 67, 54, 0.08)',
                                    color: 'error.main'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '60px'
                          }}
                        >
                          {item.prompt}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </AccordionDetails>
    </Accordion>
    </>
  );
};

export default HistoryPanel;