"use client";

import { useEffect, useState } from "react";

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

function formatCurrentDate() {
    return new Date().toLocaleDateString("en-US", DATE_FORMAT_OPTIONS);
}

export default function LiveDate() {
    const [currentDate, setCurrentDate] = useState(formatCurrentDate);

    useEffect(() => {
        let timeoutId: number;

        const scheduleNextUpdate = () => {
            const now = new Date();
            const nextMidnight = new Date(now);
            nextMidnight.setHours(24, 0, 0, 0);

            timeoutId = window.setTimeout(() => {
                setCurrentDate(formatCurrentDate());
                scheduleNextUpdate();
            }, nextMidnight.getTime() - now.getTime());
        };

        scheduleNextUpdate();

        return () => window.clearTimeout(timeoutId);
    }, []);

    return <>{currentDate}</>;
}