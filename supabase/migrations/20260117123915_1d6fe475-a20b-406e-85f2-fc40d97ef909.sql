-- Create appliances table
CREATE TABLE public.appliances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  gpio_pin INTEGER,
  power_rating NUMERIC NOT NULL DEFAULT 0,
  icon TEXT DEFAULT '💡',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appliance_states table to track on/off changes
CREATE TABLE public.appliance_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appliance_id UUID REFERENCES public.appliances(id) ON DELETE CASCADE NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('on', 'off')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget_settings table
CREATE TABLE public.budget_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  daily_budget NUMERIC NOT NULL DEFAULT 100,
  monthly_budget NUMERIC NOT NULL DEFAULT 3000,
  cost_per_unit NUMERIC NOT NULL DEFAULT 7.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_usage_summary table for aggregated data
CREATE TABLE public.daily_usage_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appliance_id UUID REFERENCES public.appliances(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_on_time_minutes NUMERIC NOT NULL DEFAULT 0,
  energy_kwh NUMERIC NOT NULL DEFAULT 0,
  cost NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(appliance_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appliance_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_usage_summary ENABLE ROW LEVEL SECURITY;

-- Create public access policies (for IoT device access without auth)
CREATE POLICY "Allow public read access on appliances" ON public.appliances FOR SELECT USING (true);
CREATE POLICY "Allow public insert on appliances" ON public.appliances FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on appliances" ON public.appliances FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on appliances" ON public.appliances FOR DELETE USING (true);

CREATE POLICY "Allow public read access on appliance_states" ON public.appliance_states FOR SELECT USING (true);
CREATE POLICY "Allow public insert on appliance_states" ON public.appliance_states FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on budget_settings" ON public.budget_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on budget_settings" ON public.budget_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on budget_settings" ON public.budget_settings FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on daily_usage_summary" ON public.daily_usage_summary FOR SELECT USING (true);
CREATE POLICY "Allow public insert on daily_usage_summary" ON public.daily_usage_summary FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on daily_usage_summary" ON public.daily_usage_summary FOR UPDATE USING (true);

-- Function to calculate on-time between state changes
CREATE OR REPLACE FUNCTION public.calculate_appliance_on_time(
  p_appliance_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_minutes NUMERIC := 0;
  prev_state TEXT := 'off';
  prev_time TIMESTAMP WITH TIME ZONE;
  curr_state TEXT;
  curr_time TIMESTAMP WITH TIME ZONE;
  state_record RECORD;
BEGIN
  FOR state_record IN
    SELECT state, timestamp
    FROM appliance_states
    WHERE appliance_id = p_appliance_id
      AND timestamp >= p_start_date::timestamp
      AND timestamp < (p_end_date + 1)::timestamp
    ORDER BY timestamp ASC
  LOOP
    curr_state := state_record.state;
    curr_time := state_record.timestamp;
    
    IF prev_state = 'on' AND prev_time IS NOT NULL THEN
      total_minutes := total_minutes + EXTRACT(EPOCH FROM (curr_time - prev_time)) / 60;
    END IF;
    
    prev_state := curr_state;
    prev_time := curr_time;
  END LOOP;
  
  -- If still ON, count time until end of period
  IF prev_state = 'on' AND prev_time IS NOT NULL THEN
    total_minutes := total_minutes + EXTRACT(EPOCH FROM (LEAST(now(), (p_end_date + 1)::timestamp) - prev_time)) / 60;
  END IF;
  
  RETURN ROUND(total_minutes, 2);
END;
$$;

-- Function to get daily usage summary
CREATE OR REPLACE FUNCTION public.get_daily_usage_summary(p_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  appliance_id UUID,
  appliance_name TEXT,
  icon TEXT,
  power_rating NUMERIC,
  total_on_time_minutes NUMERIC,
  energy_kwh NUMERIC,
  cost NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cost_per_unit NUMERIC;
BEGIN
  SELECT bs.cost_per_unit INTO cost_per_unit FROM budget_settings bs LIMIT 1;
  IF cost_per_unit IS NULL THEN cost_per_unit := 7.5; END IF;
  
  RETURN QUERY
  SELECT 
    a.id as appliance_id,
    a.name as appliance_name,
    a.icon,
    a.power_rating,
    calculate_appliance_on_time(a.id, p_date, p_date) as total_on_time_minutes,
    ROUND((calculate_appliance_on_time(a.id, p_date, p_date) / 60) * (a.power_rating / 1000), 4) as energy_kwh,
    ROUND((calculate_appliance_on_time(a.id, p_date, p_date) / 60) * (a.power_rating / 1000) * cost_per_unit, 2) as cost
  FROM appliances a;
END;
$$;

-- Function to get monthly usage summary
CREATE OR REPLACE FUNCTION public.get_monthly_usage_summary(p_year INTEGER, p_month INTEGER)
RETURNS TABLE (
  appliance_id UUID,
  appliance_name TEXT,
  icon TEXT,
  power_rating NUMERIC,
  total_on_time_minutes NUMERIC,
  energy_kwh NUMERIC,
  cost NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  start_date DATE;
  end_date DATE;
  cost_per_unit NUMERIC;
BEGIN
  start_date := make_date(p_year, p_month, 1);
  end_date := (start_date + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  SELECT bs.cost_per_unit INTO cost_per_unit FROM budget_settings bs LIMIT 1;
  IF cost_per_unit IS NULL THEN cost_per_unit := 7.5; END IF;
  
  RETURN QUERY
  SELECT 
    a.id as appliance_id,
    a.name as appliance_name,
    a.icon,
    a.power_rating,
    calculate_appliance_on_time(a.id, start_date, end_date) as total_on_time_minutes,
    ROUND((calculate_appliance_on_time(a.id, start_date, end_date) / 60) * (a.power_rating / 1000), 4) as energy_kwh,
    ROUND((calculate_appliance_on_time(a.id, start_date, end_date) / 60) * (a.power_rating / 1000) * cost_per_unit, 2) as cost
  FROM appliances a;
END;
$$;

-- Function to get budget status
CREATE OR REPLACE FUNCTION public.get_budget_status()
RETURNS TABLE (
  daily_budget NUMERIC,
  monthly_budget NUMERIC,
  cost_per_unit NUMERIC,
  today_spent NUMERIC,
  month_spent NUMERIC,
  daily_remaining NUMERIC,
  monthly_remaining NUMERIC,
  daily_overrun BOOLEAN,
  monthly_overrun BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_daily_budget NUMERIC;
  v_monthly_budget NUMERIC;
  v_cost_per_unit NUMERIC;
  v_today_spent NUMERIC := 0;
  v_month_spent NUMERIC := 0;
BEGIN
  SELECT bs.daily_budget, bs.monthly_budget, bs.cost_per_unit 
  INTO v_daily_budget, v_monthly_budget, v_cost_per_unit
  FROM budget_settings bs LIMIT 1;
  
  IF v_daily_budget IS NULL THEN v_daily_budget := 100; END IF;
  IF v_monthly_budget IS NULL THEN v_monthly_budget := 3000; END IF;
  IF v_cost_per_unit IS NULL THEN v_cost_per_unit := 7.5; END IF;
  
  SELECT COALESCE(SUM(dus.cost), 0) INTO v_today_spent
  FROM get_daily_usage_summary(CURRENT_DATE) dus;
  
  SELECT COALESCE(SUM(mus.cost), 0) INTO v_month_spent
  FROM get_monthly_usage_summary(EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER) mus;
  
  RETURN QUERY SELECT
    v_daily_budget,
    v_monthly_budget,
    v_cost_per_unit,
    v_today_spent,
    v_month_spent,
    v_daily_budget - v_today_spent,
    v_monthly_budget - v_month_spent,
    v_today_spent > v_daily_budget,
    v_month_spent > v_monthly_budget;
END;
$$;

-- Enable realtime for appliance_states
ALTER PUBLICATION supabase_realtime ADD TABLE public.appliance_states;

-- Insert default budget settings
INSERT INTO public.budget_settings (daily_budget, monthly_budget, cost_per_unit)
VALUES (100, 3000, 7.5);

-- Insert sample appliances
INSERT INTO public.appliances (name, gpio_pin, power_rating, icon) VALUES
('LED Lights', 17, 10, '💡'),
('Ceiling Fan', 18, 75, '🌀'),
('Air Conditioner', 22, 1500, '❄️'),
('Refrigerator', 23, 150, '🧊'),
('Television', 24, 100, '📺'),
('Water Heater', 25, 2000, '🚿');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_appliances_updated_at
  BEFORE UPDATE ON public.appliances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_settings_updated_at
  BEFORE UPDATE ON public.budget_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();