import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import {
  Calendar,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Trash2,
  Edit2,
  GripVertical,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTask,
  toggleSubtask,
  setFilterTag,
} from "../../redux/slices/boardSlice";
import { openModal } from "../../redux/slices/uiSlice";
import { selectCurrentUser, selectIsAdmin } from "../../redux/slices/authSlice";
import Badge from "../common/Badge";
import { cn } from "../../utils/cn";

export const TaskCard = ({ task, index, columnId }) => {
  const dispatch = useDispatch();
  const { filterTag } = useSelector((state) => state.board);
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  if (!task) return null;

  const isAssignedToMe = task.assignee?.name === currentUser?.name;

  const completedSubtasks =
    task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!isAdmin) {
      alert("Only Admins can delete tasks.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask({ taskId: task.id, columnId }));
    }
  };


  const handleEdit = (e) => {
    e.stopPropagation();
    dispatch(openModal({ type: "editTask", taskId: task.id, columnId }));
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleEdit}
          className={cn(
            "group relative rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 p-4 transition-all duration-200 shadow-sm hover:shadow-md hover:border-slate-600/80 mb-3 cursor-grab active:cursor-grabbing select-none",
            snapshot.isDragging &&
              "shadow-2xl ring-2 ring-indigo-500/80 bg-slate-850 scale-102 rotate-1 opacity-95 z-50 cursor-grabbing"
          )}
        >
          {/* Header row: Priority & Drag Handle & Actions */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge priority={task.priority}>{task.priority}</Badge>
              {isAssignedToMe && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                  Assigned to you
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={handleEdit}
                title="Edit task & status"
                className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60 rounded cursor-pointer transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              {isAdmin && (
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={handleDelete}
                  title="Delete task (Admin Only)"
                  className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <div
                title="Drag to reorder or move"
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>


          {/* Title */}
          <h4 className="text-sm font-semibold text-slate-100 mb-1.5 leading-snug">
            {task.title}
          </h4>

          {/* Description preview */}
          {task.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {task.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setFilterTag(filterTag === tag ? "all" : tag));
                  }}
                  title={`Filter by #${tag}`}
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-medium rounded transition-all cursor-pointer",
                    filterTag === tag
                      ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400"
                      : "bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/30"
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Subtasks Progress */}
          {totalSubtasks > 0 && (
            <div className="mb-3 p-2 rounded-lg bg-slate-900/40 border border-slate-700/30">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3 text-indigo-400" />
                  Subtasks
                </span>
                <span>
                  {completedSubtasks}/{totalSubtasks} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer info: Date, comments, assignee */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/40 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              {task.dueDate && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-300">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {task.dueDate}
                </span>
              )}

              {(task.comments?.length ?? task.commentsCount ?? 0) > 0 && (
                <span className="flex items-center gap-1 text-[11px]">
                  <MessageSquare className="w-3 h-3" />
                  {task.comments?.length ?? task.commentsCount}
                </span>
              )}

              {task.attachmentsCount > 0 && (
                <span className="flex items-center gap-1 text-[11px]">
                  <Paperclip className="w-3 h-3" />
                  {task.attachmentsCount}
                </span>
              )}
            </div>

            {task.assignee && (
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                title={task.assignee.name}
                className="w-5 h-5 rounded-full ring-1 ring-indigo-500/50 object-cover"
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
