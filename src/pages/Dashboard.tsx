import { Zap, IndianRupee, TrendingUp, Clock } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import StatCard from "@/components/StatCard";
import UsageChart from "@/components/UsageChart";
import { dashboardData, hourlyData } from "@/data/dummyData";

const Dashboard = () => {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* Main Stats */}
      <div className="px-5 space-y-4">
        {/* Total Consumption Card */}
        <div className="gradient-primary rounded-2xl p-6 text-primary-foreground shadow-lg shadow-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm mb-1">Total Consumption</p>
              <p className="text-4xl font-bold">
                {dashboardData.totalConsumption}
                <span className="text-xl font-medium ml-1">kWh</span>
              </p>
              <p className="text-primary-foreground/70 text-sm mt-2">
                This month • Updated {dashboardData.lastUpdated}
              </p>
            </div>
            <div className="w-14 h-14 bg-primary-foreground/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={IndianRupee}
            label="Estimated Cost"
            value={`₹${dashboardData.estimatedCost.toLocaleString()}`}
          />
          <StatCard
            icon={TrendingUp}
            label="Current Power"
            value={dashboardData.currentPower}
            unit="kW"
          />
          <StatCard
            icon={Clock}
            label="Daily Average"
            value={dashboardData.monthlyAverage}
            unit="kWh"
          />
          <div className="stat-card flex flex-col justify-center items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary flex items-center justify-center mb-2">
              <span className="text-sm font-bold text-primary">85%</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">Efficiency Score</p>
          </div>
        </div>

        {/* Usage Chart */}
        <UsageChart data={hourlyData} />

        {/* Quick Summary */}
        <div className="stat-card">
          <h3 className="section-title">Quick Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Today's Usage</span>
              <span className="font-semibold">8.4 kWh</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Yesterday</span>
              <span className="font-semibold">11.2 kWh</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">This Week</span>
              <span className="font-semibold">67.8 kWh</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
