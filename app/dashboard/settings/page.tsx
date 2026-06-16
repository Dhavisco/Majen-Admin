"use client";

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { logoutCurrentUser } from '@/lib/api/auth';
import { getAdminProfileDetails, getAdminSettings, updateAdminSettings, type PayoutSchedule } from '@/lib/api/settings';
import { useAuthStore } from '@/stores/authStore';

type ToggleProps = {
    checked: boolean;
    onChange: () => void;
    label: string;
    subLabel?: string;
};

const SettingToggleRow: React.FC<ToggleProps> = ({ checked, onChange, label, subLabel }) => {
    return (
        <div className="flex items-center justify-between gap-2 py-2">
            <div>
                <p className="text-sm md:text-base font-medium text-[#0f172a]">{label}</p>
                {subLabel ? (
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{subLabel}</p>
                ) : null}
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={onChange}
                className={[
                    'group relative inline-flex h-6 w-12 shrink-0 items-center rounded-full border transition-all duration-200 ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A0089]/40 focus-visible:ring-offset-2',
                    checked
                        ? 'bg-[#1A0089] border-[#1A0089] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                        : 'bg-gray-200 border-gray-300 hover:bg-gray-300',
                ].join(' ')}
            >
                <span
                    className={[
                        'pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5',
                        'transition-transform duration-200 ease-out',
                        checked ? 'translate-x-7' : 'translate-x-1',
                    ].join(' ')}
                >
                    <span
                        className={[
                            'h-2 w-2 rounded-full transition-colors duration-200',
                            checked ? 'bg-[#1A0089]' : 'bg-gray-400',
                        ].join(' ')}
                    />
                </span>
            </button>
        </div>
    );
};

function formatLastLogin(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Unknown';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
}

type CommerceSettingsCardProps = {
    settings?: Awaited<ReturnType<typeof getAdminSettings>>;
    isLoading: boolean;
};

