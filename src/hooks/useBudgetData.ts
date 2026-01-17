import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BudgetStatus {
  daily_budget: number;
  monthly_budget: number;
  cost_per_unit: number;
  today_spent: number;
  month_spent: number;
  daily_remaining: number;
  monthly_remaining: number;
  daily_overrun: boolean;
  monthly_overrun: boolean;
}

export const useBudgetData = () => {
  return useQuery({
    queryKey: ["budget-status"],
    queryFn: async (): Promise<BudgetStatus> => {
      const { data, error } = await supabase.rpc("get_budget_status");
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return {
          daily_budget: 100,
          monthly_budget: 3000,
          cost_per_unit: 7.5,
          today_spent: 0,
          month_spent: 0,
          daily_remaining: 100,
          monthly_remaining: 3000,
          daily_overrun: false,
          monthly_overrun: false,
        };
      }
      
      return data[0];
    },
  });
};
