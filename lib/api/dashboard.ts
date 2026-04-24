import { axiosInstance } from "@/lib/axios";

export interface DashboardSummary {
  pendingVerifications: number;
  pendingProducts: number;
  clients: {
    total: number;
    growth: number;
  };
  designers: {
    total: number;
    growth: number;
  };
  orders: {
    total: number;
    growth: number;
  };
  revenue: {
    current: number;
    growth: number;
  };
}

interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: DashboardSummary;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await axiosInstance.get<DashboardSummaryResponse>("/admin/user/dashboard");
  return data.data;
}
