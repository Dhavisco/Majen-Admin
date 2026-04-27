import { axiosInstance } from "@/lib/axios";

export interface DesignersStatistics {
  designers: {
    total: number;
    growth: number;
  };
  verifiedDesigners: {
    total: number;
    growth: number;
  };
  pendingVerifications: number;
}

interface DesignersStatisticsResponse {
  success: boolean;
  message: string;
  data: DesignersStatistics;
}

export async function getDesignersStatistics(): Promise<DesignersStatistics> {
  const { data } = await axiosInstance.get<DesignersStatisticsResponse>(
    "/admin/businesses/statistics"
  );
  return data.data;
}

export interface DesignerRecord {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  };
  id: number;
  status: "ACTIVE" | "PENDING" | "SUSPENDED" | "BANNED" | "FLAGGED";
  businessName: string;
  businessType: string;
  verification: {
    rcNumber: string;
  };
  _count: {
    products: number;
  };
}

interface DesignersListResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      totalCount: number;
      page: number;
      perPage: number;
      pageCount: number;
    };
    records: DesignerRecord[];
  };
}

export interface GetDesignersListParams {
  page?: number;
  limit?: number;
  status?: "VERIFIED" | "PENDING" | "SUSPENDED" | "BANNED" | "FLAGGED";
  filterParam?: string;
}

export async function getDesignersList(
  params: GetDesignersListParams = {}
): Promise<DesignersListResponse["data"]> {
  const { page = 1, limit = 10, status, filterParam } = params;

  const queryParams: Record<string, unknown> = {
    pagination: true,
    page,
    limit,
  };

  if (status) {
    queryParams.status = status;
  }

  if (filterParam) {
    queryParams.filterParam = filterParam;
  }

  const { data } = await axiosInstance.get<DesignersListResponse>("/admin/businesses", {
    params: queryParams,
  });

  return data.data;
}
