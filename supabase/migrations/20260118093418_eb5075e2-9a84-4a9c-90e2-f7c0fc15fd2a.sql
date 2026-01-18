-- Add total_appliances_count to budget_settings table
ALTER TABLE public.budget_settings
ADD COLUMN total_appliances_count INTEGER DEFAULT NULL;