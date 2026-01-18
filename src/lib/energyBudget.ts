export const UNIT_RATE = 8; // ₹ per kWh
export function calculateEnergy(powerKW: number, hours: number) {
  return powerKW * hours;
}

export function calculateCost(energyKwh: number) {
  return energyKwh * UNIT_RATE;
}

export function estimateMonthlyCost(
  currentSpent: number,
  daysPassed: number,
  totalDays: number
) {
  if (daysPassed === 0) return 0;
  const dailyAvg = currentSpent / daysPassed;
  return Math.round(dailyAvg * totalDays);
}

