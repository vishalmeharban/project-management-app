import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./slices/boardSlice";
import uiReducer from "./slices/uiSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    board: boardReducer,
    ui: uiReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

