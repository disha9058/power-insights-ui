import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UsageSummary {
  appliance_id: string;
  appliance_name: string;
  icon: string;
  power_rating: number;
  total_on_time_minutes: number;
  energy_kwh: number;
  cost: number;
}

export const useDailyUsage = (date?: string) => {
  return useQuery({
    queryKey: ["daily-usage", date],
    queryFn: async (): Promise<UsageSummary[]> => {
      const { data, error } = await supabase.rpc("get_daily_usage_summary", {
        p_date: date || new Date().toISOString().split("T")[0],
      });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useMonthlyUsage = (year?: number, month?: number) => {
  const now = new Date();
  const targetYear = year || now.getFullYear();
  const targetMonth = month || now.getMonth() + 1;

  return useQuery({
    queryKey: ["monthly-usage", targetYear, targetMonth],
    queryFn: async (): Promise<UsageSummary[]> => {
      const { data, error } = await supabase.rpc("get_monthly_usage_summary", {
        p_year: targetYear,
        p_month: targetMonth,
      });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useTotalDailyStats = (date?: string) => {
  const { data: usageData, isLoading, error } = useDailyUsage(date);

  const totals = usageData?.reduce(
    (acc, item) => ({
      energy_kwh: acc.energy_kwh + Number(item.energy_kwh),
      cost: acc.cost + Number(item.cost),
      on_time_minutes: acc.on_time_minutes + Number(item.total_on_time_minutes),
    }),
    { energy_kwh: 0, cost: 0, on_time_minutes: 0 }
  ) || { energy_kwh: 0, cost: 0, on_time_minutes: 0 };

  return { totals, isLoading, error };
};

export const useTotalMonthlyStats = (year?: number, month?: number) => {
  const { data: usageData, isLoading, error } = useMonthlyUsage(year, month);

  const totals = usageData?.reduce(
    (acc, item) => ({
      energy_kwh: acc.energy_kwh + Number(item.energy_kwh),
      cost: acc.cost + Number(item.cost),
      on_time_minutes: acc.on_time_minutes + Number(item.total_on_time_minutes),
    }),
    { energy_kwh: 0, cost: 0, on_time_minutes: 0 }
  ) || { energy_kwh: 0, cost: 0, on_time_minutes: 0 };

  return { totals, usageData, isLoading, error };
};
