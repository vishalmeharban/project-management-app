import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Plus, Trash2, Edit2, Check, GripVertical } from "lucide-react";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/uiSlice";
import {
  deleteColumn,
  updateColumnTitle,
} from "../../redux/slices/boardSlice";
import TaskCard from "./TaskCard";
import { cn } from "../../utils/cn";

export const KanbanColumn = ({ column, tasks = [], dragHandleProps = {} }) => {
  const dispatch = useDispatch();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);

  const handleAddTask = () => {
    dispatch(openModal({ type: "createTask", columnId: column.id }));
  };

  const handleDeleteColumn = () => {
    if (
      window.confirm(
        `Are you sure you want to delete column "${column.title}" and its tasks?`
      )
    ) {
      dispatch(deleteColumn({ columnId: column.id }));
    }
  };

  const handleSaveTitle = () => {
    if (titleInput.trim() && titleInput.trim() !== column.title) {
      dispatch(
        updateColumnTitle({
          columnId: column.id,
          title: titleInput.trim(),
        })
      );
    } else {
      setTitleInput(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitleInput(column.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="flex flex-col w-[84vw] xs:w-[78vw] sm:w-80 shrink-0 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-lg backdrop-blur-md max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)]">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-800/60 select-none">
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          {/* Column Drag Handle */}
          <div
            {...dragHandleProps}
            title="Drag column to reorder"
            className="p-1 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing shrink-0"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          <span
            className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0"
            style={{ backgroundColor: column.color || "#6366f1" }}
          />

          {/* Inline Title Editor */}
          {isEditingTitle ? (
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input
                type="text"
                autoFocus
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleKeyDown}
                className="w-full px-2 py-0.5 rounded-md bg-slate-800 text-xs font-semibold text-slate-100 border border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onMouseDown={handleSaveTitle}
                className="p-1 rounded text-emerald-400 hover:bg-slate-800 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onDoubleClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-1.5 truncate group cursor-pointer"
              title="Double-click to edit column title"
            >
              <h3 className="font-semibold text-sm text-slate-100 tracking-tight truncate">
                {column.title}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                title="Edit title"
                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-indigo-400 transition-opacity"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}

          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-400 border border-slate-700/50 shrink-0">
            {tasks.length}
          </span>
        </div>

        {/* Column Actions: Add task & Delete column */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleAddTask}
            title="Add task to column"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteColumn}
            title="Delete column"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Droppable Task Container */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors rounded-b-2xl",
              snapshot.isDraggingOver && "bg-slate-800/30 ring-1 ring-indigo-500/30"
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
              />
            ))}

            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div
                onClick={handleAddTask}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 hover:text-slate-300 hover:border-slate-700 cursor-pointer transition-colors text-xs"
              >
                <Plus className="w-5 h-5 mb-1" />
                <span>No tasks yet. Click to add</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
