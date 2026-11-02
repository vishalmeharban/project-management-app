import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSelector, useDispatch } from "react-redux";
import {
  Plus,
  ArrowUpDown,
  Tag,
  X,
  RotateCcw,
  Calendar,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  moveTask,
  addColumn,
  moveColumn,
  setSortBy,
  setFilterTag,
  setFilterPriority,
  setSearchQuery,
  clearAllFilters,
} from "../../redux/slices/boardSlice";
import { selectCurrentUser, selectIsAdmin } from "../../redux/slices/authSlice";
import KanbanColumn from "./KanbanColumn";
import Button from "../common/Button";
import Modal from "../common/Modal";

export const KanbanBoard = () => {
  const dispatch = useDispatch();
  const {
    boards,
    tasks,
    activeBoardId,
    searchQuery,
    filterPriority,
    filterTag,
    sortBy,
  } = useSelector((state) => state.board);
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  const [showOnlyMyTasks, setShowOnlyMyTasks] = useState(false);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnColor, setNewColumnColor] = useState("#6366f1");


  const currentBoard = boards.find((b) => b.id === activeBoardId) || boards[0];

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        No boards found.
      </div>
    );
  }

  // Extract all unique tags present on current board tasks
  const allBoardTaskIds = Object.values(currentBoard?.columns || {}).flatMap(
    (col) => col.taskIds
  );
  const availableTags = Array.from(
    new Set(
      allBoardTaskIds
        .map((tId) => tasks[tId])
        .filter(Boolean)
        .flatMap((t) => t.tags || [])
    )
  );

  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Column horizontal reordering
    if (type === "COLUMN") {
      dispatch(
        moveColumn({
          sourceIndex: source.index,
          destinationIndex: destination.index,
        })
      );
      return;
    }

    // Reset sorting to default so manual placement is honored
    if (sortBy !== "default") {
      dispatch(setSortBy("default"));
    }

    dispatch(
      moveTask({
        source,
        destination,
        draggableId,
        boardId: currentBoard.id,
      })
    );

    // If moved to a completed column, celebrate with confetti!
    const destCol = currentBoard.columns[destination.droppableId];
    if (
      destCol &&
      (destCol.title.toLowerCase().includes("done") ||
        destCol.title.toLowerCase().includes("completed")) &&
      source.droppableId !== destination.droppableId
    ) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleCreateColumn = (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    const colId = `col-${Date.now()}`;
    dispatch(
      addColumn({
        column: {
          id: colId,
          title: newColumnTitle.trim(),
          color: newColumnColor,
          taskIds: [],
        },
      })
    );

    setNewColumnTitle("");
    setIsAddColumnOpen(false);
  };

  // Filter tasks by search query, priority, tag, and assigned user
  const filterTask = (task) => {
    if (!task) return false;

    // Developer / User assigned tasks filter
    if (showOnlyMyTasks && task.assignee?.name !== currentUser?.name) {
      return false;
    }

    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (filterPriority !== "all" && task.priority !== filterPriority) {
      return false;
    }

    if (filterTag !== "all" && (!task.tags || !task.tags.includes(filterTag))) {
      return false;
    }

    return true;
  };

  // Sort tasks based on selected sorting rule
  const sortTasks = (taskList) => {
    if (sortBy === "deadline") {
      return [...taskList].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }
    if (sortBy === "priority") {
      const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
      return [...taskList].sort((a, b) => {
        const weightA = priorityWeights[a.priority] || 0;
        const weightB = priorityWeights[b.priority] || 0;
        return weightB - weightA;
      });
    }
    if (sortBy === "title") {
      return [...taskList].sort((a, b) => a.title.localeCompare(b.title));
    }
    return taskList; // default order
  };

  const hasActiveFilters =
    showOnlyMyTasks ||
    searchQuery ||
    filterPriority !== "all" ||
    filterTag !== "all" ||
    sortBy !== "default";


  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Advanced Filters & Sorting Bar */}
      <div className="px-4 sm:px-6 py-2.5 border-b border-slate-800/60 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* My Assigned Tasks Toggle Button */}
          <button
            type="button"
            onClick={() => setShowOnlyMyTasks(!showOnlyMyTasks)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              showOnlyMyTasks
                ? "bg-emerald-600/25 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40 shadow-sm"
                : "bg-slate-900/90 border-slate-700/70 text-slate-300 hover:text-white hover:border-slate-600"
            }`}
            title={
              currentUser
                ? `Filter tasks assigned to ${currentUser.name}`
                : "Filter my assigned tasks"
            }
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>My Assigned Tasks</span>
            {showOnlyMyTasks && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/70 rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400 shrink-0" />

            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="bg-transparent text-slate-200 border-none outline-none cursor-pointer pr-1"
            >
              <option value="default" className="bg-slate-900">
                Default Order
              </option>
              <option value="deadline" className="bg-slate-900">
                📅 Nearest Deadline
              </option>
              <option value="priority" className="bg-slate-900">
                🚨 Highest Priority
              </option>
              <option value="title" className="bg-slate-900">
                🔤 Title (A - Z)
              </option>
            </select>
          </div>

          {/* Tag Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/70 rounded-xl px-2.5 py-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <select
              value={filterTag}
              onChange={(e) => dispatch(setFilterTag(e.target.value))}
              className="bg-transparent text-slate-200 border-none outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900">
                All Tags
              </option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag} className="bg-slate-900">
                  #{tag}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Tag Pills */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-md py-0.5">
            {availableTags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  dispatch(setFilterTag(filterTag === tag ? "all" : tag))
                }
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                  filterTag === tag
                    ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary Chips & Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 overflow-x-auto">
            {filterTag !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px]">
                Tag: #{filterTag}
                <button
                  onClick={() => dispatch(setFilterTag("all"))}
                  className="hover:text-rose-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filterPriority !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px]">
                Priority: {filterPriority}
                <button
                  onClick={() => dispatch(setFilterPriority("all"))}
                  className="hover:text-rose-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[11px]">
                &quot;{searchQuery}&quot;
                <button
                  onClick={() => dispatch(setSearchQuery(""))}
                  className="hover:text-rose-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sortBy !== "default" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px]">
                Sorted: {sortBy}
                <button
                  onClick={() => dispatch(setSortBy("default"))}
                  className="hover:text-rose-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={() => dispatch(clearAllFilters())}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer underline ml-1"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Board Column Canvas */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-1 flex items-start gap-3.5 sm:gap-5 overflow-x-auto p-3.5 sm:p-6 pb-6 sm:pb-8"
            >
              {currentBoard.columnOrder.map((columnId, index) => {
                const column = currentBoard.columns[columnId];
                if (!column) return null;

                // Filter tasks, then sort them!
                const filtered = (column.taskIds || [])
                  .map((taskId) => tasks[taskId])
                  .filter(filterTask);

                const sortedTasks = sortTasks(filtered);

                return (
                  <Draggable key={column.id} draggableId={column.id} index={index}>
                    {(colProvided) => (
                      <div
                        ref={colProvided.innerRef}
                        {...colProvided.draggableProps}
                        className="shrink-0"
                      >
                        <KanbanColumn
                          column={column}
                          tasks={sortedTasks}
                          dragHandleProps={colProvided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}

              {/* Add Column Button */}
              <div className="w-[84vw] xs:w-[78vw] sm:w-80 shrink-0">
                <button
                  onClick={() => setIsAddColumnOpen(true)}
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-medium transition-all cursor-pointer text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Column</span>
                </button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Column Modal */}
      <Modal
        isOpen={isAddColumnOpen}
        onClose={() => setIsAddColumnOpen(false)}
        title="Add New Column"
      >
        <form onSubmit={handleCreateColumn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Column Title
            </label>
            <input
              type="text"
              required
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="e.g. In QA Testing"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Column Accent Color
            </label>
            <div className="flex items-center gap-3">
              {[
                "#6366f1",
                "#3b82f6",
                "#06b6d4",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
                "#ec4899",
              ].map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setNewColumnColor(color)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    newColumnColor === color
                      ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddColumnOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Column</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default KanbanBoard;
