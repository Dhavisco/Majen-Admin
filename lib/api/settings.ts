import { axiosInstance } from '@/lib/axios';

export interface AdminProfileDetails {
  firstName: string;
  lastName: string;
  email: string;
  lastLogin: string;
  role: {
    name: string;
  };
}

interface AdminProfileResponse {
  success: boolean;
  message: string;
  data: {
    adminUser: AdminProfileDetails;
  };
}

export async function getAdminProfileDetails(): Promise<AdminProfileDetails> {
  const { data } = await axiosInstance.get<AdminProfileResponse>('/admin/user/profile');

  return data.data.adminUser;
}

export type PayoutSchedule = 'MONTHLY' | 'DAILY';

export interface AdminSettings {
  payoutSchedule: PayoutSchedule;
  autoApproveProducts: boolean;
  platformFeePercentage: number;
}

interface AdminSettingsResponse {
  success: boolean;
  message: string;
  data: {
    settings: {
      payoutSchedule: PayoutSchedule;
      autoApproveProducts: boolean;
      platformFeePercentage: string;
    };
  };
}

interface UpdateAdminSettingsPayload {
  platformFeePercentage: number;
  payoutSchedule: PayoutSchedule;
  autoApproveProducts: boolean;
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const { data } = await axiosInstance.get<AdminSettingsResponse>('/admin/settings');

  return {
    payoutSchedule: data.data.settings.payoutSchedule,
    autoApproveProducts: data.data.settings.autoApproveProducts,
    platformFeePercentage: Number(data.data.settings.platformFeePercentage),
  };
}

export async function updateAdminSettings(payload: UpdateAdminSettingsPayload): Promise<void> {
  await axiosInstance.patch('/admin/settings', payload);
}