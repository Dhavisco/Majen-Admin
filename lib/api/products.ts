import { axiosInstance } from "@/lib/axios";

export interface ProductRecord {
  id: number;
  identifier: string;
  title: string;
  price: string;
  quantity: number;
  status: "ACTIVE" | "PENDING" | "REJECTED";
  business: {
    businessName: string;
  };
  category: {
    name: string;
  };
}

export interface ProductsDashboardStats {
  activeProducts: number;
  pendingProducts: number;
  totalProducts: number;
  rejectedProducts: number;
}

export interface ProductsDashboardResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      totalCount: number;
      page: number;
      perPage: number;
      pageCount: number;
    };
    dashboardStats: ProductsDashboardStats;
    records: ProductRecord[];
  };
}

export interface GetProductsDashboardParams {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "PENDING" | "REJECTED";
  filterParam?: string;
}

export async function getProductsDashboard(params: GetProductsDashboardParams = {}) {
  const { page = 1, limit = 10, status, filterParam } = params;
  const queryParams: Record<string, unknown> = {
    pagination: true,
    page,
    limit,
  };
  if (status) queryParams.status = status;
  if (filterParam) queryParams.filterParam = filterParam;
  const { data } = await axiosInstance.get<ProductsDashboardResponse>(
    "/admin/products/dashboard",
    { params: queryParams }
  );
  return data; // Return the full response, not just data.data
}
