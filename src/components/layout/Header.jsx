import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Plus,
  Bell,
  Edit2,
  Menu,
  Download,
  Upload,
  FileCode,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";
import {
  setSearchQuery,
  setFilterPriority,
  importBoard,
} from "../../redux/slices/boardSlice";
import { openModal, toggleMobileMenu } from "../../redux/slices/uiSlice";
import {
  selectCurrentUser,
  selectIsAdmin,
  logout,
  switchRole,
} from "../../redux/slices/authSlice";
import {
  exportBoardAsJSON,
  exportBoardAsCSV,
  parseImportJSON,
} from "../../utils/exportImport";
import Button from "../common/Button";
import { LogOut, ShieldCheck, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boards, tasks, activeBoardId, searchQuery, filterPriority } =
    useSelector((state) => state.board);
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


  const activeBoard =
    boards.find((b) => b.id === activeBoardId) || boards[0];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsExportMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isExportMenuOpen || isUserMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isExportMenuOpen, isUserMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleEditBoard = () => {
    if (!isAdmin) {
      alert("Only Admins can edit board configurations.");
      return;
    }
    if (activeBoard) {
      dispatch(openModal({ type: "editBoard", boardId: activeBoard.id }));
    }
  };


  const handleExportJSON = () => {
    exportBoardAsJSON(activeBoard, tasks);
    setIsExportMenuOpen(false);
  };

  const handleExportCSV = () => {
    exportBoardAsCSV(activeBoard, tasks);
    setIsExportMenuOpen(false);
  };

  const handleTriggerImport = () => {
    setIsExportMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { board, tasks: importedTasks } = await parseImportJSON(file);
      dispatch(importBoard({ board, tasks: importedTasks }));
      alert(`Successfully imported board: "${board.title}"!`);
    } catch (err) {
      alert("Failed to import board: " + err.message);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-20 shrink-0">
      {/* Hidden File Input for Board Import */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* Left: Mobile Menu Trigger + Board Title & Category */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => dispatch(toggleMobileMenu())}
          className="p-1.5 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 md:hidden cursor-pointer shrink-0"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-[110px] xs:max-w-[150px] sm:max-w-xs md:max-w-none">
            {activeBoard?.title}
          </h2>
          {activeBoard && isAdmin && (
            <button
              onClick={handleEditBoard}
              title="Edit board name and category (Admin Only)"
              className="p-1 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {activeBoard?.category && (
            <span className="hidden lg:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800/80 text-indigo-400 border border-slate-700/60 shrink-0">
              {activeBoard.category}
            </span>
          )}
        </div>
      </div>

      {/* Right: Search, Filter, Export/Import, & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Search Bar */}
        <div className="relative w-28 xs:w-36 sm:w-44 md:w-56">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search tasks..."
            className="w-full pl-8 sm:pl-9 pr-2.5 sm:pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/70 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Priority Filter (Hidden on small mobile) */}
        <div className="relative hidden md:block">
          <select
            value={filterPriority}
            onChange={(e) => dispatch(setFilterPriority(e.target.value))}
            className="pl-3 pr-8 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/70 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🔵 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        {/* Export / Import Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            title="Export or Import Board"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/70 text-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline font-medium">Export / Import</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isExportMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800/80">
                Board Data
              </div>

              {isAdmin ? (
                <button
                  onClick={handleTriggerImport}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:bg-slate-800/80 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-medium">Import Board (JSON)</div>
                    <div className="text-[10px] text-slate-400">Restore from backup file</div>
                  </div>
                </button>
              ) : (
                <div className="px-3 py-2 text-slate-500 flex items-center gap-2 cursor-not-allowed">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <div>
                    <div className="font-medium">Import Board</div>
                    <div className="text-[10px] text-slate-600">Admin Only</div>
                  </div>
                </div>
              )}

              <button
                onClick={handleExportJSON}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:bg-slate-800/80 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                <div>
                  <div className="font-medium">Export as JSON</div>
                  <div className="text-[10px] text-slate-400">Complete board backup</div>
                </div>
              </button>

              <button
                onClick={handleExportCSV}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-200 hover:bg-slate-800/80 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-medium">Export as CSV</div>
                  <div className="text-[10px] text-slate-400">Excel / Google Sheets</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Create Task Button */}
        <Button
          size="sm"
          onClick={() => dispatch(openModal({ type: "createTask" }))}
          className="shadow-indigo-600/20 px-2 sm:px-3.5"
          title={isAdmin ? "Create Task & Assign" : "Create Task"}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </Button>

        {/* User Profile & Role Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-900/90 border border-slate-700/70 hover:border-slate-600 transition-all cursor-pointer"
            title="User Account & Roles"
          >
            <img
              src={
                currentUser?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              }
              alt={currentUser?.name || "User"}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/50"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight max-w-[80px] truncate">
                {currentUser?.name?.split(" ")[0] || "User"}
              </span>
              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-0.5">
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-2.5 h-2.5 text-indigo-400" />
                    Admin
                  </>
                ) : (
                  <>
                    <Code2 className="w-2.5 h-2.5 text-emerald-400" />
                    Dev
                  </>
                )}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Card Header */}
              <div className="px-3.5 py-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-100 truncate">
                      {currentUser?.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {currentUser?.email}
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                      isAdmin
                        ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    }`}
                  >
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="w-3 h-3" />
                        Administrator (Full Access)
                      </>
                    ) : (
                      <>
                        <Code2 className="w-3 h-3" />
                        Developer (Task Focus)
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Quick Role Switcher for Testing */}
              <div className="px-3.5 py-2 border-b border-slate-800/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider block mb-1.5">
                  Quick Role Switch
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      dispatch(switchRole("admin"));
                      setIsUserMenuOpen(false);
                    }}
                    className={`py-1 px-2 rounded-lg text-[11px] font-medium border text-center transition-all cursor-pointer ${
                      isAdmin
                        ? "bg-indigo-600/30 border-indigo-500 text-indigo-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    👑 As Admin
                  </button>
                  <button
                    onClick={() => {
                      dispatch(switchRole("developer"));
                      setIsUserMenuOpen(false);
                    }}
                    className={`py-1 px-2 rounded-lg text-[11px] font-medium border text-center transition-all cursor-pointer ${
                      !isAdmin
                        ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    💻 As Developer
                  </button>
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-1.5 px-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;