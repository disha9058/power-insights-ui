import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SensorReading {
  id: string;
  current_amps: number;
  voltage: number;
  power_watts: number;
  created_at: string;
}

export const useLatestSensorReading = () => {
  const [liveReading, setLiveReading] = useState<SensorReading | null>(null);

  const query = useQuery({
    queryKey: ["latest-sensor-reading"],
    queryFn: async (): Promise<SensorReading | null> => {
      const { data, error } = await supabase
        .from("sensor_readings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as SensorReading | null;
    },
    refetchInterval: 15000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("sensor-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sensor_readings" },
        (payload) => {
          setLiveReading(payload.new as SensorReading);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const latest = liveReading || query.data;

  const isStale = latest
    ? Date.now() - new Date(latest.created_at).getTime() > 60000
    : true;

  return {
    reading: latest,
    isLoading: query.isLoading,
    isStale,
  };
};

export const useRecentSensorReadings = (limit = 30) => {
  const [realtimeReadings, setRealtimeReadings] = useState<SensorReading[]>([]);

  const query = useQuery({
    queryKey: ["recent-sensor-readings", limit],
    queryFn: async (): Promise<SensorReading[]> => {
      const { data, error } = await supabase
        .from("sensor_readings")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(limit);

      if (error) throw error;
      return (data as SensorReading[]) || [];
    },
    refetchInterval: 15000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("sensor-history-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sensor_readings" },
        (payload) => {
          setRealtimeReadings((prev) => {
            const updated = [...prev, payload.new as SensorReading];
            return updated.slice(-limit);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  const allReadings = realtimeReadings.length > 0
    ? [...(query.data || []), ...realtimeReadings]
        .filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .slice(-limit)
    : query.data || [];

  return {
    readings: allReadings,
    isLoading: query.isLoading,
  };
};
