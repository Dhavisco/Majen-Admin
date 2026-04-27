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

export interface RecentActivityRecord {
  type: string;
  product: unknown | null;
  order: unknown | null;
  metadata: {
    user?: {
      firstName?: string;
      lastName?: string;
    };
    businessName?: string;
  };
  message: string;
}

interface RecentActivityResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      totalCount: number;
      page: number;
      perPage: number;
      pageCount: number;
    };
    records: RecentActivityRecord[];
  };
}

export async function getRecentActivities(): Promise<RecentActivityRecord[]> {
  const { data } = await axiosInstance.get<RecentActivityResponse>("/admin/recent-activity", {
    params: {
      pagination: true,
      page: 1,
      limit: 10,
    },
  });

  return data.data.records;
}

export interface PendingVerificationRecord {
  id: number;
  identifier: string;
  userId: number;
  businessName: string;
  displayName: string;
  businessType: string;
  location: string | null;
  city: string | null;
  description: string | null;
  country: string;
  isAvailable: boolean;
  availabilityMessage: string | null;
  status: string;
  ratings: number;
  createdAt: string;
  updatedAt: string;
  verification: {
    rcNumber: string;
    status: string;
  };
}

interface PendingVerificationResponse {
  success: boolean;
  message: string;
  data: {
    meta: Record<string, unknown>;
    records: PendingVerificationRecord[];
  };
}

export async function getPendingVerifications(): Promise<PendingVerificationRecord[]> {
  const { data } = await axiosInstance.get<PendingVerificationResponse>("/admin/business/pending");
  return data.data.records;
}
