"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function Providers({ children }: { children: React.ReactNode }) {
    const { hydrateFromStorage, hydrated } = useAuthStore();

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    useEffect(() => {
        if (hydrated) {
            return;
        }

        hydrateFromStorage();
    }, [hydrated, hydrateFromStorage]);

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
