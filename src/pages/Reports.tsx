import { useState } from "react";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { dailyReports, monthlyReports } from "@/data/dummyData";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const Reports = () => {
  const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");

  const chartData = dailyReports.map((d) => ({
    name: d.date,
    usage: d.usage,
  })).reverse();

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">View your electricity usage history</p>
      </div>

      <div className="px-5 space-y-4">
        {/* Tab Switcher */}
        <div className="flex bg-secondary rounded-xl p-1">
          <button
            onClick={() => setActiveTab("daily")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "daily"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "monthly"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Usage Chart */}
        {activeTab === "daily" && (
          <div className="stat-card">
            <h3 className="section-title">Weekly Trend</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} kWh`, "Usage"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsage)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Reports List */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">
              {activeTab === "daily" ? "Daily Usage" : "Monthly Usage"}
            </h3>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-3">
            {activeTab === "daily"
              ? dailyReports.map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{report.date}</p>
                      <p className="text-sm text-muted-foreground">{report.usage} kWh</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{report.cost}</p>
                      {index > 0 && (
                        <div className="flex items-center justify-end gap-1 text-xs">
                          {report.usage > dailyReports[index - 1].usage ? (
                            <>
                              <TrendingUp className="w-3 h-3 text-destructive" />
                              <span className="text-destructive">
                                +{((report.usage - dailyReports[index - 1].usage) / dailyReports[index - 1].usage * 100).toFixed(0)}%
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3 h-3 text-success" />
                              <span className="text-success">
                                {((report.usage - dailyReports[index - 1].usage) / dailyReports[index - 1].usage * 100).toFixed(0)}%
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              : monthlyReports.map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{report.month}</p>
                      <p className="text-sm text-muted-foreground">{report.usage} kWh</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{report.cost.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="stat-card">
          <h3 className="section-title">Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-secondary rounded-xl">
              <p className="text-2xl font-bold text-foreground">
                {activeTab === "daily" ? "10.2" : "310.9"}
              </p>
              <p className="text-xs text-muted-foreground">
                Avg {activeTab === "daily" ? "Daily" : "Monthly"} (kWh)
              </p>
            </div>
            <div className="text-center p-4 bg-secondary rounded-xl">
              <p className="text-2xl font-bold text-foreground">
                ₹{activeTab === "daily" ? "76" : "2,332"}
              </p>
              <p className="text-xs text-muted-foreground">
                Avg {activeTab === "daily" ? "Daily" : "Monthly"} Cost
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Reports;
