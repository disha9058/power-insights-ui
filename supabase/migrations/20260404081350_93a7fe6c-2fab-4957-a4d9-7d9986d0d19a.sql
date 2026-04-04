
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  current_amps NUMERIC NOT NULL,
  voltage NUMERIC NOT NULL DEFAULT 230,
  power_watts NUMERIC GENERATED ALWAYS AS (current_amps * voltage) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read sensor_readings"
ON public.sensor_readings FOR SELECT
USING (true);

CREATE POLICY "Allow public insert sensor_readings"
ON public.sensor_readings FOR INSERT
WITH CHECK (true);

CREATE INDEX idx_sensor_readings_created_at ON public.sensor_readings (created_at DESC);

ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;
