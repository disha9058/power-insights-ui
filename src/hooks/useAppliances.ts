import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { useEffect } from "react";

export type Appliance = Tables<"appliances">;
export type ApplianceState = Tables<"appliance_states">;

export const useAppliances = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["appliances"],
    queryFn: async (): Promise<Appliance[]> => {
      const { data, error } = await supabase
        .from("appliances")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 5 * 60 * 1000,
  });

  // Real-time subscription for appliance updates
  useEffect(() => {
    const channel = supabase
      .channel("appliances-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appliances" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["appliances"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

export const useApplianceStates = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["appliance-states"],
    queryFn: async () => {
      // Get the latest state for each appliance
      const { data, error } = await supabase
        .from("appliance_states")
        .select("*")
        .order("timestamp", { ascending: false });
      
      if (error) throw error;
      
      // Group by appliance and get latest state
      const latestStates: Record<string, ApplianceState> = {};
      for (const state of data || []) {
        if (!latestStates[state.appliance_id]) {
          latestStates[state.appliance_id] = state;
        }
      }
      
      return latestStates;
    },
  });

  // Real-time subscription for state changes
  useEffect(() => {
    const channel = supabase
      .channel("appliance-states-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appliance_states" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["appliance-states"] });
          queryClient.invalidateQueries({ queryKey: ["budget-status"] });
          queryClient.invalidateQueries({ queryKey: ["daily-usage"] });
          queryClient.invalidateQueries({ queryKey: ["monthly-usage"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

export const useToggleAppliance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applianceId, state }: { applianceId: string; state: "on" | "off" }) => {
      const { error } = await supabase
        .from("appliance_states")
        .insert({
          appliance_id: applianceId,
          state,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appliance-states"] });
      queryClient.invalidateQueries({ queryKey: ["budget-status"] });
    },
  });
};
