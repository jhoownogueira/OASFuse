"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import { apiClient } from "@/lib/http/axios-client";
import type { ApiError, ComparisonReport, ComparisonRequest } from "./types";

export function useCompareSpecifications() {
  const [report, setReport] = useState<ComparisonReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const compare = useCallback(async (request: ComparisonRequest) => {
    setLoading(true); setError(null);
    try {
      const { data } = await apiClient.post<ComparisonReport>("/comparisons", request);
      setReport(data);
    } catch (cause) {
      if (axios.isAxiosError<ApiError>(cause)) setError(cause.response?.data?.message ?? (cause.code === "ECONNABORTED" ? "The comparison timed out." : "The comparison service is unavailable."));
      else setError("Unexpected comparison error.");
    } finally { setLoading(false); }
  }, []);

  return { report, error, isLoading, compare, invalidate: () => setReport(null), clearError: () => setError(null) };
}
