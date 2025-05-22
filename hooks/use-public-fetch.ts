import { useEffect, useState } from "react";
import { ApiResponse } from "@/lib/utils/api.service";

export function usePublicFetch<T, P = any>(
  resourceFn: (...args: P[]) => Promise<ApiResponse<T>>,
  options: {
    resourceParams?: P[];
    dependencies?: any[];
    enabled?: boolean;
  } = {},
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { resourceParams = [], dependencies = [], enabled = true } = options;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!enabled) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await resourceFn(...resourceParams);

        if (isMounted) {
          if (response.success) {
            setData(response.data);
            setError(null);
          } else {
            setData(null);
            setError(response.error);
          }
        }
      } catch (error) {
        if (isMounted) {
          setData(null);
          setError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [enabled, ...dependencies]);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await resourceFn(...resourceParams);
      if (response.success) {
        setData(response.data);
        setError(null);
      } else {
        setData(null);
        setError(response.error);
      }
    } catch (error) {
      setData(null);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, refetch };
}

interface PublicActionOptions<T = any> {
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: any) => void | Promise<void>;
  resetOnSuccess?: boolean;
}

export function usePublicAction<T, P extends any[]>(
  resourceFn: (...args: P) => Promise<ApiResponse<T>>,
  options: PublicActionOptions<T> = {},
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);
  const { onSuccess, onError, resetOnSuccess = true } = options;

  const execute = async (...params: P) => {
    setLoading(true);

    if (resetOnSuccess) {
      setError(null);
      setData(null);
    }

    try {
      const response = await resourceFn(...params);

      if (response.success) {
        setData(response.data);
        if (onSuccess) {
          await onSuccess(response.data);
        }
        return response.data;
      } else {
        setError(response.error);
        if (onError) {
          onError(response.error);
        }
        return null;
      }
    } catch (error) {
      setError(error);
      if (onError) {
        onError(error);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, data };
}
