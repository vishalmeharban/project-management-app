import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Trash2,
  Edit2,
  Calendar,
  ArrowUpDown,
  Tag,
  X,
} from "lucide-react";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  deleteTask,
  setSortBy,
  setFilterTag,
  clearAllFilters,
} from "../redux/slices/boardSlice";
import { openModal } from "../redux/slices/uiSlice";

export const TasksPage = () => {
  const dispatch = useDispatch();
  const {
    tasks,
    boards,
    activeBoardId,
    searchQuery,
    filterPriority,
    filterTag,
    sortBy,
  } = useSelector((state) => state.board);

  const allTasks = Object.values(tasks);

  // Extract all unique tags
  const availableTags = Array.from(
    new Set(allTasks.flatMap((t) => t.tags || []))
  );

  const filteredTasks = allTasks.filter((task) => {
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
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "deadline") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "priority") {
      const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (
        (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0)
      );
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const getColumnName = (taskId) => {
    for (const b of boards) {
      for (const col of Object.values(b.columns)) {
        if (col.taskIds.includes(taskId)) {
          return col.title;
        }
      }
    }
    return "Unassigned";
  };

  const hasActiveFilters =
    searchQuery ||
    filterPriority !== "all" ||
    filterTag !== "all" ||
    sortBy !== "default";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            All Tasks List
          </h1>
          <p className="text-xs text-slate-400">
            View, search, sort and manage all tasks across columns
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => dispatch(openModal({ type: "createTask" }))}
          className="shrink-0 self-start sm:self-auto"
        >
          <span>+ Create Task</span>
        </Button>
      </div>

      {/* Filter and Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="bg-transparent text-slate-200 border-none outline-none cursor-pointer"
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
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-2.5 py-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <select
              value={filterTag}
              onChange={(e) => dispatch(setFilterTag(e.target.value))}
              className="bg-transparent text-slate-200 border-none outline-none cursor-pointer"
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
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            {filterTag !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px]">
                Tag: #{filterTag}
                <button
                  onClick={() => dispatch(setFilterTag("all"))}
                  className="hover:text-rose-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => dispatch(clearAllFilters())}
              className="text-[11px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Tasks Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800 whitespace-nowrap">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Task</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Status / Column</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Priority</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Due Date</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Assignee</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No matching tasks found.
                  </td>
                </tr>
              ) : (
                sortedTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3.5">
                      <div className="font-semibold text-slate-100">
                        {task.title}
                      </div>
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {task.tags.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() =>
                                dispatch(
                                  setFilterTag(filterTag === t ? "all" : t)
                                )
                              }
                              className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer ${
                                filterTag === t
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              #{t}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                        {getColumnName(task.id)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <Badge priority={task.priority}>{task.priority}</Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {task.dueDate || "No date"}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      {task.assignee ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/40"
                          />
                          <span className="text-xs text-slate-300">
                            {task.assignee.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            dispatch(
                              openModal({
                                type: "editTask",
                                taskId: task.id,
                              })
                            )
                          }
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this task?"
                              )
                            ) {
                              dispatch(
                                deleteTask({
                                  taskId: task.id,
                                  columnId: "col-1",
                                })
                              );
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
