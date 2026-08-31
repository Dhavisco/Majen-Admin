import { axiosInstance } from '@/lib/axios';

export interface ReportsSummary {
  total: number;
  flaggedReviews: number;
  resolvedThisMonth: number;
  growth: number;
}

interface ReportsSummaryResponse {
  success: boolean;
  message: string;
  data: ReportsSummary;
}

export interface ReportPerson {
  id?: number;
  firstName: string;
  lastName: string;
  _count?: {
    givenReviews?: number;
  };
}

export interface OpenReportRecord {
  id: string;
  reason: string;
  reporter: ReportPerson;
  reportedUser: ReportPerson;
}

interface OpenReportsResponse {
  success: boolean;
  message: string;
  data: {
    records: OpenReportRecord[];
    meta: {
      totalCount: number;
      page: number;
      perPage: number;
      pageCount: number;
    };
  };
}

export interface FlaggedReviewRecord {
  id: string;
  reason: string;
  review: {
    id: number;
    description: string;
  };
  reporter: ReportPerson;
  reportedUser: ReportPerson;
}

interface FlaggedReviewsResponse {
  success: boolean;
  message: string;
  data: {
    records: FlaggedReviewRecord[];
    meta: {
      totalCount: number;
      page: number;
      perPage: number;
      pageCount: number;
    };
  };
}

export interface ReportDetail {
  id: string;
  identifier: string;
  reporter: ReportPerson;
  reportedUser: ReportPerson;
  reportedUserId: number;
  notes: string | null;
  status: string;
  updatedAt: string;
  reason: string;
  createdAt: string;
}

interface ReportDetailResponse {
  success: boolean;
  message: string;
  data: {
    report: ReportDetail;
    priorReportsCount: number;
  };
}

export interface FlaggedReviewDetail {
  review: {
    id: number;
    identifier: string;
    description: string;
    rating: number;
    createdAt: string;
    reviewer: ReportPerson & {
      id: number;
      _count: {
        givenReviews: number;
      };
    };
    product: {
      business: {
        displayName: string;
      };
    };
    orderItem: {
      order: {
        identifier: string;
      };
    };
  };
  report: ReportDetail;
}

interface FlaggedReviewDetailResponse {
  success: boolean;
  message: string;
  data: FlaggedReviewDetail;
}

export async function getReportsSummary(): Promise<ReportsSummary> {
  const { data } = await axiosInstance.get<ReportsSummaryResponse>('/admin/reports/summary');

  return data.data;
}

export async function getOpenReports(limit = 10, page = 1): Promise<OpenReportRecord[]> {
  const { data } = await axiosInstance.get<OpenReportsResponse>('/admin/reports/open', {
    params: {
      pagination: true,
      limit,
      page,
    },
  });

  return data.data.records;
}

export async function getFlaggedReviews(limit = 10, page = 1): Promise<FlaggedReviewRecord[]> {
  const { data } = await axiosInstance.get<FlaggedReviewsResponse>('/admin/reports/flagged-reviews', {
    params: {
      pagination: true,
      limit,
      page,
    },
  });

  console.log('Flagged Reviews Response:', data); // Log the entire response for debugging

  return data.data.records;
}

export async function getReportedChatById(id: string): Promise<{ report: ReportDetail; priorReportsCount: number }> {
  const { data } = await axiosInstance.get<ReportDetailResponse>(`/admin/reports/${id}`);

  return data.data;
}

export async function getFlaggedReviewById(id: number): Promise<FlaggedReviewDetail> {
  const { data } = await axiosInstance.get<FlaggedReviewDetailResponse>(`/admin/reports/reviews/${id}`);

  return data.data;
}