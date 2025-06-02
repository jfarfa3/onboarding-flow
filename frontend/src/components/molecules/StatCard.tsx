import { Line, LineChart, ResponsiveContainer } from "recharts";

interface StartCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  percentageChange?: number | string;
  trendIcon?: React.ReactNode;
  chartData?: { value: number }[];
  chartColor?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  percentageChange,
  trendIcon,
  chartData = [],
  chartColor = "bg-blue-500",
  className = ""
}: StartCardProps) {
  return (
    <div
      className={`rounded-lg shadow-sm p-4 flex flex-col justify-between min-h-40 relative overflow-hidden w-full ${className}`}
    >
      <div className="absolute top-2 right-2 text-6xl">
        {icon}
      </div>
      <h3 className="font-semibold text-sm mb-2">
        {title}
      </h3>
      <div className="text-2xl font-bold mb-2">
        {value}
      </div>
      {percentageChange && (
        <div className="flex items-center text-sm mb-2">
          {trendIcon && (
            <span className="mr-1">
              {trendIcon}
            </span>
          )}
          {percentageChange}
        </div>
      )}
      {chartData && (
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}