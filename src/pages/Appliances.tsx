import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Loader2, Plus, Minus } from "lucide-react";
import { useAppliances } from "@/hooks/useAppliances";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ApplianceQuantity {
  [applianceId: string]: number;
}

const Appliances = () => {
  const [applianceQuantities, setApplianceQuantities] = useState<ApplianceQuantity>({});
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { data: appliances, isLoading } = useAppliances();

  const updateQuantity = (applianceId: string, delta: number) => {
    setApplianceQuantities((prev) => {
      const current = prev[applianceId] || 0;
      const newValue = Math.max(0, current + delta);
      if (newValue === 0) {
        const { [applianceId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [applianceId]: newValue };
    });
  };

  const setQuantity = (applianceId: string, value: string) => {
    const num = parseInt(value, 10);
    if (value === "" || isNaN(num)) {
      setApplianceQuantities((prev) => {
        const { [applianceId]: _, ...rest } = prev;
        return rest;
      });
      return;
    }
    if (num >= 0 && num <= 99) {
      if (num === 0) {
        setApplianceQuantities((prev) => {
          const { [applianceId]: _, ...rest } = prev;
          return rest;
        });
      } else {
        setApplianceQuantities((prev) => ({ ...prev, [applianceId]: num }));
      }
    }
  };

  const totalApplianceCount = Object.values(applianceQuantities).reduce((sum, qty) => sum + qty, 0);
  const selectedCount = Object.keys(applianceQuantities).length;
  const isValid = totalApplianceCount > 0;

  const handleContinue = async () => {
    if (!isValid) return;

    setIsSaving(true);
    try {
      // Delete previously expanded instances (children with parent_id)
      await supabase
        .from("appliances")
        .delete()
        .not("parent_id", "is", null);

      // Save selections
      await supabase.from("user_appliance_selections").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const selections = Object.entries(applianceQuantities).map(([applianceId, quantity]) => ({
        appliance_id: applianceId,
        quantity,
      }));

      const { error: insertError } = await supabase
        .from("user_appliance_selections")
        .insert(selections);

      if (insertError) throw insertError;

      // Expand appliances into individual instances
      const instances: {
        name: string;
        icon: string | null;
        power_rating: number;
        gpio_pin: number | null;
        parent_id: string;
        instance_number: number;
      }[] = [];

      for (const [applianceId, quantity] of Object.entries(applianceQuantities)) {
        const appliance = appliances?.find((a) => a.id === applianceId);
        if (!appliance) continue;

        for (let i = 1; i <= quantity; i++) {
          instances.push({
            name: quantity === 1 ? appliance.name : `${appliance.name} ${i}`,
            icon: appliance.icon,
            power_rating: appliance.power_rating,
            gpio_pin: appliance.gpio_pin,
            parent_id: applianceId,
            instance_number: i,
          });
        }
      }

      if (instances.length > 0) {
        const { error: expandError } = await supabase
          .from("appliances")
          .insert(instances);

        if (expandError) throw expandError;
      }

      // Update total count in budget_settings
      const { data: budgetData } = await supabase
        .from("budget_settings")
        .select("id")
        .limit(1)
        .single();

      if (budgetData) {
        await supabase
          .from("budget_settings")
          .update({ total_appliances_count: totalApplianceCount })
          .eq("id", budgetData.id);
      }

      toast.success("Appliances saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving appliance selections:", err);
      toast.error("Failed to save selections. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <p className="text-sm text-muted-foreground mb-1">Step 3 of 3</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Your Appliances
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter how many of each appliance you have at home
        </p>
      </div>

      <div className="px-6 flex-1 overflow-auto pb-44">
        {/* Info Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">
                This helps us estimate your energy usage
              </p>
              <p className="text-xs text-muted-foreground">
                Used for load estimation, predictions & recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Appliance Grid */}
        <div className="grid grid-cols-2 gap-3">
          {appliances?.map((appliance) => {
            const quantity = applianceQuantities[appliance.id] || 0;
            const isSelected = quantity > 0;

            return (
              <div
                key={appliance.id}
                className={`rounded-xl border-2 transition-all overflow-hidden ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                {/* Appliance Info */}
                <div className="p-4 pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{appliance.icon || "💡"}</span>
                    {isSelected && (
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {quantity}×
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-foreground text-sm">
                    {appliance.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ~{appliance.power_rating}W
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="px-3 pb-3 pt-1">
                  <p className="text-[10px] text-muted-foreground mb-1.5 text-center">
                    How many do you have?
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => updateQuantity(appliance.id, -1)}
                      disabled={quantity === 0}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        quantity === 0
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30"
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={quantity || ""}
                      onChange={(e) => setQuantity(appliance.id, e.target.value)}
                      placeholder="0"
                      className="w-12 h-8 text-center rounded-lg border border-border bg-background text-foreground font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button
                      onClick={() => updateQuantity(appliance.id, 1)}
                      className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary & Button */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-background via-background to-transparent">
        {/* Summary Card */}
        <div className="bg-card border border-border rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-foreground">{totalApplianceCount}</p>
              <p className="text-xs text-muted-foreground">Total Appliances</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-foreground">{selectedCount}</p>
              <p className="text-xs text-muted-foreground">Types Selected</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!isValid || isSaving}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            isValid && !isSaving
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </span>
          ) : (
            "Start Tracking"
          )}
        </button>
      </div>
    </div>
  );
};

export default Appliances;