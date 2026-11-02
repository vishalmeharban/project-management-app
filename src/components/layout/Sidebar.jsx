import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Kanban,
  CheckSquare,
  Plus,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  Layers,
  RotateCcw,
  Edit2,
  Trash2,
  X,
  LogOut,
  ShieldCheck,
  Code2,
  Lock,
} from "lucide-react";
import {
  toggleSidebar,
  openModal,
  setMobileMenuOpen,
} from "../../redux/slices/uiSlice";
import {
  setActiveBoard,
  resetToDefault,
  deleteBoard,
} from "../../redux/slices/boardSlice";
import {
  selectCurrentUser,
  selectIsAdmin,
  logout,
} from "../../redux/slices/authSlice";
import { cn } from "../../utils/cn";


export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSidebarOpen, isMobileMenuOpen } = useSelector((state) => state.ui);
  const { boards, activeBoardId } = useSelector((state) => state.board);
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  const navItems = [
    { name: "Kanban Board", path: "/", icon: Kanban },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "All Tasks", path: "/tasks", icon: CheckSquare },
  ];

  const handleSelectBoard = (boardId) => {
    dispatch(setActiveBoard(boardId));
    dispatch(setMobileMenuOpen(false));
    navigate("/");
  };

  const handleEditBoard = (e, boardId) => {
    e.stopPropagation();
    if (!isAdmin) {
      alert("Only Admins can edit board details.");
      return;
    }
    dispatch(openModal({ type: "editBoard", boardId }));
  };

  const handleDeleteBoard = (e, board) => {
    e.stopPropagation();
    if (!isAdmin) {
      alert("Only Admins can delete boards.");
      return;
    }
    if (boards.length <= 1) {
      alert("You must have at least one board.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete board "${board.title}" and all its tasks?`
      )
    ) {
      dispatch(deleteBoard({ boardId: board.id }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };


  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => dispatch(setMobileMenuOpen(false))}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "h-screen flex flex-col bg-slate-950/95 md:bg-slate-950/90 border-r border-slate-800/80 transition-all duration-300 select-none z-50 fixed md:static inset-y-0 left-0",
          isMobileMenuOpen
            ? "translate-x-0 w-72 shadow-2xl"
            : "-translate-x-full md:translate-x-0",
          isSidebarOpen ? "md:w-64" : "md:w-20"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  TaskFlow
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    PRO
                  </span>
                </span>
                <span className="text-xs text-slate-400">Workspace Hub</span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => dispatch(setMobileMenuOpen(false))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  )
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span>{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Boards Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {isSidebarOpen || isMobileMenuOpen ? (
            <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                Your Boards
              </span>
              <div className="flex items-center gap-1.5">
                {isAdmin ? (
                  <button
                    onClick={() => dispatch(openModal({ type: "createBoard" }))}
                    title="Create New Board (Admin)"
                    className="p-1 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span
                    title="Only Admins can create boards"
                    className="p-1 text-slate-600 cursor-not-allowed"
                  >
                    <Lock className="w-3 h-3" />
                  </span>
                )}
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                  {boards.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2">
              {isAdmin ? (
                <button
                  onClick={() => dispatch(openModal({ type: "createBoard" }))}
                  title="Create New Board (Admin)"
                  className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              ) : (
                <span
                  title="Admin Only"
                  className="p-2 text-slate-600 cursor-not-allowed"
                >
                  <Lock className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          )}

          <div className="space-y-1 mt-1">
            {boards.map((b) => (
              <div
                key={b.id}
                onClick={() => handleSelectBoard(b.id)}
                className={cn(
                  "group relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer",
                  activeBoardId === b.id
                    ? "bg-slate-800 text-white border border-slate-700/80 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <span
                    className={cn(
                      "w-2.5 h-2.5 rounded-full shrink-0",
                      activeBoardId === b.id
                        ? "bg-indigo-400 ring-2 ring-indigo-400/30"
                        : "bg-slate-600"
                    )}
                  />
                  {(isSidebarOpen || isMobileMenuOpen) && (
                    <span className="truncate">{b.title}</span>
                  )}
                </div>

                {/* Action buttons on hover or touch (Admin Only) */}
                {(isSidebarOpen || isMobileMenuOpen) && isAdmin && (
                  <div className="flex items-center gap-1 opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditBoard(e, b.id)}
                      title="Edit Board Details"
                      className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {boards.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteBoard(e, b)}
                        title="Delete Board"
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Profile / Reset section */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {(isSidebarOpen || isMobileMenuOpen) && (
            <button
              onClick={() => {
                if (window.confirm("Reset all boards and tasks to initial demo state?")) {
                  dispatch(resetToDefault());
                  dispatch(setMobileMenuOpen(false));
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          )}

          {/* Current User Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={
                  currentUser?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                }
                alt={currentUser?.name || "User"}
                className="w-8 h-8 rounded-full ring-2 ring-indigo-500/40 object-cover shrink-0"
              />
              {(isSidebarOpen || isMobileMenuOpen) && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {currentUser?.name || "Team Member"}
                  </span>
                  <span className="text-[10px] flex items-center gap-1 font-semibold">
                    {isAdmin ? (
                      <span className="text-indigo-400 flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" /> Admin
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <Code2 className="w-2.5 h-2.5" /> Developer
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {(isSidebarOpen || isMobileMenuOpen) && (
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/70 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;