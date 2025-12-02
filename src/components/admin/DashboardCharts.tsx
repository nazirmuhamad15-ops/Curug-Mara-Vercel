"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface ChartData {
    label: string;
    value: number;
}

interface DashboardChartsProps {
    revenueData: ChartData[];
    bookingsData: ChartData[];
}

export function DashboardCharts({ revenueData, bookingsData }: DashboardChartsProps) {
    const maxRevenue = useMemo(() => Math.max(...revenueData.map(d => d.value), 1), [revenueData]);
    const maxBookings = useMemo(() => Math.max(...bookingsData.map(d => d.value), 1), [bookingsData]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Overview (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-end justify-between gap-2 mt-4">
                        {revenueData.map((item, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                                <div
                                    className="w-full bg-primary/80 rounded-t-md transition-all group-hover:bg-primary relative"
                                    style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.value)}
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground truncate w-full text-center">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Bookings Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Bookings Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-end justify-between gap-2 mt-4">
                        {bookingsData.map((item, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                                <div
                                    className="w-full bg-secondary/80 rounded-t-md transition-all group-hover:bg-secondary relative"
                                    style={{ height: `${(item.value / maxBookings) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {item.value} bookings
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground truncate w-full text-center">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
