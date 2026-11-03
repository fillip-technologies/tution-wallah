export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  error: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  phone: string;
  alternate_phone: string | null;
  gender: string | null;
  date_of_birth: string | null;
  address: string | null;
  full_address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  pincode: string | null;
  profile_image: string | null;
  is_active: boolean;
  admission_status: string;
  parent_name: string | null;
  parent_phone: string | null;
  education_level: string | null;
  school_college_name: string | null;
  interests: string | null;
  qualification: string | null;
  subjects: string | null;
  experience_years: string | null;
  bio: string | null;
  institute_name: string | null;
  institute_type: string | null;
  target_exam: string | null;
  institute_slug: string | null;
  registration_number: string | null;
  year_established: string | null;
  institute_description: string | null;
  website: string | null;
  logo: string | null;
  banner_image: string | null;
  amenities: string | null;
  is_verified: boolean;
  latitude: string | null;
  longitude: string | null;
}
