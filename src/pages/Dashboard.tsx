import { IndianRupee, TrendingUp, Calendar, Zap, Lightbulb, Loader2 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { Progress } from "@/components/ui/progress";
import { useBudgetData } from "@/hooks/useBudgetData";
import { useTotalMonthlyStats, useTotalDailyStats } from "@/hooks/useUsageData";
import { useAppliances, useApplianceStates, useToggleAppliance } from "@/hooks/useAppliances";
import ApplianceControlCard from "@/components/ApplianceControlCard";
import DailyUsageList from "@/components/DailyUsageList";

const Dashboard = () => {
  const { data: budgetStatus, isLoading: budgetLoading } = useBudgetData();
  const { totals: monthlyTotals, isLoading: monthlyLoading } = useTotalMonthlyStats();
  const { totals: dailyTotals } = useTotalDailyStats();
  const { data: appliances, isLoading: appliancesLoading } = useAppliances();
  const { data: applianceStates } = useApplianceStates();
  const toggleAppliance = useToggleAppliance();

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - now.getDate();
  const daysPassed = now.getDate();

  const monthSpent = budgetStatus?.month_spent || 0;
  const monthlyBudget = budgetStatus?.monthly_budget || 3000;
  const percentUsed = monthlyBudget > 0 ? Math.round((monthSpent / monthlyBudget) * 100) : 0;
  const remainingBudget = monthlyBudget - monthSpent;

  // Estimate end of month based on current spending rate
  const dailyAverage = daysPassed > 0 ? monthSpent / daysPassed : 0;
  const estimatedEndOfMonth = Math.round(dailyAverage * daysInMonth);
  const isOverBudget = estimatedEndOfMonth > monthlyBudget;

  // Calculate current power (sum of ON appliances power ratings)
  const currentPower = appliances?.reduce((acc, appliance) => {
    const state = applianceStates?.[appliance.id];
    if (state?.state === "on") {
      return acc + Number(appliance.power_rating) / 1000; // Convert W to kW
    }
    return acc;
  }, 0) || 0;

  const handleToggle = (applianceId: string, currentState: string) => {
    const newState = currentState === "on" ? "off" : "on";
    toggleAppliance.mutate({ applianceId, state: newState });
  };

  if (budgetLoading || monthlyLoading || appliancesLoading) {
    return (
      <div className="page-container flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <p className="text-sm text-muted-foreground">{monthName}</p>
        <h1 className="page-title">Budget Overview</h1>
      </div>

      <div className="px-5 space-y-4">
        {/* Main Cost Card */}
        <div className="gradient-primary rounded-2xl p-6 text-primary-foreground shadow-lg shadow-primary/20">
          <p className="text-primary-foreground/80 text-sm mb-1">
            Amount Spent This Month
          </p>
          <div className="flex items-baseline gap-1 mb-4">
            <IndianRupee className="w-8 h-8" />
            <span className="text-5xl font-bold">
              {Math.round(monthSpent).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-foreground/70">
              of ₹{monthlyBudget.toLocaleString()} budget
            </span>
            <span className="font-semibold">
              {percentUsed}% used
            </span>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="stat-card">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-foreground">Monthly Budget</span>
            <span className="text-sm text-muted-foreground">
              {daysRemaining} days left
            </span>
          </div>
          <Progress value={Math.min(percentUsed, 100)} className="h-3 mb-3" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ₹{Math.round(monthSpent).toLocaleString()} spent
            </span>
            <span className="font-semibold text-primary">
              ₹{Math.round(remainingBudget).toLocaleString()} remaining
            </span>
          </div>
        </div>

        {/* Estimated End of Month */}
        <div className={`stat-card border-2 ${isOverBudget ? "border-destructive/30 bg-destructive/5" : "border-success/30 bg-success/5"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isOverBudget ? "bg-destructive/20" : "bg-success/20"}`}>
              <TrendingUp className={`w-6 h-6 ${isOverBudget ? "text-destructive" : "text-success"}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Estimated End of Month</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{estimatedEndOfMonth.toLocaleString()}
              </p>
            </div>
          </div>
          {isOverBudget && (
            <p className="text-sm text-destructive mt-3 font-medium">
              ⚠️ You may exceed budget by ₹{(estimatedEndOfMonth - monthlyBudget).toLocaleString()}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Current Power</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {currentPower.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">kW</span>
            </p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-info" />
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {monthlyTotals.energy_kwh.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">kWh</span>
            </p>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="stat-card">
          <h3 className="section-title">Today's Usage</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Energy Used</p>
              <p className="text-lg font-bold text-foreground">{dailyTotals.energy_kwh.toFixed(2)} kWh</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cost</p>
              <p className="text-lg font-bold text-foreground">₹{dailyTotals.cost.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Daily Budget</span>
              <span className={`font-semibold ${budgetStatus?.daily_overrun ? "text-destructive" : "text-success"}`}>
                ₹{Math.round(budgetStatus?.daily_remaining || 0)} remaining
              </span>
            </div>
          </div>
        </div>

        {/* Appliance Control */}
        <div className="stat-card">
          <h3 className="section-title">Appliance Control</h3>
          <div className="space-y-3">
            {appliances?.slice(0, 4).map((appliance) => {
              const currentState = applianceStates?.[appliance.id]?.state || "off";
              return (
                <ApplianceControlCard
                  key={appliance.id}
                  appliance={appliance}
                  currentState={currentState}
                  onToggle={() => handleToggle(appliance.id, currentState)}
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
