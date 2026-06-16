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

export interface DesignerProfile {
  designer: {
    id: number;
    status: "ACTIVE" | "PENDING" | "SUSPENDED" | "BANNED" | "FLAGGED";
    businessName: string;
    displayName: string;
    businessType: "CUSTOM" | "READY_TO_WEAR";
    createdAt: string;
    socialLinks: {
      instagram?: string;
      facebook?: string;
      tiktok?: string | null;
      twitter?: string;
    };
    user: {
      firstName: string;
      lastName: string;
      email: string;
      createdAt: string;
      image?: string | null;
      notesReceived: Array<{
        content: string;
        createdBy: {
          firstName: string;
          lastName: string;
        };
        createdAt: string;
      }>;
    };
    verification: {
      rcNumber: string;
      status: string;
    };
  };
  averageRating: number;
  totalReviews: number;
  productCount: number;
  orderCount: number;
  balance: {
    totalBalance: number;
    lastWithdrawal: number;
    lastSale: string | null;
  };
}

interface DesignerProfileResponse {
  success: boolean;
  message: string;
  data: DesignerProfile;
}

export async function getDesignerProfile(id: number): Promise<DesignerProfile> {
  const { data } = await axiosInstance.get<DesignerProfileResponse>(
    `/admin/businesses/${id}`
  );
  return data.data;
}

interface DesignerVerificationActionResponse {
  success: boolean;
  message: string;
}

export async function verifyDesigner(id: number): Promise<void> {
  await axiosInstance.post<DesignerVerificationActionResponse>(`/admin/businesses/verify/${id}`);
}

export async function rejectDesignerVerification(id: number, reason: string): Promise<void> {
  await axiosInstance.post<DesignerVerificationActionResponse>(`/admin/businesses/reject-verification/${id}`, {
    reason,
  });
}

interface DesignerNoteResponse {
  success: boolean;
  message: string;
  data: {
    note: {
      id: number;
      identifier: string;
      content: string;
      createdById: number;
      designerId: number;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export async function addDesignerNote(id: number, note: string): Promise<void> {
  await axiosInstance.post<DesignerNoteResponse>(`/admin/businesses/${id}/add-note`, {
    note,
  });
}

export interface DesignerProduct {
  id: number;
  title: string;
  description: string;
  price: string;
  quantity: number;
  status: "ACTIVE" | "PENDING" | "REJECTED";
  sold: number;
}

export interface GetDesignerProductsParams {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "PENDING" | "REJECTED";
}

interface DesignerProductsResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      totalCount: number;
      page: number;
      perPage: number;
      pageCount: number;
    };
    groupProductCountsByStatus: Record<string, number>;
    records: DesignerProduct[];
  };
}

export async function getDesignerProducts(
  designerId: number,
  params: GetDesignerProductsParams = {}
): Promise<DesignerProductsResponse["data"]> {
  const { page = 1, limit = 10, status } = params;

  const { data } = await axiosInstance.get<DesignerProductsResponse>(
    `/admin/businesses/${designerId}/products`,
    {
      params: {
        pagination: true,
        page,
        limit,
        ...(status && { status }),
      },
    }
  );

  return data.data;
}

export interface DesignerOrder {
  id: number;
  identifier: string;
  items: Array<{
    product: {
      title: string;
    };
  }>;
  client: {
    firstName: string;
    lastName: string;
  };
  price: string;
  createdAt: string;
  status: "CONFIRMED" | "CANCELLED";
}

export interface GetDesignerOrdersParams {
  page?: number;
  limit?: number;
}

interface DesignerOrdersResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      totalCount: number;
      page: number;
      perPage: number;
      pageCount: number;
    };
    records: DesignerOrder[];
  };
}

export async function getDesignerOrders(
  designerId: number,
  params: GetDesignerOrdersParams = {}
): Promise<DesignerOrdersResponse["data"]> {
  const { page = 1, limit = 10 } = params;

  const { data } = await axiosInstance.get<DesignerOrdersResponse>(
    `/admin/businesses/${designerId}/orders`,
    {
      params: {
        pagination: true,
        page,
        limit,
      },
    }
  );

  return data.data;
}

export interface DesignerTransaction {
  id: number;
  type: "SETTLEMENT" | "WITHDRAWAL" | "REFUND" | "DEBIT";
  direction: "CREDIT" | "DEBIT";
  amount: string;
}

export interface GetDesignerTransactionsParams {
  page?: number;
  limit?: number;
}

interface DesignerTransactionsResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      totalCount: number;
      page: number;
      perPage: number;
      pageCount: number;
    };
    balance: number;
    records: DesignerTransaction[];
  };
}

export async function getDesignerTransactions(
  designerId: number,
  params: GetDesignerTransactionsParams = {}
): Promise<DesignerTransactionsResponse["data"]> {
  const { page = 1, limit = 10 } = params;

  const { data } = await axiosInstance.get<DesignerTransactionsResponse>(
    `/admin/businesses/${designerId}/transactions`,
    {
      params: {
        pagination: true,
        page,
        limit,
      },
    }
  );

  return data.data;
}


export interface DesignerReview {
  reviewer: {
    firstName: string;
    lastName: string;
  };
 product: {
    title: string;
    description: string;
  };
  rating: number;
 description: string;
  createdAt: string;
  };
  
export interface GetDesignerReviewsParams {
  page?: number;
  limit?: number;
}

interface DesignerReviewsResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      totalCount: number;
      // page: number;
      // perPage: number;
      pageCount: number;
    };
    records: DesignerReview[];
  };
}

export async function getDesignerReviews(
  designerId: number,
  params: GetDesignerReviewsParams = {}
): Promise<DesignerReviewsResponse["data"]> {
  const { page = 1, limit = 10 } = params;

  const { data } = await axiosInstance.get<DesignerReviewsResponse>(
    `/admin/businesses/${designerId}/reviews`,
    {
      params: {
        pagination: true,
        page,
        limit,
      },
    }
  );

  return data.data;
}