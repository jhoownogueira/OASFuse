"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { apiClient } from "@/lib/http/axios-client";
import type { ApiError, ComparisonReport, ComparisonRequest } from "./types";
import { useI18n } from "@/i18n/provider";

export function useCompareSpecifications() {
  const { messages } = useI18n();
  const [report, setReport] = useState<ComparisonReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const compare = useCallback(
    async (request: ComparisonRequest) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.post<ComparisonReport>(
          "/comparisons",
          request,
        );
        setReport(data);
      } catch (cause) {
        if (axios.isAxiosError<ApiError>(cause))
          setError(
            cause.response?.data?.message ??
              (cause.code === "ECONNABORTED"
                ? messages.errors.timeout
                : messages.errors.unavailable),
          );
        else setError(messages.errors.unexpected);
      } finally {
        setLoading(false);
      }
    },
    [messages.errors],
  );

  return {
    report,
    error,
    isLoading,
    compare,
    invalidate: () => setReport(null),
    clearError: () => setError(null),
  };
}
