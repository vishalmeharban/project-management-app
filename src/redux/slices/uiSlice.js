import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  activeModal: null, // 'createTask' | 'editTask' | 'createBoard' | 'editBoard' | 'createColumn' | null
  activeTaskId: null,
  activeColumnId: null,
  activeBoardModalId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.isMobileMenuOpen = action.payload;
    },
    openModal: (state, action) => {
      const {
        type,
        taskId = null,
        columnId = null,
        boardId = null,
      } = action.payload;
      state.activeModal = type;
      state.activeTaskId = taskId;
      state.activeColumnId = columnId;
      state.activeBoardModalId = boardId;
      state.isMobileMenuOpen = false; // close mobile menu when modal opens
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.activeTaskId = null;
      state.activeColumnId = null;
      state.activeBoardModalId = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
