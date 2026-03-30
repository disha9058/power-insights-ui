import {
  IndianRupee,
  TrendingUp,
  Calendar,
  Zap,
  Loader2,
  AlertTriangle
} from "lucide-react";

import BottomNavigation from "@/components/BottomNavigation";
import { Progress } from "@/components/ui/progress";

import { useBudgetData } from "@/hooks/useBudgetData";
import { useTotalMonthlyStats, useTotalDailyStats } from "@/hooks/useUsageData";
import {
  useAppliances,
  useApplianceInstances,
  useApplianceStates,
  useToggleAppliance
} from "@/hooks/useAppliances";

import ApplianceControlCard from "@/components/ApplianceControlCard";
import DailyUsageList from "@/components/DailyUsageList";

import {
  calculateEnergy,
  calculateCost,
  estimateMonthlyCost
} from "@/lib/energyBudget";


const Dashboard = () => {
  const { data: budgetStatus, isLoading: budgetLoading } = useBudgetData();
  const { totals: monthlyTotals, isLoading: monthlyLoading } = useTotalMonthlyStats();
  const { totals: dailyTotals } = useTotalDailyStats();
  const { data: appliances, isLoading: appliancesLoading } = useAppliances();
  const { data: instances, isLoading: instancesLoading } = useApplianceInstances();
  const { data: applianceStates } = useApplianceStates();
  const toggleAppliance = useToggleAppliance();

  // Use instances for control if available, fallback to templates
  const controlAppliances = instances && instances.length > 0 ? instances : appliances;

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = now.getDate();
  const daysRemaining = daysInMonth - daysPassed;

  const monthSpent = budgetStatus?.month_spent || 0;
  const monthlyBudget = budgetStatus?.monthly_budget || 3000;

  const percentUsed = monthlyBudget > 0
    ? Math.round((monthSpent / monthlyBudget) * 100)
    : 0;

  const remainingBudget = monthlyBudget - monthSpent;

  const estimatedEndOfMonth = estimateMonthlyCost(
    monthSpent,
    daysPassed,
    daysInMonth
  );

  const isOverBudget = estimatedEndOfMonth > monthlyBudget;

  // 🔌 Calculate live power from appliances
  const currentPower = controlAppliances?.reduce((acc, appliance) => {
    const state = applianceStates?.[appliance.id];
    if (state?.state === "on") {
      return acc + Number(appliance.power_rating) / 1000;
    }
    return acc;
  }, 0) || 0;

  // Live cost estimation (per hour)
  const liveEnergy = calculateEnergy(currentPower, 1);
  const liveCost = calculateCost(liveEnergy);

  const handleToggle = (applianceId: string, currentState: string) => {
    const newState = currentState === "on" ? "off" : "on";
    toggleAppliance.mutate({ applianceId, state: newState });
  };

  if (budgetLoading || monthlyLoading || appliancesLoading) {
    return (
      <div className="page-container flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const monthName = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <p className="text-sm text-muted-foreground">{monthName}</p>
        <h1 className="page-title">Energy Budget Dashboard</h1>
      </div>

      <div className="px-5 space-y-5">

        {/* Main Budget Card */}
        <div className="gradient-primary rounded-2xl p-6 text-primary-foreground shadow-lg">
          <p className="text-sm opacity-80">Amount Spent This Month</p>

          <div className="flex items-center gap-2 mt-2">
            <IndianRupee className="w-8 h-8" />
            <span className="text-5xl font-bold">
              {Math.round(monthSpent).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between mt-4 text-sm">
            <span>of ₹{monthlyBudget.toLocaleString()} budget</span>
            <span className="font-semibold">{percentUsed}% used</span>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="stat-card">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Monthly Budget</span>
            <span className="text-sm text-muted-foreground">
              {daysRemaining} days left
            </span>
          </div>

          <Progress value={Math.min(percentUsed, 100)} className="h-3" />

          <div className="flex justify-between mt-2 text-sm">
            <span className="text-muted-foreground">
              ₹{Math.round(monthSpent).toLocaleString()} spent
            </span>
            <span className="font-semibold text-primary">
              ₹{Math.round(remainingBudget).toLocaleString()} remaining
            </span>
          </div>
        </div>

        {/* Estimated End of Month */}
        <div
          className={`stat-card border-2 ${
            isOverBudget
              ? "border-destructive/30 bg-destructive/5"
              : "border-success/30 bg-success/5"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isOverBudget ? "bg-destructive/20" : "bg-success/20"
              }`}
            >
              {isOverBudget ? (
                <AlertTriangle className="text-destructive" />
              ) : (
                <TrendingUp className="text-success" />
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Estimated End of Month
              </p>
              <p className="text-2xl font-bold">
                ₹{estimatedEndOfMonth.toLocaleString()}
              </p>
            </div>
          </div>

          {isOverBudget && (
            <p className="text-sm text-destructive mt-3">
              You may exceed budget by ₹
              {(estimatedEndOfMonth - monthlyBudget).toLocaleString()}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Current Power</span>
            </div>
            <p className="text-xl font-bold">
              {currentPower.toFixed(2)}{" "}
              <span className="text-sm text-muted-foreground">kW</span>
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">
                Live Cost (per hour)
              </span>
            </div>
            <p className="text-xl font-bold">₹{liveCost.toFixed(2)}</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-info" />
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <p className="text-xl font-bold">
              {monthlyTotals.energy_kwh.toFixed(2)} kWh
            </p>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Monthly Cost</span>
            </div>
            <p className="text-xl font-bold">
              ₹{monthlyTotals.cost.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Today's Usage */}
        <div className="stat-card">
          <h3 className="section-title">Today's Usage</h3>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-muted-foreground">Energy Used</p>
              <p className="text-lg font-bold">
                {dailyTotals.energy_kwh.toFixed(2)} kWh
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Cost</p>
              <p className="text-lg font-bold">
                ₹{dailyTotals.cost.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Appliance Control */}
        <div className="stat-card">
          <h3 className="section-title">Appliance Control</h3>

          <div className="space-y-3 mt-3">
            {appliances?.slice(0, 4).map((appliance) => {
              const currentState =
                applianceStates?.[appliance.id]?.state || "off";

              return (
                <ApplianceControlCard
                  key={appliance.id}
                  appliance={appliance}
                  currentState={currentState}
                  onToggle={() =>
                    handleToggle(appliance.id, currentState)
                  }
                  isLoading={toggleAppliance.isPending}
                />
              );
            })}
          </div>
        </div>

        {/* Daily Usage List */}
        <DailyUsageList />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;

