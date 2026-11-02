import React from "react";
import KanbanBoard from "../components/kanban/KanbanBoard";

export const BoardPage = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <KanbanBoard />
    </div>
  );
};

export default BoardPage;
