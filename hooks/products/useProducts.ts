import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductsDashboard, ProductsDashboardResponse } from "@/lib/api/products";

export interface UseProductsOptions {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "PENDING" | "REJECTED";
  search?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { page = 1, limit = 10, status, search } = options;
  const [currentPage, setCurrentPage] = useState(page);

  const { data: apiData, isLoading, isError, error } = useQuery<ProductsDashboardResponse>({
    queryKey: ["products-dashboard", currentPage, limit, status, search],
    queryFn: () =>
      getProductsDashboard({
        page: currentPage,
        limit,
        status,
        filterParam: search,
      }),
  });


  // Defensive: fallback to empty object if apiData or apiData.data is undefined, wrapped in useMemo
  const data = useMemo(() => {
    return apiData?.data ?? {
      meta: undefined,
      dashboardStats: undefined,
      records: [],
    };
  }, [apiData]);

  const metrics = useMemo(() => {
    if (!data.dashboardStats) return [];
    return [
      {
        title: "Total products",
        value: data.dashboardStats.totalProducts,
        indicator: { type: "percentage" as const, value: 0 },
        color: "bg-blue-100 text-blue-600",
      },
      {
        title: "Active",
        value: data.dashboardStats.activeProducts,
        indicator: { type: "percentage" as const, value: 0 },
        color: "bg-green-100 text-green-600",
      },
      {
        title: "Pending review",
        value: data.dashboardStats.pendingProducts,
        indicator: { type: "text" as const, text: data.dashboardStats.pendingProducts > 0 ? "Needs Review" : "All clear", tone: data.dashboardStats.pendingProducts > 0 ? "warning" : "success" },
        color: "bg-yellow-100 text-yellow-600",
      },
      {
        title: "Rejected",
        value: data.dashboardStats.rejectedProducts,
        indicator: { type: "text" as const, text: "Monitoring", tone: "neutral" },
        color: "bg-red-100 text-red-600",
      },
    ];
  }, [data]);

  const products = useMemo(() => data.records ?? [], [data]);

  const pagination = useMemo(() => {
    if (!data.meta) return { currentPage: 1, totalCount: 0, perPage: 10, pageCount: 1, canPrevious: false, canNext: false };
    const { page, totalCount, perPage, pageCount } = data.meta;
    return {
      currentPage: page,
      totalCount,
      perPage,
      pageCount,
      canPrevious: page > 1,
      canNext: page < pageCount,
    };
  }, [data]);

  return {
    metrics,
    products,
    pagination,
    currentPage,
    setCurrentPage,
    isLoading,
    isError,
    error,
  };
}
