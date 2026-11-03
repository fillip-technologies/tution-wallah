import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  studentToken: string | null;
  instituteToken: string | null;
  role: "student" | "institute" | null;
  studentId: string | null;
  instituteId: string | null;
}

const initialState: AuthState = {
  studentToken: null,
  instituteToken: null,
  role: null,
  studentId: null,
  instituteId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setStudentToken: (state, action: PayloadAction<string>) => {
      state.studentToken = action.payload;
      state.role = "student";
    },
    setInstituteToken: (state, action: PayloadAction<string>) => {
      state.instituteToken = action.payload;
      state.role = "institute";
    },
    clearAuth: (state) => {
      state.studentToken = null;
      state.instituteToken = null;
      state.role = null;
      state.studentId = null;
      state.instituteId = null;
    },
    setInstituteId: (state, action: PayloadAction<string>) => {
      state.instituteId = action.payload;
    },
    setStudentId: (state, action: PayloadAction<string>) => {
      state.studentId = action.payload;
    },
  },
});

export const {
  setStudentToken,
  setInstituteToken,
  clearAuth,
  setStudentId,
  setInstituteId,
} = authSlice.actions;

export default authSlice.reducer;
