import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Check, Loader2, AlertCircle } from "lucide-react";
import { useAppliances } from "@/hooks/useAppliances";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Appliances = () => {
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [applianceCount, setApplianceCount] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { data: appliances, isLoading } = useAppliances();

  const toggleAppliance = (id: string) => {
    setSelectedAppliances((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const validateApplianceCount = (value: string): boolean => {
    if (!value.trim()) {
      setError("Please enter the number of appliances");
      return false;
    }
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid positive number");
      return false;
    }
    if (num > 500) {
      setError("Please enter a realistic number (max 500)");
      return false;
    }
    setError("");
    return true;
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive integers
    if (value === "" || /^[1-9][0-9]*$/.test(value)) {
      setApplianceCount(value);
      if (value) validateApplianceCount(value);
      else setError("");
    }
  };

  const handleContinue = async () => {
    if (!validateApplianceCount(applianceCount)) {
      return;
    }

    setIsSaving(true);
    try {
      // Update budget_settings with total_appliances_count
      const { error: updateError } = await supabase
        .from("budget_settings")
        .update({ total_appliances_count: parseInt(applianceCount, 10) })
        .eq("id", (await supabase.from("budget_settings").select("id").limit(1).single()).data?.id || "");

      if (updateError) throw updateError;

      toast.success("Settings saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving appliance count:", err);
      toast.error("Failed to save settings. Please try again.");
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

  const isValid = applianceCount.trim() !== "" && !error;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <p className="text-sm text-muted-foreground mb-1">Step 3 of 3</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Your Appliances
        </h1>
        <p className="text-muted-foreground text-sm">
          Help us understand your electricity usage better
        </p>
      </div>

      <div className="px-6 flex-1 overflow-auto pb-32">
        {/* Total Appliances Count Section */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <label htmlFor="applianceCount" className="font-semibold text-foreground block mb-1">
                Total Appliances at Home
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Approximate number of electrical appliances in your home
              </p>
              <div className="relative">
                <input
                  id="applianceCount"
                  type="text"
                  inputMode="numeric"
                  value={applianceCount}
                  onChange={handleCountChange}
                  placeholder="e.g. 15"
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-background text-foreground text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    error 
                      ? "border-destructive focus:border-destructive" 
                      : "border-border focus:border-primary"
                  }`}
                />
                {error && (
                  <div className="flex items-center gap-1.5 mt-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Appliance Checklist */}
        <h3 className="text-base font-semibold text-foreground mb-1">Your Appliances</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select the ones you use regularly
        </p>

        <div className="grid grid-cols-2 gap-3">
          {appliances?.map((appliance) => {
            const isSelected = selectedAppliances.includes(appliance.id);
            return (
              <button
                key={appliance.id}
                onClick={() => toggleAppliance(appliance.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{appliance.icon || "💡"}</span>
                  {isSelected && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <p className="font-medium text-foreground text-sm">
                  {appliance.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  ~{appliance.power_rating}W
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-background via-background to-transparent">
        {/* Summary before button */}
        <div className="flex items-center justify-between text-sm mb-3 px-1">
          <span className="text-muted-foreground">
            Total appliances: <span className="font-semibold text-foreground">{applianceCount || "—"}</span>
          </span>
          <span className="text-muted-foreground">
            Selected: <span className="font-semibold text-foreground">{selectedAppliances.length}</span>
          </span>
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
