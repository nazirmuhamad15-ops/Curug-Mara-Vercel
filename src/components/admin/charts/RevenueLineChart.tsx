"use client";

import { ResponsiveLine } from "@nivo/line";

interface RevenueLineChartProps {
    data: {
        id: string | number;
        data: {
            x: string;
            y: number;
        }[];
    }[];
}

export function RevenueLineChart({ data }: RevenueLineChartProps) {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-400">No data available</div>;
    }

    return (
        <ResponsiveLine
            data={data}
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: true,
                reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: "Date",
                legendOffset: 45,
                legendPosition: "middle",
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Revenue (IDR)",
                legendOffset: -50,
                legendPosition: "middle",
            }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            enableGridX={false}
            colors={{ scheme: "nivo" }}
            curve="monotoneX"
            enableArea={true}
            areaOpacity={0.1}
        />
    );
}
