import { useDailyUsage } from "@/hooks/useUsageData";
import { format, subDays } from "date-fns";

const DailyUsageList = () => {
  // Get last 5 days of usage
  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => 
    format(subDays(today, i), "yyyy-MM-dd")
  );

  const { data: todayUsage } = useDailyUsage(dates[0]);
  const { data: day1Usage } = useDailyUsage(dates[1]);
  const { data: day2Usage } = useDailyUsage(dates[2]);
  const { data: day3Usage } = useDailyUsage(dates[3]);
  const { data: day4Usage } = useDailyUsage(dates[4]);

  const calculateDayTotal = (usage: typeof todayUsage) => {
    if (!usage) return { cost: 0, units: 0 };
    return usage.reduce(
      (acc, item) => ({
        cost: acc.cost + Number(item.cost),
        units: acc.units + Number(item.energy_kwh),
      }),
      { cost: 0, units: 0 }
    );
  };

  const dailyData = [
    { date: "Today", ...calculateDayTotal(todayUsage) },
    { date: "Yesterday", ...calculateDayTotal(day1Usage) },
    { date: format(subDays(today, 2), "MMM d"), ...calculateDayTotal(day2Usage) },
    { date: format(subDays(today, 3), "MMM d"), ...calculateDayTotal(day3Usage) },
    { date: format(subDays(today, 4), "MMM d"), ...calculateDayTotal(day4Usage) },
  ].filter(d => d.cost > 0 || d.units > 0);

  if (dailyData.length === 0) {
    return (
      <div className="stat-card">
        <h3 className="section-title">Recent Daily Spending</h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          No usage data yet. Turn on some appliances to start tracking!
        </p>
      </div>
    );
  }

  return (
    <div className="stat-card">
      <h3 className="section-title">Recent Daily Spending</h3>
      <div className="space-y-3">
        {dailyData.map((day, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-border last:border-0"
          >
            <div>
              <span className="font-medium text-foreground">{day.date}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {day.units.toFixed(2)} kWh
              </span>
            </div>
            <span className="font-bold text-foreground">₹{day.cost.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyUsageList;
