import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "@/store/index";
import { clearAuth } from "@/store/authSlice";

// ─── Environment URL Toggle (true = test locally, false = live server) ────────
const USE_LOCAL_BACKEND = true;
const LOCAL_IP = "192.168.0.113";

export const BASE_URL = USE_LOCAL_BACKEND
  ? `http://${LOCAL_IP}:8001/api`
  : "https://tutionwalah.com/api";

// ─── Single authenticated axios instance ──────────────────────────────────────
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  validateStatus: (status) => status >= 200 && status < 400,
});

// Attaches Bearer token to every request (GET and POST)
apiClient.interceptors.request.use(async (config) => {
  try {
    let token: string | null = null;
    const stored = await AsyncStorage.getItem("auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      token = parsed?.token || null;
    }

    // Fallback to in-memory Redux store if storage has not resolved or is empty
    if (!token) {
      const state = store.getState();
      token = state.auth.studentToken || state.auth.instituteToken || null;
    }

    if (config.headers) {
      if (typeof (config.headers as any).set === "function") {
        (config.headers as any).set("Accept", "application/json");
      } else {
        config.headers["Accept"] = "application/json";
      }
    }

    if (token) {
      if (config.headers && typeof (config.headers as any).set === "function") {
        (config.headers as any).set("Authorization", `Bearer ${token}`);
      } else if (config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.warn("Failed to retrieve auth token for request:", error);
  }
  return config;
});

// Intercepts 401 Unauthorized responses to clean up expired credentials
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem("auth");
        store.dispatch(clearAuth());
      } catch (storageError) {
        console.warn("Error clearing auth storage on 401:", storageError);
      }
    }
    return Promise.reject(error);
  }
);

// ─── POST ─────────────────────────────────────────────────────────────────────
export const postData = async <T, D = unknown>(
  endpoint: string,
  data: D,
  config?: Record<string, any>
): Promise<T> => {
  try {
    const response = await apiClient.post<T>(endpoint, data, config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const message =
      (axiosError.response?.data as any)?.message ||
      (axiosError.response?.data as any)?.error ||
      axiosError.message;
    console.warn(`[API POST ${endpoint}] ${status ? `(${status}) ` : ""}${message}`);
    throw axiosError;
  }
};

// ─── GET ──────────────────────────────────────────────────────────────────────
export const fetchData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await apiClient.get<T>(endpoint);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const message =
      (axiosError.response?.data as any)?.message ||
      (axiosError.response?.data as any)?.error ||
      axiosError.message;
    console.warn(`[API GET ${endpoint}] ${status ? `(${status}) ` : ""}${message}`);
    throw axiosError;
  }
};

