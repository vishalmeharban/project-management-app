import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Plus,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Clock,
  Send,
  History,
  CheckSquare,
  Sparkles,
} from "lucide-react";
import {
  addTask,
  updateTask,
  moveTask,
  addComment,
  deleteComment,
} from "../../redux/slices/boardSlice";
import { closeModal } from "../../redux/slices/uiSlice";
import { selectCurrentUser, selectIsAdmin } from "../../redux/slices/authSlice";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { ShieldCheck, Lock } from "lucide-react";


const ASSIGNEES = [
  {
    name: "Sophia Chen",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
  },
  {
    name: "Marcus Ray",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
  },
  {
    name: "Emma Watson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
  },
  {
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
  },
];

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return dateStr;
  }
};

export const TaskModal = () => {
  const dispatch = useDispatch();
  const { activeModal, activeTaskId, activeColumnId } = useSelector(
    (state) => state.ui
  );
  const { boards, tasks, activeBoardId } = useSelector((state) => state.board);
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  const currentBoard = boards.find((b) => b.id === activeBoardId) || boards[0];
  const isEditing = activeModal === "editTask" && activeTaskId;
  const isOpen = activeModal === "createTask" || activeModal === "editTask";

  const targetTask = isEditing && tasks[activeTaskId] ? tasks[activeTaskId] : null;

  // Find column of current task
  const currentTaskColumnId =
    activeColumnId ||
    Object.keys(currentBoard?.columns || {}).find((cId) =>
      currentBoard.columns[cId].taskIds.includes(activeTaskId)
    ) ||
    currentBoard?.columnOrder[0] ||
    "";

  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'comments' | 'activity'
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [columnId, setColumnId] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState(ASSIGNEES[0]);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  // Populate fields when editing or reset when creating
  useEffect(() => {
    if (isEditing && targetTask) {
      setTitle(targetTask.title || "");
      setDescription(targetTask.description || "");
      setPriority(targetTask.priority || "medium");
      setTags(targetTask.tags || []);
      setDueDate(targetTask.dueDate || "");
      setAssignee(targetTask.assignee || ASSIGNEES[0]);
      setSubtasks(targetTask.subtasks || []);
      setColumnId(currentTaskColumnId);
    } else {
      setActiveTab("details");
      setTitle("");
      setDescription("");
      setPriority("medium");
      setTags(["Frontend"]);
      setDueDate(new Date().toISOString().split("T")[0]);
      setAssignee(ASSIGNEES[0]);
      setSubtasks([]);
      setColumnId(activeColumnId || currentBoard?.columnOrder[0] || "");
    }
  }, [isEditing, activeTaskId, activeColumnId, currentBoard, isOpen, currentTaskColumnId]);


  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `sub-${Date.now()}`, text: newSubtaskText.trim(), completed: false },
    ]);
    setNewSubtaskText("");
  };

  const handleToggleSubtask = (subId) => {
    setSubtasks(
      subtasks.map((s) =>
        s.id === subId ? { ...s, completed: !s.completed } : s
      )
    );
  };

  const handleDeleteSubtask = (subId) => {
    setSubtasks(subtasks.filter((s) => s.id !== subId));
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeTaskId) return;

    dispatch(
      addComment({
        taskId: activeTaskId,
        text: newCommentText.trim(),
        author: {
          name: currentUser?.name || "Team Member",
          avatar:
            currentUser?.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        },
      })
    );
    setNewCommentText("");
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Delete this comment?")) {
      dispatch(deleteComment({ taskId: activeTaskId, commentId }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing) {
      // If column/status was changed, move task to new column
      if (
        currentTaskColumnId &&
        columnId &&
        currentTaskColumnId !== columnId
      ) {
        const sourceIndex =
          currentBoard.columns[currentTaskColumnId]?.taskIds.indexOf(
            activeTaskId
          ) ?? 0;
        dispatch(
          moveTask({
            source: {
              droppableId: currentTaskColumnId,
              index: sourceIndex >= 0 ? sourceIndex : 0,
            },
            destination: { droppableId: columnId, index: 0 },
            draggableId: activeTaskId,
          })
        );
      }

      dispatch(
        updateTask({
          taskId: activeTaskId,
          updates: {
            title: title.trim(),
            description: description.trim(),
            priority,
            tags,
            dueDate,
            assignee,
            subtasks,
          },
        })
      );
    } else {
      const targetColumn = columnId || currentBoard?.columnOrder[0];
      const newTask = {
        id: `task-${Date.now()}`,
        boardId: currentBoard.id,
        title: title.trim(),
        description: description.trim(),
        priority,
        tags,
        dueDate,
        assignee: isAdmin
          ? assignee
          : {
              name: currentUser?.name || ASSIGNEES[0].name,
              avatar: currentUser?.avatar || ASSIGNEES[0].avatar,
            },
        subtasks,
        comments: [],
        commentsCount: 0,
        attachmentsCount: 0,
      };

      dispatch(addTask({ columnId: targetColumn, task: newTask }));
    }

    dispatch(closeModal());
  };


  const commentsList = targetTask?.comments || [];
  const activityList = targetTask?.activity || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title={isEditing ? "Task Details" : "Create New Task"}
      className="max-w-xl"
    >
      {/* Tab Navigation (Visible when editing) */}
      {isEditing && (
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "details"
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            Details & Checklist
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("comments")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "comments"
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Comments
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {commentsList.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "activity"
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Activity
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {activityList.length}
            </span>
          </button>
        </div>
      )}

      {/* Tab 1: Details & Form */}
      {activeTab === "details" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement Responsive Sidebar"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, acceptance criteria or details..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
            />
          </div>

          {/* Grid: Column/Status, Priority, Due Date, Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status / Column Selector (Both Admin & Dev can update status) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Column / Status</span>
                <span className="text-[10px] text-emerald-400 font-normal">Update Status</span>
              </label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm cursor-pointer"
              >
                {currentBoard?.columnOrder.map((cId) => (
                  <option key={cId} value={cId}>
                    {currentBoard.columns[cId]?.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>

            {/* Assignee Selection: Admin can assign tasks, Developer sees assigned person */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Assignee</span>
                {isAdmin ? (
                  <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin Assign
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-normal flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Assigned by Admin
                  </span>
                )}
              </label>

              {isAdmin ? (
                <select
                  value={assignee.name}
                  onChange={(e) => {
                    const found = ASSIGNEES.find((a) => a.name === e.target.value);
                    if (found) setAssignee(found);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm cursor-pointer"
                >
                  {ASSIGNEES.map((user) => (
                    <option key={user.name} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-300">
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-600"
                  />
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {assignee.name}
                  </span>
                  {assignee.name === currentUser?.name && (
                    <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                      You
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>


          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Tags (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "Add tag (e.g. Design)..." : ""}
                className="bg-transparent border-none text-xs text-slate-100 focus:outline-none flex-1 min-w-[80px]"
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Subtasks Checklist
            </label>
            <div className="space-y-2 mb-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs"
                >
                  <div
                    onClick={() => handleToggleSubtask(st.id)}
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        st.completed ? "text-emerald-400" : "text-slate-500"
                      }`}
                    />
                    <span
                      className={
                        st.completed
                          ? "line-through text-slate-500"
                          : "text-slate-200"
                      }
                    >
                      {st.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                placeholder="Add a checklist step..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddSubtask}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => dispatch(closeModal())}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Actual Comments Section */}
      {activeTab === "comments" && (
        <div className="space-y-4">
          {/* Post New Comment Box */}
          <form onSubmit={handlePostComment} className="space-y-2">
            <div className="relative">
              <textarea
                rows={2}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment or update for the team..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs resize-none"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={!newCommentText.trim()}
                className="gap-1.5 text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3 pt-2">
            {commentsList.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No comments yet. Be the first to leave a message!
              </div>
            ) : (
              commentsList.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.author?.avatar}
                        alt={c.author?.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/40"
                      />
                      <span className="text-xs font-semibold text-slate-200">
                        {c.author?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">
                        {formatTimeAgo(c.createdAt)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(c.id)}
                        title="Delete comment"
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-8">
                    {c.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Activity Log Feed */}
      {activeTab === "activity" && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 pb-2 border-b border-slate-800">
            Timeline of recent changes and task movements
          </div>

          {activityList.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No activity recorded for this task yet.
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {activityList.map((act) => (
                <div key={act.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-900" />

                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-200">
                      {act.text}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTimeAgo(act.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default TaskModal;
