import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InstituteRegistrationPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  city: string;
  state: string;
  full_address: string;
  pincode: string;
  service: string;
  term_condition: string;
  adhar_number: string;
  blur: string;
  isVerified: string;
}

export interface Subject {
  subject_name: string;
  monthly_fee: number;
  yearly_fee: number;
}

interface RegistrationState {
  institute: InstituteRegistrationPayload | null;
  subjects: Subject[];
}

const initialState: RegistrationState = {
  institute: null,
  subjects: [],
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setInstituteData(state, action: PayloadAction<InstituteRegistrationPayload>) {
      state.institute = action.payload;
    },
    setSubjects(state, action: PayloadAction<Subject[]>) {
      state.subjects = action.payload;
    },
    clearRegistration(state) {
      state.institute = null;
      state.subjects = [];
    },
  },
});

export const { setInstituteData, setSubjects, clearRegistration } =
  registrationSlice.actions;
export default registrationSlice.reducer;
