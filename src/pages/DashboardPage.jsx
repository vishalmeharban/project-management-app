import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { openModal } from "../redux/slices/uiSlice";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boards, tasks, activeBoardId } = useSelector((state) => state.board);

  const currentBoard = boards.find((b) => b.id === activeBoardId) || boards[0];
  const allTasksList = Object.values(tasks);
  const currentBoardTasks = allTasksList.filter(
    (t) => t.boardId === currentBoard?.id
  );

  const completedCount = currentBoardTasks.filter((t) => {
    // Check if task is in a completed/done column
    for (const col of Object.values(currentBoard?.columns || {})) {
      if (
        (col.title.toLowerCase().includes("done") ||
          col.title.toLowerCase().includes("completed")) &&
        col.taskIds.includes(t.id)
      ) {
        return true;
      }
    }
    return false;
  }).length;

  const urgentCount = currentBoardTasks.filter(
    (t) => t.priority === "urgent"
  ).length;

  const inProgressCount = currentBoardTasks.length - completedCount;

  const completionRate =
    currentBoardTasks.length > 0
      ? Math.round((completedCount / currentBoardTasks.length) * 100)
      : 0;

  const statCards = [
    {
      title: "Total Board Tasks",
      value: currentBoardTasks.length,
      icon: FolderKanban,
      color: "from-blue-600 to-indigo-600",
      change: "+4 this week",
    },
    {
      title: "In Progress",
      value: inProgressCount,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      change: "Active workflow",
    },
    {
      title: "Completed",
      value: completedCount,
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-500",
      change: `${completionRate}% complete`,
    },
    {
      title: "Urgent Priority",
      value: urgentCount,
      icon: AlertTriangle,
      color: "from-rose-500 to-red-600",
      change: "Requires attention",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 p-5 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            Productivity Overview
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Welcome to {currentBoard?.title}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Track your team&apos;s sprint velocity, drag-and-drop progress, and milestone
            delivery in real time.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
            <Button size="sm" onClick={() => navigate("/")}>
              <span>Open Kanban Board</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(openModal({ type: "createTask" }))}
            >
              Add New Task
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-xs font-medium text-slate-400">
                  {card.title}
                </span>
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {card.value}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400">{card.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Tasks List */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Recent Tasks in Current Board
            </h3>
            <p className="text-xs text-slate-400">
              Overview of active items assigned to the team
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")}>
            View All Tasks
          </Button>
        </div>

        <div className="divide-y divide-slate-800/60">
          {currentBoardTasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 hover:bg-slate-800/30 px-2 sm:px-3 rounded-xl transition-colors"
            >
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                <Badge priority={task.priority} className="shrink-0 mt-0.5 sm:mt-0">
                  {task.priority}
                </Badge>
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-slate-100">
                    {task.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">
                    {task.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs text-slate-400 pl-8 sm:pl-0">
                {task.dueDate && (
                  <span className="text-[11px] sm:text-xs text-slate-400">{task.dueDate}</span>
                )}
                {task.assignee && (
                  <div className="flex items-center gap-1.5">
                    <img
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                      title={task.assignee.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover ring-1 ring-indigo-500/40"
                    />
                    <span className="text-[11px] sm:hidden text-slate-300">
                      {task.assignee.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
