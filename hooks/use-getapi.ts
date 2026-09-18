import { fetchData } from "@/services/apiClient";
import { useCallback, useEffect, useRef, useState } from "react";

export const useGetApiData = <T>(endpoint?: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(endpoint?.trim()));
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, []);

  const getData = useCallback(async () => {
    const normalizedEndpoint = endpoint?.trim();

    if (!normalizedEndpoint) {
      requestIdRef.current += 1;
      if (isMountedRef.current) {
        setData(null);
        setError(null);
        setLoading(false);
      }
      return null;
    }

    const currentRequestId = ++requestIdRef.current;

    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const result = await fetchData<T>(normalizedEndpoint);

      if (
        isMountedRef.current &&
        requestIdRef.current === currentRequestId
      ) {
        setData(result ?? null);
      }

      return result ?? null;
    } catch (err: any) {
      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        `Failed to fetch from ${normalizedEndpoint}`;

      if (
        isMountedRef.current &&
        requestIdRef.current === currentRequestId
      ) {
        setData(null);
        setError(backendError);
      }

      return null;
    } finally {
      if (
        isMountedRef.current &&
        requestIdRef.current === currentRequestId
      ) {
        setLoading(false);
      }
    }
  }, [endpoint]);

  useEffect(() => {
    void getData();
  }, [getData]);

  return { data, loading, error, refetch: getData };
};
