
ALTER TABLE public.appliances ADD COLUMN parent_id uuid REFERENCES public.appliances(id) ON DELETE CASCADE DEFAULT NULL;
ALTER TABLE public.appliances ADD COLUMN instance_number integer DEFAULT NULL;
