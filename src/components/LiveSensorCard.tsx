import { Activity, Zap, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useLatestSensorReading, useRecentSensorReadings } from "@/hooks/useSensorData";

const LiveSensorCard = () => {
  const { reading, isLoading, isStale } = useLatestSensorReading();
  const { readings } = useRecentSensorReadings(30);

  if (isLoading) {
    return (
      <div className="stat-card animate-pulse">
        <div className="h-48 bg-muted rounded" />
      </div>
    );
  }

  const currentAmps = reading?.current_amps ?? 0;
  const powerWatts = reading?.power_watts ?? 0;
  const statusColor = isStale ? "text-warning" : "text-success";
  const statusLabel = isStale ? "Offline" : "Live";

  const chartData = readings.map((r) => ({
    time: new Date(r.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    current: Number(r.current_amps),
    power: Number(r.power_watts),
  }));

  return (
    <div className="stat-card border-2 border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="section-title flex items-center gap-2 !mb-0">
          <Activity className="w-5 h-5 text-primary" />
          Live Consumption
        </h3>
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${statusColor}`}>
          <span
            className={`w-2 h-2 rounded-full ${
              isStale ? "bg-warning" : "bg-success animate-pulse"
            }`}
          />
          {statusLabel}
        </div>
      </div>

      {/* Big numbers */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-primary/5 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-xs text-muted-foreground">Current</span>
          </div>
          <p className="text-3xl font-bold tabular-nums">
            {currentAmps.toFixed(2)}
            <span className="text-sm font-medium text-muted-foreground ml-1">A</span>
          </p>
        </div>

        <div className="bg-primary/5 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Power</span>
          </div>
          <p className="text-3xl font-bold tabular-nums">
            {powerWatts.toFixed(0)}
            <span className="text-sm font-medium text-muted-foreground ml-1">W</span>
          </p>
        </div>
      </div>

      {/* Real-time chart */}
      {chartData.length > 1 ? (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Current (A) over time</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}A`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} A`, "Current"]}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-6">
          Chart will appear once multiple readings arrive
        </p>
      )}

      {/* Status footer */}
      {isStale && (
        <div className="flex items-center gap-2 mt-3 text-xs text-warning">
          <AlertTriangle className="w-3.5 h-3.5" />
          No data received in the last 60 seconds
        </div>
      )}

      {reading && (
        <p className="text-xs text-muted-foreground mt-2">
          Last update: {new Date(reading.created_at).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default LiveSensorCard;
