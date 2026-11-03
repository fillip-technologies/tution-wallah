export interface RegistrationResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
  logo_url: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  institute_name: string;
  institute_slug: string;
  institute_type: string;
  registration_number: string;
  year_established: string;
  institute_description: string;
  website: string;
  logo: string | null;
  created_at: string;
  updated_at: string;
}
