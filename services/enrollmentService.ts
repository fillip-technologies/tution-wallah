import { fetchData, postData } from "./apiClient";

export type EnrollmentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "paid"
  | "expired";

export interface EnrollmentRequest {
  id: number;
  status: EnrollmentStatus;
  student_id: number;
  institute_id: number;
  subject_id: number;
  student_note: string | null;
  reject_reason: string | null;
  amount: number | null;
  approved_at: string | null;
  expires_at: string | null;
  paid_at: string | null;
  created_at: string;
  subject_name: string | null;
  institute_name: string | null;
  student?: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    education_level: string | null;
  } | null;
}

interface ApiResult<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ─── Student ──────────────────────────────────────────────────────────────────

export const requestEnrollment = (subject_id: number | string, student_note?: string) =>
  postData<ApiResult<EnrollmentRequest>, object>("/enrollment/request", {
    subject_id,
    student_note: student_note?.trim() || undefined,
  });

export const cancelEnrollmentRequest = (id: number) =>
  postData<ApiResult<EnrollmentRequest>, object>(`/enrollment/${id}/cancel`, {});

export const getMyEnrollmentRequests = () =>
  fetchData<ApiResult<EnrollmentRequest[]>>("/enrollment/my-requests");

// ─── Institute ────────────────────────────────────────────────────────────────

export const approveEnrollmentRequest = (id: number) =>
  postData<ApiResult<EnrollmentRequest>, object>(
    `/institute/enrollment-requests/${id}/approve`,
    {}
  );

export const rejectEnrollmentRequest = (id: number, reason?: string) =>
  postData<ApiResult<EnrollmentRequest>, object>(
    `/institute/enrollment-requests/${id}/reject`,
    { reason: reason?.trim() || undefined }
  );
