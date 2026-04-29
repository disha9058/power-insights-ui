CREATE OR REPLACE FUNCTION public.reset_budget_data(p_monthly_budget NUMERIC)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_daily NUMERIC;
  v_id UUID;
BEGIN
  v_daily := ROUND((p_monthly_budget / 30.0)::numeric, 2);

  -- Wipe all spending history so today/month spent reset to ₹0
  DELETE FROM appliance_states;
  DELETE FROM daily_usage_summary;

  -- Upsert single budget settings row
  SELECT id INTO v_id FROM budget_settings LIMIT 1;
  IF v_id IS NULL THEN
    INSERT INTO budget_settings (monthly_budget, daily_budget)
    VALUES (p_monthly_budget, v_daily);
  ELSE
    UPDATE budget_settings
    SET monthly_budget = p_monthly_budget,
        daily_budget = v_daily,
        updated_at = now()
    WHERE id = v_id;
  END IF;

  -- Seed all appliances with an OFF baseline so live power = 0
  INSERT INTO appliance_states (appliance_id, state)
  SELECT id, 'off' FROM appliances;
END;
$$;