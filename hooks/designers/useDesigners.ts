"use client";

import { createElement, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaBan, FaCheckCircle, FaClock, FaUsers } from "react-icons/fa";
import {
  getDesignersStatistics,
  getDesignersList,
  type DesignerRecord,
} from "@/lib/api/designers";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function mapStatusToUI(status: string): "Active" | "Pending" | "Flagged" | "Suspended" | "Banned" {
  const normalizedStatus = status.toUpperCase();

  switch (normalizedStatus) {
    case "ACTIVE":
      return "Active";
    case "PENDING":
      return "Pending";
    case "FLAGGED":
      return "Flagged";
    case "SUSPENDED":
      return "Suspended";
    case "BANNED":
      return "Banned";
    default:
      return "Active";
  }
}

export interface UseDesignersOptions {
  page?: number;
  limit?: number;
  status?: "VERIFIED" | "PENDING" | "FLAGGED" | "SUSPENDED" | "BANNED";
  search?: string;
}

export function useDesigners(options: UseDesignersOptions = {}) {
  const { limit = 10, status, search } = options;
  const [currentPage, setCurrentPage] = useState(1);

  const statisticsQuery = useQuery({
    queryKey: ["designers", "statistics"],
    queryFn: getDesignersStatistics,
  });

  const listQuery = useQuery({
    queryKey: ["designers", "list", { page: currentPage, limit, status, search }],
    queryFn: () =>
      getDesignersList({
        page: currentPage,
        limit,
        status: status as "VERIFIED" | "PENDING" | "FLAGGED" | "SUSPENDED" | "BANNED" | undefined,
        filterParam: search,
      }),
  });

  const statistics = statisticsQuery.data;

  const metrics = statistics
    ? [
        {
          title: "Total designers",
          value: statistics.designers.total,
          indicator: { type: "percentage" as const, value: statistics.designers.growth },
          icon: createElement(FaUsers),
          color: "bg-blue-100 text-blue-600",
        },
        {
          title: "Verified",
          value: statistics.verifiedDesigners.total,
          indicator: { type: "percentage" as const, value: statistics.verifiedDesigners.growth },
          icon: createElement(FaCheckCircle),
          color: "bg-green-100 text-green-600",
        },
        {
          title: "Pending review",
          value: statistics.pendingVerifications,
          indicator: (() => {
            const tone = statistics.pendingVerifications > 0 ? ("warning" as const) : ("success" as const);
            return {
              type: "text" as const,
              text: statistics.pendingVerifications > 0 ? "Needs action" : "All clear",
              tone,
            };
          })(),
          icon: createElement(FaClock),
          color: "bg-yellow-100 text-yellow-600",
        },
        {
          title: "Suspended / Banned",
          value: 0,
          indicator: { type: "text" as const, text: "Monitoring", tone: ("neutral" as const) },
          icon: createElement(FaBan),
          color: "bg-red-100 text-red-600",
        },
      ]
    : [];

  const listData = listQuery.data;
  const designers = (listData?.records ?? []).map((record: DesignerRecord) => ({
    id: record.id,
    name: `${record.user.firstName} ${record.user.lastName}`,
    email: record.user.email,
    business: record.businessName,
    type: record.businessType,
    cac: record.verification.rcNumber,
    products: record._count.products,
    joined: formatDate(record.user.createdAt),
    status: mapStatusToUI(record.status),
  }));

  const pagination = useMemo(() => {
    const totalCount = listData?.meta.totalCount ?? 0;
    const perPage = listData?.meta.perPage ?? limit;
    const pageCount = listData?.meta.pageCount ?? Math.max(1, Math.ceil(totalCount / perPage));
    const recordsLength = listData?.records?.length ?? 0;

    return {
      currentPage,
      totalCount,
      perPage,
      pageCount,
      canPrevious: currentPage > 1,
      // UX: only allow next when there are at least `perPage` records and we're not on last page
      canNext: currentPage < pageCount && recordsLength >= perPage,
    };
  }, [currentPage, listData, limit]);

  return {
    metrics,
    designers,
    pagination,
    currentPage,
    setCurrentPage,
    isLoading: statisticsQuery.isLoading || listQuery.isLoading,
    isError: statisticsQuery.isError || listQuery.isError,
    error: statisticsQuery.error || listQuery.error,
  };
}
