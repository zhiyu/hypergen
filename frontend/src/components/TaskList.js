import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Chip,
  Divider
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import PsychologyIcon from '@mui/icons-material/Psychology';

const getTaskIcon = (taskType) => {
  switch (taskType) {
    case 'write':
      return <CreateIcon />;
    case 'search':
      return <SearchIcon />;
    case 'think':
      return <PsychologyIcon />;
    default:
      return <CreateIcon />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'FINISH':  // Keep this for backward compatibility
      return 'success';
    case 'FINISHED':
      return 'success';
    case 'DOING':   // Keep this for backward compatibility
      return 'primary';
    case 'IN PROGRESS':
      return 'primary';
    case 'READY':
      return 'warning';
    case 'FAILED':
      return 'error';
    case 'NOT_READY':
      return 'default';
    default:
      return 'default';
  }
};

const TaskList = ({ tasks, onTaskClick }) => {
  // Flatten tasks following the display_plan logic in display.py
  const flattenTasks = (task, result = [], skipRoot = false) => {
    if (!task) return result;
    
    // Add the current task unless it's the root and skipRoot is true
    if (!skipRoot) {
      result.push(task);
    }
    
    // Skip execution nodes or nodes with a single execute child
    const isExecuteNode = task.is_execute_node || task.node_type === "EXECUTE_NODE";
    const hasSingleExecuteChild = task.sub_tasks && 
                                task.sub_tasks.length === 1 && 
                                (task.sub_tasks[0].is_execute_node || task.sub_tasks[0].node_type === "EXECUTE_NODE");
    
    // Only process subtasks for non-execute nodes and nodes without a single execute child
    if (!isExecuteNode && !hasSingleExecuteChild && Array.isArray(task.sub_tasks)) {
      // Sort the subtasks by ID to match display_plan
      const sortedSubTasks = [...task.sub_tasks].sort((a, b) => {
        const aId = String(a.id).split('.').pop() || '0';
        const bId = String(b.id).split('.').pop() || '0';
        return parseInt(aId) - parseInt(bId);
      });
      
      // Process each subtask
      sortedSubTasks.forEach(subTask => {
        flattenTasks(subTask, result, false);
      });
    }
    
    return result;
  };

  // Process the tasks with hierarchy information
  let hierarchicalTasks = [];
  
  // Function to process tasks hierarchically
  const processTasksHierarchically = (task, level = 0, parent = null) => {
    if (!task) return [];
    
    const result = [];
    
    // Skip execution nodes if they don't have a meaningful structure
    const isExecuteNode = task.is_execute_node || task.node_type === "EXECUTE_NODE";
    const hasSingleExecuteChild = task.sub_tasks && 
                            task.sub_tasks.length === 1 && 
                            (task.sub_tasks[0].is_execute_node || task.sub_tasks[0].node_type === "EXECUTE_NODE");
    
    // Add the current task with its level information
    if (parent !== null || !isExecuteNode) {
      result.push({
        ...task,
        level, // Add level for indentation
        parent
      });
    }
    
    // Process subtasks if they exist
    if (!isExecuteNode && !hasSingleExecuteChild && Array.isArray(task.sub_tasks) && task.sub_tasks.length > 0) {
      // Sort the subtasks by ID
      const sortedSubTasks = [...task.sub_tasks].sort((a, b) => {
        const aId = String(a.id).split('.').pop() || '0';
        const bId = String(b.id).split('.').pop() || '0';
        return parseInt(aId) - parseInt(bId);
      });
      
      // Process each subtask with increased indentation level
      sortedSubTasks.forEach(subTask => {
        const childTasks = processTasksHierarchically(subTask, level + 1, task.id);
        result.push(...childTasks);
      });
    }
    
    return result;
  };
  
  if (Array.isArray(tasks)) {
    // If tasks is already an array, organize them hierarchically
    // First, build a map of task IDs to tasks for quick lookup
    const taskMap = new Map();
    tasks.forEach(task => taskMap.set(task.id, task));
    
    // Then process top-level tasks (those without a parent in the array)
    const topLevelTasks = tasks.filter(task => {
      // Determine if this is a top-level task by checking if its parent is in the array
      const idParts = task.id.split('.');
      if (idParts.length <= 1) return true; // No parent segments in ID
      
      // Remove last segment to get parent ID
      idParts.pop();
      const parentId = idParts.join('.');
      return !taskMap.has(parentId); // No parent in our task map
    });
    
    // Process each top-level task hierarchically
    topLevelTasks.forEach(task => {
      const taskHierarchy = processTasksHierarchically(task, 0, null);
      hierarchicalTasks.push(...taskHierarchy);
    });
  } else if (tasks && Array.isArray(tasks.sub_tasks)) {
    // If tasks is a tree, process each subtask hierarchically
    const sortedSubTasks = [...tasks.sub_tasks].sort((a, b) => {
      const aId = String(a.id).split('.').pop() || '0';
      const bId = String(b.id).split('.').pop() || '0';
      return parseInt(aId) - parseInt(bId);
    });
    
    sortedSubTasks.forEach(subTask => {
      const taskHierarchy = processTasksHierarchically(subTask, 0, null);
      hierarchicalTasks.push(...taskHierarchy);
    });
  } else if (tasks) {
    // Fallback: process the root node
    hierarchicalTasks = processTasksHierarchically(tasks, 0, null);
  }
  
  // Use the hierarchical tasks for display
  const flatTasks = hierarchicalTasks;

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Task Hierarchy
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {flatTasks.map((task, index) => (
          <React.Fragment key={task.id || index}>
            <ListItem 
              alignItems="flex-start" 
              button 
              onClick={() => onTaskClick && onTaskClick(task)}
              sx={{ 
                borderLeft: `4px solid ${
                  task.task_type === 'write' ? '#4CAF50' : 
                  task.task_type === 'think' ? '#2196F3' : 
                  task.task_type === 'search' ? '#FF9800' : 
                  '#9E9E9E'
                }`,
                mb: 1,
                pl: 2 + (task.level || 0) * 3, // Add indentation based on level
                backgroundColor: task.is_current_to_plan_task ? 'rgba(33, 150, 243, 0.1)' : 'inherit'
              }}
            >
              <ListItemIcon sx={{ position: 'relative' }}>
                {/* Show hierarchy connector with a subtle line instead of a box */}
                {(task.level > 0) && (
                  <>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -24 * task.level,
                        top: '50%',
                        width: 16,
                        height: 1,
                        borderTop: '1px dashed rgba(0, 0, 0, 0.15)',
                        zIndex: 1
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -24 * task.level,
                        top: 0,
                        width: 1,
                        bottom: '50%',
                        borderLeft: '1px dashed rgba(0, 0, 0, 0.15)',
                        zIndex: 1
                      }}
                    />
                  </>
                )}
                {getTaskIcon(task.task_type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">
                      {task.id}. {task.goal}
                    </Typography>
                    <Chip 
                      label={task.status === 'FINISH' ? 'FINISHED' : 
                             task.status === 'DOING' ? 'IN PROGRESS' : 
                             task.status || 'NOT READY'} 
                      size="small" 
                      color={getStatusColor(task.status)}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {task.dependency && task.dependency.length > 0 && (
                      <Typography component="span" variant="body2" color="text.secondary">
                        Dependencies: {task.dependency.join(', ')}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
            {index < flatTasks.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default TaskList;