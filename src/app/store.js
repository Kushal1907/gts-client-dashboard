// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "../features/clients/clientSlice";

export const store = configureStore({
  reducer: {
    clients: clientReducer, // Our client slice
    // Remove counter or other default reducers if present
  },
});
