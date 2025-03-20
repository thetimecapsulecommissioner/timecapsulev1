
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityMetrics } from "@/utils/activityChartUtils";

interface ActivityChartProps {
  title: string;
  data: number[];
  labels: string[];
  color: string;
  yAxisLabel?: string;
  tooltipFormatter?: (value: number) => string;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({
  title,
  data,
  labels,
  color,
  yAxisLabel,
  tooltipFormatter,
}) => {
  const chartData = data.map((value, index) => ({
    name: labels[index],
    value,
  }));

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} 
                width={50}
              />
              <Tooltip 
                formatter={
                  tooltipFormatter 
                    ? (value: any) => [tooltipFormatter(value), "Value"]
                    : undefined
                }
              />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" style={{ fontSize: '11px' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const ActivityChartContainer: React.FC<{
  metrics: ActivityMetrics;
}> = ({ metrics }) => {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <ActivityChart
        title="Site Visits"
        data={metrics.siteVisits}
        labels={metrics.labels}
        color="#4f46e5"
        yAxisLabel="Visits"
      />
      <ActivityChart
        title="Average Time Spent"
        data={metrics.averageTimeSpent}
        labels={metrics.labels}
        color="#10b981"
        yAxisLabel="Seconds"
        tooltipFormatter={formatTime}
      />
      <ActivityChart
        title="Logins"
        data={metrics.logins}
        labels={metrics.labels}
        color="#f59e0b"
        yAxisLabel="Count"
      />
    </div>
  );
};
