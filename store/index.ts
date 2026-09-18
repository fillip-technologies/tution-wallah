import { configureStore } from "@reduxjs/toolkit";
import registrationReducer from "./registrationSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registration: registrationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
