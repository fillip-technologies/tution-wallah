export interface InquiryResponse {
  success: boolean;
  message: string;
  data: InquiryData;
}

export interface InquiryData {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at: string;
}
