import { postData } from "./apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  // Amount is decided by the server from the approved request.
  enrollment_request_id: number;
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    order_id: string;
    amount: number;
    currency: string;
    key: string;        // Razorpay key_id returned from backend
  };
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Step 1: Create a Razorpay order via backend.
 * Backend returns: order_id, amount, currency, and the Razorpay key_id.
 */
export const createRazorpayOrder = async (
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> => {
  return await postData<CreateOrderResponse, CreateOrderPayload>(
    "/payment/create-order",
    payload
  );
};

/**
 * Step 2: Verify payment signature & confirm enrollment via backend.
 * Backend validates the Razorpay signature and marks the enrollment as paid.
 */
export const verifyRazorpayPayment = async (
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentResponse> => {
  return await postData<VerifyPaymentResponse, VerifyPaymentPayload>(
    "/payment/verify",
    payload
  );
};
