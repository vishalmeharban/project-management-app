import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addBoard, updateBoard } from "../../redux/slices/boardSlice";
import { closeModal } from "../../redux/slices/uiSlice";
import Modal from "../common/Modal";
import Button from "../common/Button";

const TEMPLATES = [
  {
    name: "Standard Agile Kanban",
    description: "To Do ➔ In Progress ➔ Review ➔ Completed",
    columns: [
      { id: "col-1", title: "To Do", color: "#6366f1" },
      { id: "col-2", title: "In Progress", color: "#f59e0b" },
      { id: "col-3", title: "Under Review", color: "#8b5cf6" },
      { id: "col-4", title: "Completed", color: "#10b981" },
    ],
  },
  {
    name: "Simple Task Flow",
    description: "To Do ➔ Done",
    columns: [
      { id: "col-1", title: "Pending", color: "#6366f1" },
      { id: "col-2", title: "Done", color: "#10b981" },
    ],
  },
  {
    name: "Bug & Issue Tracking",
    description: "Reported ➔ Triage ➔ In Fix ➔ Resolved",
    columns: [
      { id: "col-1", title: "Reported", color: "#ef4444" },
      { id: "col-2", title: "In Triage", color: "#f59e0b" },
      { id: "col-3", title: "Fix in Progress", color: "#3b82f6" },
      { id: "col-4", title: "Resolved", color: "#10b981" },
    ],
  },
];

const CATEGORIES = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Operations",
  "Sales",
  "Personal",
];

export const BoardModal = () => {
  const dispatch = useDispatch();
  const { activeModal, activeBoardModalId } = useSelector((state) => state.ui);
  const { boards } = useSelector((state) => state.board);

  const isEditing = activeModal === "editBoard";
  const isOpen = activeModal === "createBoard" || activeModal === "editBoard";

  const targetBoard = isEditing
    ? boards.find((b) => b.id === activeBoardModalId)
    : null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  useEffect(() => {
    if (isEditing && targetBoard) {
      setTitle(targetBoard.title || "");
      setDescription(targetBoard.description || "");
      setCategory(targetBoard.category || "Engineering");
    } else {
      setTitle("");
      setDescription("");
      setCategory("Engineering");
      setSelectedTemplate(0);
    }
  }, [isEditing, targetBoard, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && targetBoard) {
      dispatch(
        updateBoard({
          boardId: targetBoard.id,
          updates: {
            title: title.trim(),
            description: description.trim(),
            category,
          },
        })
      );
    } else {
      const template = TEMPLATES[selectedTemplate];
      const newBoardId = `board-${Date.now()}`;

      const columnsMap = {};
      const columnOrder = [];

      template.columns.forEach((col, idx) => {
        const colId = `col-${Date.now()}-${idx}`;
        columnsMap[colId] = {
          id: colId,
          title: col.title,
          color: col.color,
          taskIds: [],
        };
        columnOrder.push(colId);
      });

      const newBoard = {
        id: newBoardId,
        title: title.trim(),
        description: description.trim(),
        category,
        columns: columnsMap,
        columnOrder,
      };

      dispatch(addBoard({ board: newBoard }));
    }

    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      title={isEditing ? "Edit Board Details" : "Create New Board"}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Board Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q2 Mobile App Launch 🚀"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief purpose of this board..."
            className="w-full px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Template Picker (Only for new boards) */}
        {!isEditing && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Select Starting Template
            </label>
            <div className="space-y-2">
              {TEMPLATES.map((tmpl, index) => (
                <div
                  key={tmpl.name}
                  onClick={() => setSelectedTemplate(index)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedTemplate === index
                      ? "bg-indigo-600/15 border-indigo-500/50 text-slate-100 ring-1 ring-indigo-500/30"
                      : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="font-semibold text-slate-100 mb-0.5">
                    {tmpl.name}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {tmpl.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
            {isEditing ? "Save Changes" : "Create Board"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BoardModal;
