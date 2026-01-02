import { Zap, Gauge, Activity, Waves, TrendingUp, Battery } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { consumptionData } from "@/data/dummyData";

const ConsumptionTracker = () => {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Consumption Tracker</h1>
        <p className="page-subtitle">Real-time power monitoring</p>
      </div>

      <div className="px-5 space-y-4">
        {/* Live Power Reading */}
        <div className="stat-card text-center py-8">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse-soft">
                <Zap className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
          </div>
          <p className="text-5xl font-bold text-foreground mb-1">
            {consumptionData.currentPower}
            <span className="text-2xl font-medium text-muted-foreground ml-2">kW</span>
          </p>
          <p className="text-muted-foreground">Current Power Draw</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></span>
            Live
          </div>
        </div>

        {/* Electrical Parameters */}
        <div className="stat-card">
          <h3 className="section-title">Electrical Parameters</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Voltage</span>
              </div>
              <p className="text-xl font-bold">{consumptionData.voltage} <span className="text-sm font-normal text-muted-foreground">V</span></p>
            </div>
            <div className="p-4 bg-secondary rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Current</span>
              </div>
              <p className="text-xl font-bold">{consumptionData.current} <span className="text-sm font-normal text-muted-foreground">A</span></p>
            </div>
            <div className="p-4 bg-secondary rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Waves className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Frequency</span>
              </div>
              <p className="text-xl font-bold">{consumptionData.frequency} <span className="text-sm font-normal text-muted-foreground">Hz</span></p>
            </div>
            <div className="p-4 bg-secondary rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Power Factor</span>
              </div>
              <p className="text-xl font-bold">{consumptionData.powerFactor}</p>
            </div>
          </div>
        </div>

        {/* Energy Summary */}
        <div className="stat-card">
          <h3 className="section-title">Energy Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Usage</p>
                  <p className="text-lg font-bold">{consumptionData.todayUsage} kWh</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">₹{(consumptionData.todayUsage * 7.5).toFixed(0)}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Battery className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Energy (This Month)</p>
                  <p className="text-lg font-bold">{consumptionData.totalEnergy} kWh</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">₹{(consumptionData.totalEnergy * 7.5).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Device Status */}
        <div className="stat-card">
          <h3 className="section-title">Sensor Status</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm">Raspberry Pi Connected</span>
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">Online</span>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ConsumptionTracker;