function CommerceSettingsCard({ settings, isLoading }: CommerceSettingsCardProps) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [autoApproveProducts, setAutoApproveProducts] = useState(settings?.autoApproveProducts ?? false);
    const [payoutSchedule, setPayoutSchedule] = useState<PayoutSchedule>(settings?.payoutSchedule ?? 'MONTHLY');
    const [platformFeePercentage, setPlatformFeePercentage] = useState(String(settings?.platformFeePercentage ?? 10));

    const formatPayoutSchedule = (value?: PayoutSchedule) => {
        if (value === 'DAILY') {
            return 'Daily';
        }

        return 'Monthly';
    };

    const openEditor = () => {
        if (!settings) {
            return;
        }

        setPlatformFeePercentage(String(settings.platformFeePercentage));
        setPayoutSchedule(settings.payoutSchedule);
        setAutoApproveProducts(settings.autoApproveProducts);
        setIsEditing(true);
    };

    const closeEditor = () => {
        if (settings) {
            setPlatformFeePercentage(String(settings.platformFeePercentage));
            setPayoutSchedule(settings.payoutSchedule);
            setAutoApproveProducts(settings.autoApproveProducts);
        }

        setIsEditing(false);
    };

    const updateSettingsMutation = useMutation({
        mutationFn: updateAdminSettings,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
            setIsEditing(false);
        },
    });

    const isDirty =
        !!settings &&
        (autoApproveProducts !== settings.autoApproveProducts ||
            payoutSchedule !== settings.payoutSchedule ||
            platformFeePercentage !== String(settings.platformFeePercentage));

    const handleSaveSettings = () => {
        const fee = Number(platformFeePercentage);

        if (Number.isNaN(fee)) {
            return;
        }

        updateSettingsMutation.mutate({
            platformFeePercentage: fee,
            payoutSchedule,
            autoApproveProducts,
        });
    };

    return (
        <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="px-3 py-2 border-b flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-base md:text-lg font-bold tracking-tight">Commerce settings</h3>
                    {/* <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Update fees and payout behavior for the platform.</p> */}
                </div>
                {isEditing ? (
                    <span className="text-xs font-medium text-amber-600">Editing</span>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openEditor}
                        disabled={isLoading || !settings}
                        className="border-[#1A0089]/20 text-[#1A0089] hover:bg-[#F1EFFF]"
                    >
                        Edit
                    </Button>
                )}
            </div>

            <div className="px-4 py-4 space-y-5">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="h-20 rounded-xl bg-gray-100" />
                            <div className="h-20 rounded-xl bg-gray-100" />
                        </div>
                        <div className="h-16 rounded-xl bg-gray-100" />
                        <div className="h-16 rounded-xl bg-gray-100" />
                    </div>
                ) : !isEditing ? (
                    <div className="space-y-4">
                        <div className="rounded-xl border bg-[#fafaff] p-3">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Platform fee percentage</p>
                                     <div className=" text-xs font-semibold text-[#1A0089]">
                                    Applied to every transaction
                                </div>
                                   
                                </div>
                                <p className="mt-1 text-2xl font-bold text-[#0f172a]">{settings?.platformFeePercentage ?? 0}%</p>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-[#fafaff] p-3">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Payout schedule</p>
                                     <div className="text-xs font-semibold text-gray-700">
                                    When funds are disbursed
                                </div>
                                   
                                </div>
                                <p className="mt-1 text-lg font-semibold text-[#0f172a]">{formatPayoutSchedule(settings?.payoutSchedule)}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border bg-[#fafaff] p-3">
                            <div>
                                <p className="text-sm font-semibold text-[#0f172a]">Auto-approve products</p>
                                <p className="text-xs text-muted-foreground">Skip review for verified sellers</p>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${settings?.autoApproveProducts ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                                {settings?.autoApproveProducts ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            <div className="flex flex-row justify-between">
                                 <div>
                                <label className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase" htmlFor="platform-fee">
                                    Platform fee percentage
                                </label>
                                <p className="mt-1 text-xs md:text-sm text-muted-foreground">Applied to every transaction</p>
                            </div>

                              <div className="mt-1 flex items-center gap-2">
                                    <Input
                                        id="platform-fee"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={platformFeePercentage}
                                        // onChange={(event) => setPlatformFeePercentage(event.target.value)}
                                         onChange={(event) => {
        const value = event.target.value

        // Allow empty input while editing
        if (value === '') {
            setPlatformFeePercentage('')
            return
        }

        const number = Number(value)

        if (number >= 0 && number <= 100) {
            setPlatformFeePercentage(value)
        }
    }}
                                        className="h-10 text-sm"
                                    />
                                    <span className="text-sm font-semibold text-muted-foreground">%</span>
                                </div>
                            </div>
                           


                            <div className="flex flex-row justify-between">
                                <div>
                                      <label className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase" htmlFor="payout-schedule">
                                    Payout schedule
                                </label>
                                <p className="mt-1 text-xs md:text-sm text-muted-foreground">When funds are disbursed</p>
                                </div>
                              <div>
                                <select
                                    id="payout-schedule"
                                    value={payoutSchedule}
                                    onChange={(event) => setPayoutSchedule(event.target.value as PayoutSchedule)}
                                    className="mt-1 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                >
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="DAILY">Daily</option>
                                </select>
                              </div>
                            </div>
                            <SettingToggleRow
                                checked={autoApproveProducts}
                                onChange={() => setAutoApproveProducts((prev) => !prev)}
                                label="Auto-approve products"
                                subLabel="Skip review for verified sellers"
                            />

                            <div className="flex flex-col gap-2 rounded-xl border bg-[#f8f8ff] p-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-[#0f172a]">Save changes</p>
                                    <p className="text-xs text-muted-foreground">Your updates will be applied immediately across the dashboard.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={closeEditor}
                                        className="border-gray-200 text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveSettings}
                                        disabled={!isDirty || updateSettingsMutation.isPending}
                                        className="bg-[#1A0089] hover:bg-[#14006b] text-white"
                                    >
                                        {updateSettingsMutation.isPending ? 'Saving...' : 'Save settings'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const SettingsPage: React.FC = () => {
    const [newApplications, setNewApplications] = useState(true);
    const [flaggedContent, setFlaggedContent] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);
    const profileQuery = useQuery({
        queryKey: ['admin', 'profile'],
        queryFn: getAdminProfileDetails,
    });

    const settingsQuery = useQuery({
        queryKey: ['admin', 'settings'],
        queryFn: getAdminSettings,
    });
    const adminProfile = profileQuery.data;
    const isLoading = profileQuery.isLoading || settingsQuery.isLoading;

    return (
        <DashboardLayout>
            <div className="space-y-6 md:p-0">
                <div>
                    <h1 className="md:text-2xl text-lg font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground md:text-sm text-xs mt-1">
                        Manage system configuration and admin preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border overflow-hidden">
                        <div className="px-3 py-2 border-b flex items-center justify-between">
                            <h3 className="text-base md:text-lg font-bold tracking-tight">Admin profile</h3>
                            {/* <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-muted-foreground">Read only</span>
                            </div> */}
                        </div>

                        <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <div key={`profile-skeleton-${index}`} className="space-y-2 animate-pulse">
                                        <div className="h-3 w-20 rounded bg-gray-200" />
                                        <div className="h-4 w-32 rounded bg-gray-200" />
                                    </div>
                                ))
                            ) : (
                                <>
                            <div>
                                <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Full Name
                                </p>
                                <p className="mt-1 text-sm md:text-base font-medium text-[#0f172a]">
                                    {adminProfile ? `${adminProfile.firstName} ${adminProfile.lastName}` : '—'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Role
                                </p>
                                <p className="mt-1 text-sm md:text-base font-medium text-[#0f172a]">{adminProfile?.role.name ?? '—'}</p>
                            </div>

                            <div>
                                <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Email
                                </p>
                                <p className="mt-1 text-sm md:text-base font-medium text-[#0f172a]">{adminProfile?.email ?? '—'}</p>
                            </div>

                            <div>
                                <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Last Login
                                </p>
                                <p className="mt-1 text-sm md:text-base font-medium text-[#0f172a]">{adminProfile ? formatLastLogin(adminProfile.lastLogin) : '—'}</p>
                            </div>
                                </>
                            )}
                        </div>
                    </div>

                    <CommerceSettingsCard
                        key={settingsQuery.data ? `${settingsQuery.data.platformFeePercentage}-${settingsQuery.data.payoutSchedule}-${String(settingsQuery.data.autoApproveProducts)}` : 'loading'}
                        settings={settingsQuery.data}
                        isLoading={settingsQuery.isLoading}
                    />

                    <div className="bg-white rounded-2xl border overflow-hidden">
                        <div className="px-4 py-2 border-b">
                            <h3 className="text-base md:text-lg font-bold tracking-tight">Notifications</h3>
                        </div>

                        <div className="px-4 divide-y">
                            <SettingToggleRow
                                checked={newApplications}
                                onChange={() => setNewApplications((prev) => !prev)}
                                label="New applications"
                            />
                            <SettingToggleRow
                                checked={flaggedContent}
                                onChange={() => setFlaggedContent((prev) => !prev)}
                                label="Flagged content"
                            />
                            <SettingToggleRow
                                checked={weeklyDigest}
                                onChange={() => setWeeklyDigest((prev) => !prev)}
                                label="Weekly digest"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border overflow-hidden">
                        <div className="px-4 py-2 border-b">
                            <h3 className="text-base md:text-lg font-bold tracking-tight">System status</h3>
                        </div>

                        <div className="px-4 divide-y">
                            <div className="flex items-center justify-between py-4">
                                <p className="text-sm md:text-base font-medium text-[#0f172a]">API uptime</p>
                                <p className="text-green-600 text-sm md:text-base font-bold">99.9%</p>
                            </div>

                            <div className="flex items-center justify-between py-4">
                                <p className="text-sm md:text-base font-medium text-[#0f172a]">DB response</p>
                                <p className="text-green-600 text-sm md:text-base font-bold">12ms</p>
                            </div>

                            <div className="flex items-center justify-between py-4">
                                <p className="text-sm md:text-base font-medium text-[#0f172a]">Storage used</p>
                                <p className="text-amber-600 text-sm md:text-base font-bold">68%</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Logout section - separate, bottom-placed action following industry standards */}
                <div className="mt-6">
                    <div className="bg-white rounded-2xl border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <p className="font-medium">Sign out of this admin account</p>
                            <p className="text-xs text-muted-foreground">Signing out will invalidate the current session token and require re-authentication.</p>
                        </div>
                        <div className="flex justify-end">
                            <LogoutAction />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

// Logout action component placed near the profile edit button.
const LogoutAction: React.FC = () => {
    const router = useRouter();
    const [confirming, setConfirming] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const auth = useAuthStore();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // attempt server logout; even if it fails we'll clear local auth
            await logoutCurrentUser();
        } catch (err) {
            // best-effort: still clear local auth on error
            console.error('Logout API error', err);
        } finally {
            auth.logout();
            // navigate to login
            router.push('/login');
        }
    };

    return (
        <div className="relative">
            {confirming ? (
                <div className="flex items-center gap-2 cursor-pointer">
                    <Button variant="ghost" onClick={() => setConfirming(false)} className="text-sm">Cancel</Button>
                    <Button
                        onClick={handleLogout}
                        className="text-sm bg-red-600 hover:bg-red-700 text-white"
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </Button>
                </div>
            ) : (
                <Button variant="outline" onClick={() => setConfirming(true)} className="text-sm text-red-600 border-red-200 hover:bg-red-50 cursor-pointer">
                    Sign out
                </Button>
            )}
        </div>
    );
};

export default SettingsPage;