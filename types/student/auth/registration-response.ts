export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  adhar_number: string;
  education_level: string;
  target_exam: string;
  subjects: string;
  role: string;
  city: string;
  full_address: string;
  term_condition: boolean;
  updated_at: string;
  created_at: string;
}

export interface RegistrationResponse {
  message: string;
  user: User;
  token: string;
}
