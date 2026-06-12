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
  firstName: string;
  lastName: string;
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

  return data.data.records;
}