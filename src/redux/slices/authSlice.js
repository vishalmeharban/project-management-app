import { createSlice } from "@reduxjs/toolkit";

export const MOCK_USERS = [
  {
    id: "user-admin-1",
    name: "Alex Morgan",
    email: "admin@taskflow.com",
    password: "password123",
    role: "admin", // 'admin' | 'developer'
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    title: "Project Lead & Admin",
    department: "Engineering Lead",
  },
  {
    id: "user-dev-1",
    name: "Sophia Chen",
    email: "sophia@taskflow.com",
    password: "password123",
    role: "developer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    title: "Senior Frontend Engineer",
    department: "UI / UX Core",
  },
  {
    id: "user-dev-2",
    name: "Marcus Ray",
    email: "marcus@taskflow.com",
    password: "password123",
    role: "developer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    title: "Backend & Systems Engineer",
    department: "Cloud & APIs",
  },
  {
    id: "user-dev-3",
    name: "David Kim",
    email: "david@taskflow.com",
    password: "password123",
    role: "developer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    title: "Fullstack Developer",
    department: "Platform Engineering",
  },
];

const loadInitialUser = () => {
  try {
    const saved = localStorage.getItem("taskflow_auth_user");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error("Failed to parse saved auth user", err);
  }
  // Default: start with Admin for immediate ease of inspection or null
  // Let's default to null so login page is displayed when starting fresh or logged out
  return null;
};

const savedUser = loadInitialUser();

const initialState = {
  currentUser: savedUser,
  isAuthenticated: !!savedUser,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password, role } = action.payload;

      // Try matching an existing mock user
      let matchedUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === (email || "").toLowerCase()
      );

      // If matched user exists, optionally verify role or override role if specified
      if (matchedUser) {
        state.currentUser = {
          ...matchedUser,
          role: role || matchedUser.role,
        };
      } else {
        // Allow custom email login with selected role
        const derivedName = email ? email.split("@")[0] : "Team Member";
        const formattedName =
          derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

        state.currentUser = {
          id: `user-${Date.now()}`,
          name: formattedName,
          email: email || "user@taskflow.com",
          role: role || "developer",
          avatar:
            role === "admin"
              ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
          title: role === "admin" ? "Project Manager" : "Software Developer",
          department: "Product Engineering",
        };
      }

      state.isAuthenticated = true;
      state.error = null;

      try {
        localStorage.setItem(
          "taskflow_auth_user",
          JSON.stringify(state.currentUser)
        );
      } catch (err) {
        console.error("Failed to save auth to localStorage", err);
      }
    },

    loginAsDemoUser: (state, action) => {
      const user = action.payload;
      state.currentUser = user;
      state.isAuthenticated = true;
      state.error = null;
      try {
        localStorage.setItem(
          "taskflow_auth_user",
          JSON.stringify(state.currentUser)
        );
      } catch (err) {
        console.error("Failed to save auth to localStorage", err);
      }
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      try {
        localStorage.removeItem("taskflow_auth_user");
      } catch (err) {
        console.error("Failed to remove auth from localStorage", err);
      }
    },

    switchRole: (state, action) => {
      if (state.currentUser) {
        state.currentUser.role = action.payload; // 'admin' | 'developer'
        try {
          localStorage.setItem(
            "taskflow_auth_user",
            JSON.stringify(state.currentUser)
          );
        } catch (err) {
          console.error("Failed to update role in localStorage", err);
        }
      }
    },
  },
});

export const { login, loginAsDemoUser, logout, switchRole } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.currentUser?.role === "admin";
export const selectIsDeveloper = (state) =>
  state.auth.currentUser?.role === "developer";

export default authSlice.reducer;
