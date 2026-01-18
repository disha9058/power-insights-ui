-- Create table for user appliance selections with quantities
CREATE TABLE public.user_appliance_selections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appliance_id UUID NOT NULL REFERENCES public.appliances(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(appliance_id)
);

-- Enable RLS
ALTER TABLE public.user_appliance_selections ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (IoT device without auth)
CREATE POLICY "Allow public read access on user_appliance_selections"
  ON public.user_appliance_selections FOR SELECT USING (true);

CREATE POLICY "Allow public insert on user_appliance_selections"
  ON public.user_appliance_selections FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on user_appliance_selections"
  ON public.user_appliance_selections FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on user_appliance_selections"
  ON public.user_appliance_selections FOR DELETE USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_user_appliance_selections_updated_at
  BEFORE UPDATE ON public.user_appliance_selections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();