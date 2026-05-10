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

export interface ProductPhoto {
  url: string;
}

export interface ProductSizeItem {
  sizeType: string;
}

export interface ProductDetailBusiness {
  businessName: string;
  user: {
    firstName: string;
    lastName: string;
    image: string | null;
  };
  verification: {
    status: string;
  };
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductDetail {
  title: string;
  description: string;
  price: string;
  quantity: number;
  status: "ACTIVE" | "PENDING" | "REJECTED";
  visibilty?: "VISIBLE" | "HIDDEN";
  visibility?: "VISIBLE" | "HIDDEN";
  createdAt: string;
  updatedAt: string;
  fabricUsed: string;
  category: ProductCategory;
  business: ProductDetailBusiness;
  sizeSource: string;
  sizes: ProductSizeItem[];
  recommendedSizes: ProductSizeItem[];
  photos: ProductPhoto[];
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: {
    product: ProductDetail;
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

export interface RejectionReason {
  id: number;
  code: string;
  label: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RejectionReasonsResponse {
  success: boolean;
  message: string;
  data: {
    reasons: RejectionReason[];
  };
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

export async function getProductById(id: number) {
  const { data } = await axiosInstance.get<ProductDetailResponse>(`/admin/products/${id}`);
  return data.data;
}

export async function acceptProduct(id: number) {
  const { data } = await axiosInstance.post(`/admin/products/${id}/accept`);
  return data;
}

export async function rejectProduct(id: number, rejectionReasonId: number) {
  const { data } = await axiosInstance.post(`/admin/products/${id}/reject`, {
    rejectionReasonId,
  });
  return data;
}

export async function updateProductVisibility(id: number, status: "VISIBLE" | "HIDDEN") {
  const { data } = await axiosInstance.patch(
    `/admin/products/${id}/visibility`,
    undefined,
    {
      params: { status },
    }
  );

  return data;
}

export async function getRejectionReasons() {
  const { data } = await axiosInstance.get<RejectionReasonsResponse>("/rejection-reasons");
  return data.data;
}
