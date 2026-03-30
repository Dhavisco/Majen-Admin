'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout/DashboardLayout';

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

const SettingsPage: React.FC = () => {
    const [autoApproveProducts, setAutoApproveProducts] = useState(false);
    const [newApplications, setNewApplications] = useState(true);
    const [flaggedContent, setFlaggedContent] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);

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
                            <button className="text-[#1A0089] hover:text-[#14006b] text-sm md:text-base font-medium">
                                Edit -
                            </button>
                        </div>

                        <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Full Name
                                </p>
                                <p className="mt-1 text-sm md:text-base font-medium text-[#0f172a]">Super Admin</p>
                            </div>

                            <div>
                                <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Role
                                </p>
                                <p className="mt-1 text-sm md:text-base font-medium text-[#0f172a]">Super Admin</p>
                            </div>

                            <div>
                                <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Email
                                </p>
                                <p className="mt-1 text-sm md:text-base font-medium text-[#0f172a]">admin@majen.com</p>
                            </div>

                            <div>
                                <p className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Last Login
                                </p>
                                <p className="mt-1 text-sm md:text-base font-medium text-[#0f172a]">Today, 9:04 AM</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border overflow-hidden">
                        <div className="px-3 py-2 border-b">
                            <h3 className="text-base md:text-lg font-bold tracking-tight">Commerce settings</h3>
                        </div>

                        <div className="px-4 divide-y">
                            <div className="flex items-center justify-between gap-2 py-2">
                                <div>
                                    <p className="text-sm md:text-base font-medium text-[#0f172a]">Platform fee</p>
                                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                                        Applied to every transaction
                                    </p>
                                </div>
                                <p className="text-[#1A0089] text-sm md:text-base font-bold">10%</p>
                            </div>

                            <div className="flex items-center justify-between gap-2 py-2">
                                <div>
                                    <p className="text-sm md:text-base font-medium text-[#0f172a]">Payout schedule</p>
                                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                                        When funds are disbursed
                                    </p>
                                </div>
                                <p className="text-sm md:text-base font-semibold text-[#0f172a]">Monthly (1st)</p>
                            </div>

                            <SettingToggleRow
                                checked={autoApproveProducts}
                                onChange={() => setAutoApproveProducts((prev) => !prev)}
                                label="Auto-approve products"
                                subLabel="Skip review for verified sellers"
                            />
                        </div>
                    </div>

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
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;