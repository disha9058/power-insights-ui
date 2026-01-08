import { useState } from "react";
import { IndianRupee, TrendingUp, Calendar, Zap, Lightbulb } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { Progress } from "@/components/ui/progress";
import { budgetData, dailySpending } from "@/data/dummyData";

const RASPBERRY_PI_IP = "RASPBERRY_PI_IP"; // Replace with actual IP

const Dashboard = () => {
  const [bulbOn, setBulbOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isOverBudget = budgetData.estimatedEndOfMonth > budgetData.monthlyBudget;

  const handleBulbToggle = async (checked: boolean) => {
    setIsLoading(true);
    const endpoint = checked ? "on" : "off";
    
    try {
      await fetch(`http://${RASPBERRY_PI_IP}:5000/api/led/${endpoint}`, {
        method: "POST",
      });
      setBulbOn(checked);
    } catch (error) {
      console.error("Failed to toggle bulb:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <p className="text-sm text-muted-foreground">January 2026</p>
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
              {budgetData.amountSpent.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-foreground/70">
              of ₹{budgetData.monthlyBudget.toLocaleString()} budget
            </span>
            <span className="font-semibold">
              {budgetData.percentUsed}% used
            </span>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="stat-card">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-foreground">Monthly Budget</span>
            <span className="text-sm text-muted-foreground">
              {budgetData.daysRemaining} days left
            </span>
          </div>
          <Progress value={budgetData.percentUsed} className="h-3 mb-3" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ₹{budgetData.amountSpent.toLocaleString()} spent
            </span>
            <span className="font-semibold text-primary">
              ₹{budgetData.remainingBudget.toLocaleString()} remaining
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
                ₹{budgetData.estimatedEndOfMonth.toLocaleString()}
              </p>
            </div>
          </div>
          {isOverBudget && (
            <p className="text-sm text-destructive mt-3 font-medium">
              ⚠️ You may exceed budget by ₹{(budgetData.estimatedEndOfMonth - budgetData.monthlyBudget).toLocaleString()}
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
              {budgetData.currentPower} <span className="text-sm font-normal text-muted-foreground">kW</span>
            </p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-info" />
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {budgetData.totalConsumption} <span className="text-sm font-normal text-muted-foreground">kWh</span>
            </p>
          </div>
        </div>

        {/* Recent Spending */}
        <div className="stat-card">
          <h3 className="section-title">Recent Daily Spending</h3>
          <div className="space-y-3">
            {dailySpending.slice(0, 5).map((day, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-border last:border-0"
              >
                <div>
                  <span className="font-medium text-foreground">{day.date}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {day.units} kWh
                  </span>
                </div>
                <span className="font-bold text-foreground">₹{day.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appliance Control */}
        <div className="stat-card">
          <h3 className="section-title">Appliance Control</h3>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${bulbOn ? "bg-success/20" : "bg-muted"}`}>
                <Lightbulb className={`w-7 h-7 transition-colors ${bulbOn ? "text-success" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">Bulb Power</p>
                <p className={`text-sm font-medium ${bulbOn ? "text-success" : "text-muted-foreground"}`}>
                  Bulb is {bulbOn ? "ON" : "OFF"}
                </p>
              </div>
            </div>
            <label className="custom-switch">
              <input
                type="checkbox"
                checked={bulbOn}
                onChange={(e) => handleBulbToggle(e.target.checked)}
                disabled={isLoading}
              />
              <span className="custom-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
