// Utilities for exporting and importing board and task data

export const exportBoardAsJSON = (board, allTasks) => {
  if (!board) return;

  // Collect tasks belonging to this board
  const boardTasks = {};
  Object.values(board.columns || {}).forEach((col) => {
    (col.taskIds || []).forEach((tId) => {
      if (allTasks[tId]) {
        boardTasks[tId] = allTasks[tId];
      }
    });
  });

  const exportData = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    board,
    tasks: boardTasks,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const cleanName = (board.title || "board")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
  link.href = url;
  link.download = `${cleanName}_backup.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportBoardAsCSV = (board, allTasks) => {
  if (!board) return;

  const headers = [
    "Task ID",
    "Title",
    "Description",
    "Column",
    "Priority",
    "Due Date",
    "Assignee",
    "Tags",
    "Subtasks Total",
    "Subtasks Completed",
    "Comments Count",
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = [];
  rows.push(headers.map(escapeCSV).join(","));

  Object.values(board.columns || {}).forEach((col) => {
    (col.taskIds || []).forEach((tId) => {
      const task = allTasks[tId];
      if (!task) return;

      const completedSubtasks =
        task.subtasks?.filter((s) => s.completed).length || 0;
      const totalSubtasks = task.subtasks?.length || 0;

      const row = [
        task.id,
        task.title,
        task.description || "",
        col.title,
        task.priority,
        task.dueDate || "",
        task.assignee?.name || "Unassigned",
        (task.tags || []).join("; "),
        totalSubtasks,
        completedSubtasks,
        task.commentsCount || task.comments?.length || 0,
      ];

      rows.push(row.map(escapeCSV).join(","));
    });
  });

  const csvContent = rows.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const cleanName = (board.title || "board")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
  link.href = url;
  link.download = `${cleanName}_tasks.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const parseImportJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.board || !parsed.board.title || !parsed.board.columns) {
          reject(new Error("Invalid board file structure."));
          return;
        }

        // Give imported board a fresh ID or keep existing
        const board = {
          ...parsed.board,
          id: `board-${Date.now()}`,
          title: `${parsed.board.title} (Imported)`,
        };

        const tasks = parsed.tasks || {};

        resolve({ board, tasks });
      } catch (err) {
        reject(new Error("Failed to parse JSON file: " + err.message));
      }
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsText(file);
  });
};
