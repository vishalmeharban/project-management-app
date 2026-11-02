import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_BOARDS, INITIAL_TASKS } from "../../utils/initialData";

// Load from localStorage if present, else fallback to initialData
const loadFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  boards: loadFromStorage("kanban_boards", INITIAL_BOARDS),
  tasks: loadFromStorage("kanban_tasks", INITIAL_TASKS),
  activeBoardId: "board-1",
  searchQuery: "",
  filterPriority: "all",
  filterTag: "all",
  sortBy: "default", // 'default' | 'deadline' | 'priority' | 'title'
};

const persistState = (state) => {
  try {
    localStorage.setItem("kanban_boards", JSON.stringify(state.boards));
    localStorage.setItem("kanban_tasks", JSON.stringify(state.tasks));
  } catch (e) {
    console.error("Failed to persist state", e);
  }
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setActiveBoard: (state, action) => {
      state.activeBoardId = action.payload;
    },

    addTask: (state, action) => {
      const { columnId, task } = action.payload;
      const board = state.boards.find((b) => b.id === state.activeBoardId);
      if (!board || !board.columns[columnId]) return;

      const fullTask = {
        ...task,
        boardId: state.activeBoardId,
        comments: task.comments || [],
        commentsCount: (task.comments || []).length,
        activity: task.activity || [
          {
            id: `act-${Date.now()}`,
            text: `Task created`,
            createdAt: new Date().toISOString(),
            type: "create",
          },
        ],
      };

      state.tasks[task.id] = fullTask;
      board.columns[columnId].taskIds.unshift(task.id);
      persistState(state);
    },

    updateTask: (state, action) => {
      const { taskId, updates } = action.payload;
      const task = state.tasks[taskId];
      if (task) {
        const activityList = task.activity || [];
        if (updates.priority && updates.priority !== task.priority) {
          activityList.unshift({
            id: `act-${Date.now()}`,
            text: `Priority changed from ${task.priority} to ${updates.priority}`,
            createdAt: new Date().toISOString(),
            type: "priority",
          });
        } else if (updates.title && updates.title !== task.title) {
          activityList.unshift({
            id: `act-${Date.now()}`,
            text: `Title renamed to "${updates.title}"`,
            createdAt: new Date().toISOString(),
            type: "update",
          });
        }

        state.tasks[taskId] = {
          ...task,
          ...updates,
          activity: activityList,
        };
        persistState(state);
      }
    },

    deleteTask: (state, action) => {
      const { taskId, columnId } = action.payload;
      const board = state.boards.find((b) => b.id === state.activeBoardId);
      if (board && board.columns[columnId]) {
        board.columns[columnId].taskIds = board.columns[columnId].taskIds.filter(
          (id) => id !== taskId
        );
      }
      delete state.tasks[taskId];
      persistState(state);
    },

    toggleSubtask: (state, action) => {
      const { taskId, subtaskId } = action.payload;
      const task = state.tasks[taskId];
      if (task && task.subtasks) {
        const sub = task.subtasks.find((s) => s.id === subtaskId);
        if (sub) {
          sub.completed = !sub.completed;
          if (!task.activity) task.activity = [];
          task.activity.unshift({
            id: `act-${Date.now()}`,
            text: `Subtask "${sub.text}" marked as ${sub.completed ? "completed" : "pending"}`,
            createdAt: new Date().toISOString(),
            type: "subtask",
          });
          persistState(state);
        }
      }
    },

    moveTask: (state, action) => {
      const { source, destination, draggableId } = action.payload;
      if (!destination) return;

      const board = state.boards.find((b) => b.id === state.activeBoardId);
      if (!board) return;

      const sourceCol = board.columns[source.droppableId];
      const destCol = board.columns[destination.droppableId];
      if (!sourceCol || !destCol) return;

      // Moving inside the same column
      if (source.droppableId === destination.droppableId) {
        const newTaskIds = Array.from(sourceCol.taskIds);
        const currentIndex = newTaskIds.indexOf(draggableId);
        if (currentIndex !== -1) {
          newTaskIds.splice(currentIndex, 1);
        }
        newTaskIds.splice(destination.index, 0, draggableId);
        sourceCol.taskIds = newTaskIds;
      } else {
        // Moving from one column to another
        const sourceTaskIds = Array.from(sourceCol.taskIds);
        const currentIndex = sourceTaskIds.indexOf(draggableId);
        if (currentIndex !== -1) {
          sourceTaskIds.splice(currentIndex, 1);
        }

        const destTaskIds = Array.from(destCol.taskIds).filter(
          (id) => id !== draggableId
        );
        destTaskIds.splice(destination.index, 0, draggableId);

        sourceCol.taskIds = sourceTaskIds;
        destCol.taskIds = destTaskIds;

        // Log move activity
        const task = state.tasks[draggableId];
        if (task) {
          task.boardId = state.activeBoardId;
          if (!task.activity) task.activity = [];
          task.activity.unshift({
            id: `act-${Date.now()}`,
            text: `Moved from "${sourceCol.title}" to "${destCol.title}"`,
            createdAt: new Date().toISOString(),
            type: "move",
          });
        }
      }

      persistState(state);
    },

    addColumn: (state, action) => {
      const { column } = action.payload;
      const board = state.boards.find((b) => b.id === state.activeBoardId);
      if (!board) return;

      board.columns[column.id] = column;
      board.columnOrder.push(column.id);
      persistState(state);
    },

    deleteColumn: (state, action) => {
      const { columnId } = action.payload;
      const board = state.boards.find((b) => b.id === state.activeBoardId);
      if (!board) return;

      // Delete tasks inside column
      const taskIds = board.columns[columnId]?.taskIds || [];
      taskIds.forEach((tId) => delete state.tasks[tId]);

      delete board.columns[columnId];
      board.columnOrder = board.columnOrder.filter((id) => id !== columnId);
      persistState(state);
    },

    updateColumnTitle: (state, action) => {
      const { columnId, title } = action.payload;
      const board = state.boards.find((b) => b.id === state.activeBoardId);
      if (board && board.columns[columnId] && title.trim()) {
        board.columns[columnId].title = title.trim();
        persistState(state);
      }
    },

    moveColumn: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const board = state.boards.find((b) => b.id === state.activeBoardId);
      if (!board) return;

      const newOrder = Array.from(board.columnOrder);
      const [removed] = newOrder.splice(sourceIndex, 1);
      newOrder.splice(destinationIndex, 0, removed);
      board.columnOrder = newOrder;
      persistState(state);
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setFilterPriority: (state, action) => {
      state.filterPriority = action.payload;
    },

    setFilterTag: (state, action) => {
      state.filterTag = action.payload;
    },

    addBoard: (state, action) => {
      const { board } = action.payload;
      state.boards.push(board);
      state.activeBoardId = board.id;
      persistState(state);
    },

    updateBoard: (state, action) => {
      const { boardId, updates } = action.payload;
      const index = state.boards.findIndex((b) => b.id === boardId);
      if (index !== -1) {
        state.boards[index] = { ...state.boards[index], ...updates };
        persistState(state);
      }
    },

    deleteBoard: (state, action) => {
      const { boardId } = action.payload;
      if (state.boards.length <= 1) return;

      // Delete tasks associated with this board
      Object.keys(state.tasks).forEach((tId) => {
        if (state.tasks[tId].boardId === boardId) {
          delete state.tasks[tId];
        }
      });

      state.boards = state.boards.filter((b) => b.id !== boardId);
      if (state.activeBoardId === boardId) {
        state.activeBoardId = state.boards[0]?.id || "";
      }
      persistState(state);
    },

    addComment: (state, action) => {
      const { taskId, text, author } = action.payload;
      const task = state.tasks[taskId];
      if (!task || !text?.trim()) return;

      if (!task.comments) task.comments = [];
      if (!task.activity) task.activity = [];

      const newComment = {
        id: `comm-${Date.now()}`,
        author: author || {
          name: "Vishal Sharma",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        },
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };

      task.comments.push(newComment);
      task.commentsCount = task.comments.length;

      task.activity.unshift({
        id: `act-${Date.now()}`,
        text: `${newComment.author.name} commented: "${text.trim().slice(0, 30)}${text.trim().length > 30 ? "..." : ""}"`,
        createdAt: new Date().toISOString(),
        type: "comment",
      });

      persistState(state);
    },

    deleteComment: (state, action) => {
      const { taskId, commentId } = action.payload;
      const task = state.tasks[taskId];
      if (!task || !task.comments) return;

      task.comments = task.comments.filter((c) => c.id !== commentId);
      task.commentsCount = task.comments.length;
      persistState(state);
    },

    importBoard: (state, action) => {
      const { board, tasks } = action.payload;
      if (!board || !board.id || !board.columns) return;

      if (tasks && typeof tasks === "object") {
        state.tasks = { ...state.tasks, ...tasks };
      }

      const existingIndex = state.boards.findIndex((b) => b.id === board.id);
      if (existingIndex !== -1) {
        state.boards[existingIndex] = board;
      } else {
        state.boards.push(board);
      }

      state.activeBoardId = board.id;
      persistState(state);
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    clearAllFilters: (state) => {
      state.searchQuery = "";
      state.filterPriority = "all";
      state.filterTag = "all";
      state.sortBy = "default";
    },

    resetToDefault: (state) => {
      state.boards = INITIAL_BOARDS;
      state.tasks = INITIAL_TASKS;
      state.activeBoardId = "board-1";
      state.searchQuery = "";
      state.filterPriority = "all";
      state.filterTag = "all";
      state.sortBy = "default";
      persistState(state);
    },
  },
});

export const {
  setActiveBoard,
  addBoard,
  updateBoard,
  deleteBoard,
  addTask,
  updateTask,
  deleteTask,
  toggleSubtask,
  moveTask,
  addColumn,
  deleteColumn,
  updateColumnTitle,
  moveColumn,
  addComment,
  deleteComment,
  importBoard,
  setSearchQuery,
  setFilterPriority,
  setFilterTag,
  setSortBy,
  clearAllFilters,
  resetToDefault,
} = boardSlice.actions;

export default boardSlice.reducer;
