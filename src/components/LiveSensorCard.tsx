import { Activity, Zap, AlertTriangle } from "lucide-react";
import { useLatestSensorReading } from "@/hooks/useSensorData";

const LiveSensorCard = () => {
  const { reading, isLoading, isStale } = useLatestSensorReading();

  if (isLoading) {
    return (
      <div className="stat-card animate-pulse">
        <div className="h-20 bg-muted rounded" />
      </div>
    );
  }

  const currentAmps = reading?.current_amps ?? 0;
  const powerWatts = reading?.power_watts ?? 0;
  const statusColor = isStale ? "text-warning" : "text-success";
  const statusLabel = isStale ? "Offline" : "Live";

  return (
    <div className="stat-card border-2 border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="section-title flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Live Sensor
        </h3>
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${statusColor}`}>
          <span className={`w-2 h-2 rounded-full ${isStale ? "bg-warning" : "bg-success animate-pulse"}`} />
          {statusLabel}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-xs text-muted-foreground">Current</span>
          </div>
          <p className="text-2xl font-bold">
            {currentAmps.toFixed(2)}{" "}
            <span className="text-sm text-muted-foreground">A</span>
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Power</span>
          </div>
          <p className="text-2xl font-bold">
            {powerWatts.toFixed(0)}{" "}
            <span className="text-sm text-muted-foreground">W</span>
          </p>
        </div>
      </div>

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
