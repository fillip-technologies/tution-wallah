import { postData } from "@/services/apiClient";
import { useState } from "react";

export const usePostApiData = <T, D = unknown>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async (
    endpoint: string,
    payload: D,
    config?: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await postData<T, D>(endpoint, payload, config);
      console.log(`Response from ${endpoint}:`, result);
      setData(result ?? null);
      return result;
    } catch (err: any) {
      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        `Failed to post to ${endpoint}`;

      console.error(`Error posting data to ${endpoint}:`, backendError);
      setError(backendError);

      return { error: backendError };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, post };
};
