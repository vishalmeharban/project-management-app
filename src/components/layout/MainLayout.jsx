import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/uiSlice";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TaskModal from "../kanban/TaskModal";
import BoardModal from "../kanban/BoardModal";

export const MainLayout = () => {
  const dispatch = useDispatch();

  // Global Productivity Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInputFocused =
        activeTag === "input" ||
        activeTag === "textarea" ||
        activeTag === "select" ||
        document.activeElement?.isContentEditable;

      if (isInputFocused) return;

      // 'N' for New Task
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        dispatch(openModal({ type: "createTask" }));
      }
      // '/' to focus Search input
      else if (e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="Search tasks"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [dispatch]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 antialiased font-sans">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Persistent Top Header */}
        <Header />

        {/* Dynamic Route Content */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal />
      <BoardModal />
    </div>
  );
};

export default MainLayout;