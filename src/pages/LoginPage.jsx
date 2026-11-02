import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Layers,
  ShieldCheck,
  Code2,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { login, loginAsDemoUser, MOCK_USERS } from "../redux/slices/authSlice";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("admin@taskflow.com");
  const [password, setPassword] = useState("password123");
  const [selectedRole, setSelectedRole] = useState("admin"); // 'admin' | 'developer'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleManualLogin = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    dispatch(
      login({
        email: email.trim(),
        password,
        role: selectedRole,
      })
    );
    navigate(from, { replace: true });
  };

  const handleDemoLogin = (user) => {
    dispatch(loginAsDemoUser(user));
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[550px] sm:h-[550px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl">
        {/* Brand / Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-xl shadow-indigo-600/30 text-white mb-4 ring-1 ring-white/20">
            <Layers className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            TaskFlow
            <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              PRO
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Role-Based Project Management & Kanban Workspace
          </p>
        </div>

        {/* 1-Click Demo Accounts Quick Selector */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 mb-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick 1-Click Demo Login:
            </span>
            <span className="text-[11px] text-slate-500">Instant Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Admin Demo Button */}
            <button
              type="button"
              onClick={() => handleDemoLogin(MOCK_USERS[0])}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 hover:border-indigo-400/80 hover:bg-indigo-950/90 transition-all text-left group cursor-pointer shadow-sm hover:shadow-indigo-500/10"
            >
              <img
                src={MOCK_USERS[0].avatar}
                alt={MOCK_USERS[0].name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/50 group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white truncate">
                    {MOCK_USERS[0].name}
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" /> Admin
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  Manage projects & assign tasks
                </div>
              </div>
            </button>

            {/* Developer Demo Button 1 */}
            <button
              type="button"
              onClick={() => handleDemoLogin(MOCK_USERS[1])}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 hover:border-emerald-400/80 hover:bg-emerald-950/90 transition-all text-left group cursor-pointer shadow-sm hover:shadow-emerald-500/10"
            >
              <img
                src={MOCK_USERS[1].avatar}
                alt={MOCK_USERS[1].name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50 group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white truncate">
                    {MOCK_USERS[1].name}
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-emerald-400" /> Dev
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  View assigned & update status
                </div>
              </div>
            </button>
          </div>

          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => handleDemoLogin(MOCK_USERS[2])}
              className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              Or login as Developer 2 (Marcus Ray) &rarr;
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center justify-center mb-6">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Or Sign in with Credentials
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Manual Login Form */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleManualLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="admin@taskflow.com"
                  className="w-full bg-slate-800/70 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/70 border border-slate-700/70 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Role Select Switch */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("admin");
                    setEmail("admin@taskflow.com");
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === "admin"
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                      : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Admin
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("developer");
                    setEmail("sophia@taskflow.com");
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === "developer"
                      ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm"
                      : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  Developer
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full justify-center py-2.5 text-sm font-semibold shadow-lg shadow-indigo-600/20 mt-2"
            >
              Sign In to Workspace
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </div>

        {/* Role Privileges Quick Reference */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Privileges
            </div>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Create, edit & delete boards
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Create & assign tasks to devs
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Export & import board backups
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <div className="font-semibold text-emerald-300 flex items-center gap-1.5 mb-1.5">
              <Code2 className="w-3.5 h-3.5" /> Developer Privileges
            </div>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> View assigned tasks
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Drag & drop task status
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Complete subtasks & comment
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
