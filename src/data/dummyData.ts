export const dashboardData = {
  totalConsumption: 342.5,
  estimatedCost: 2568.75,
  currentPower: 1.2,
  monthlyAverage: 11.4,
  lastUpdated: "2 minutes ago",
};

export const consumptionData = {
  currentPower: 1.2,
  voltage: 230,
  current: 5.2,
  frequency: 50,
  powerFactor: 0.92,
  todayUsage: 8.4,
  totalEnergy: 342.5,
};

export const hourlyData = [
  { hour: "6 AM", value: 0.8 },
  { hour: "8 AM", value: 1.5 },
  { hour: "10 AM", value: 1.2 },
  { hour: "12 PM", value: 1.8 },
  { hour: "2 PM", value: 2.1 },
  { hour: "4 PM", value: 1.9 },
  { hour: "6 PM", value: 2.5 },
  { hour: "8 PM", value: 2.2 },
  { hour: "10 PM", value: 1.4 },
];

export const dailyReports = [
  { date: "Today", usage: 8.4, cost: 63.0 },
  { date: "Yesterday", usage: 11.2, cost: 84.0 },
  { date: "Dec 31", usage: 9.8, cost: 73.5 },
  { date: "Dec 30", usage: 10.5, cost: 78.75 },
  { date: "Dec 29", usage: 12.1, cost: 90.75 },
  { date: "Dec 28", usage: 8.9, cost: 66.75 },
  { date: "Dec 27", usage: 10.2, cost: 76.5 },
];

export const monthlyReports = [
  { month: "January", usage: 342.5, cost: 2568.75 },
  { month: "December", usage: 315.2, cost: 2364.0 },
  { month: "November", usage: 298.7, cost: 2240.25 },
  { month: "October", usage: 287.4, cost: 2155.5 },
];

export const alerts = [
  {
    id: 1,
    type: "warning",
    title: "High Energy Usage Detected",
    message: "Power consumption exceeded 2kW at 6:30 PM today.",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "info",
    title: "Monthly Report Available",
    message: "Your December electricity report is ready to view.",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "danger",
    title: "Unusual Consumption Pattern",
    message: "Detected 40% higher usage than usual during midnight.",
    time: "Yesterday",
  },
  {
    id: 4,
    type: "warning",
    title: "Peak Hour Alert",
    message: "You're using electricity during peak pricing hours (6-9 PM).",
    time: "Yesterday",
  },
  {
    id: 5,
    type: "info",
    title: "Energy Saving Tip",
    message: "Switching off standby devices can save up to 10% on your bill.",
    time: "2 days ago",
  },
];
