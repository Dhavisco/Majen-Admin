"use client";

import { createElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaDollarSign, FaShoppingCart, FaUser, FaUsers } from "react-icons/fa";
import {
  getDashboardSummary,
  getPendingVerifications,
  getRecentActivities,
} from "@/lib/api/dashboard";

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function mapActivityStatus(type: string) {
  const normalizedType = type.toUpperCase();

  switch (normalizedType) {
    case "VERIFICATION":
      return "success";
    case "PRODUCT":
      return "warning";
    case "ORDER":
      return "success";
    case "ACCOUNT":
      return "error";
    default:
      return "success";
  }
}

export function useDashboard() {
  const summaryQuery = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
  });

  const recentActivityQuery = useQuery({
    queryKey: ["dashboard", "recent-activity"],
    queryFn: getRecentActivities,
  });

  const pendingVerificationsQuery = useQuery({
    queryKey: ["dashboard", "pending-verifications"],
    queryFn: getPendingVerifications,
  });

  const dashboardSummary = summaryQuery.data;

  const metrics = dashboardSummary
    ? [
        {
          title: "Total Designers",
          value: dashboardSummary.designers.total,
          indicator: { type: "percentage" as const, value: dashboardSummary.designers.growth },
          icon: createElement(FaUser),
          color: "bg-blue-200",
          route: "/dashboard/designers",
        },
        {
          title: "Active Clients",
          value: dashboardSummary.clients.total,
          indicator: { type: "percentage" as const, value: dashboardSummary.clients.growth },
          icon: createElement(FaUsers),
          color: "bg-green-200",
          route: "/dashboard/clients",
        },
        {
          title: "Total Orders",
          value: dashboardSummary.orders.total,
          indicator: { type: "percentage" as const, value: dashboardSummary.orders.growth },
          icon: createElement(FaShoppingCart),
          color: "bg-orange-200",
          route: "/dashboard/orders",
        },
        {
          title: "Platform Revenue",
          value: formatCurrency(dashboardSummary.revenue.current),
          indicator: { type: "percentage" as const, value: dashboardSummary.revenue.growth },
          icon: createElement(FaDollarSign),
          color: "bg-purple-200",
          route: "/dashboard/financials",
        },
      ]
    : [];

  const verifications = (pendingVerificationsQuery.data ?? []).map((item) => ({
    designer: item.displayName,
    business: item.businessName,
    submitted: formatDate(item.createdAt),
  }));

  const activities = (recentActivityQuery.data ?? []).map((record) => ({
    description: record.message,
    time: "",
    status: mapActivityStatus(record.type),
  }));

  const pendingCounts = {
    pendingVerifications: dashboardSummary?.pendingVerifications ?? 0,
    pendingProducts: dashboardSummary?.pendingProducts ?? 0,
  };

  return {
    metrics,
    verifications,
    activities,
    pendingCounts,
    dashboardSummary,
    isLoading:
      summaryQuery.isLoading || recentActivityQuery.isLoading || pendingVerificationsQuery.isLoading,
    isError:
      summaryQuery.isError || recentActivityQuery.isError || pendingVerificationsQuery.isError,
  };
}
