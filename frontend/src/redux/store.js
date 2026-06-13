import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import { tasksApi } from "../features/tasks/tasksSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // tasksApi needs its own section in the store for caching
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  // The middleware handles cache lifetime, invalidation, and polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware),
});

export default store;