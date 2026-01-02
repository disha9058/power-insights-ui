export const budgetData = {
  monthlyBudget: 3000,
  amountSpent: 1850,
  remainingBudget: 1150,
  estimatedEndOfMonth: 2780,
  percentUsed: 62,
  daysRemaining: 12,
  currentPower: 1.2,
  totalConsumption: 245.5,
};

export const billData = {
  unitsConsumed: 285,
  billAmount: 2140,
  billingPeriod: "Dec 2025",
  averageDaily: 9.5,
};

export const appliancesList = [
  { id: 1, name: "LED Lights", icon: "💡", typical: 10 },
  { id: 2, name: "Ceiling Fan", icon: "🌀", typical: 75 },
  { id: 3, name: "Air Conditioner", icon: "❄️", typical: 1500 },
  { id: 4, name: "Refrigerator", icon: "🧊", typical: 150 },
  { id: 5, name: "Television", icon: "📺", typical: 100 },
  { id: 6, name: "Washing Machine", icon: "🧺", typical: 500 },
  { id: 7, name: "Water Heater", icon: "🚿", typical: 2000 },
  { id: 8, name: "Microwave", icon: "🍳", typical: 1000 },
];

export const budgetAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Budget Usage Alert",
    message: "You have used 62% of your monthly electricity budget (₹1,850 of ₹3,000).",
    time: "Just now",
  },
  {
    id: 2,
    type: "danger",
    title: "High Cost Detected",
    message: "AC usage yesterday cost ₹85 - consider reducing usage during peak hours.",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "warning",
    title: "Approaching Budget Limit",
    message: "At current rate, you may exceed your monthly budget by ₹220.",
    time: "Yesterday",
  },
  {
    id: 4,
    type: "info",
    title: "Cost Saving Tip",
    message: "Running AC at 24°C instead of 20°C can save up to ₹300/month.",
    time: "2 days ago",
  },
];

export const dailySpending = [
  { date: "Today", cost: 95, units: 12.5 },
  { date: "Yesterday", cost: 142, units: 18.8 },
  { date: "Jan 1", cost: 88, units: 11.7 },
  { date: "Dec 31", cost: 110, units: 14.5 },
  { date: "Dec 30", cost: 125, units: 16.5 },
  { date: "Dec 29", cost: 78, units: 10.3 },
  { date: "Dec 28", cost: 92, units: 12.1 },
];
