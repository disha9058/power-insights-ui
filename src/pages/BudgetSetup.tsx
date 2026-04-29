import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IndianRupee, Wallet, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BudgetSetup = () => {
  const [budget, setBudget] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = async () => {
    if (!budget) return;
    setSaving(true);
    try {
      const monthly = Number(budget);
      const daily = Math.round((monthly / 30) * 100) / 100;

      // Reset spending counters by clearing the data they're computed from.
      // get_daily/monthly_usage_summary derive cost from appliance_states history
      // and daily_usage_summary rows — wipe both so today/month spent = ₹0.
      await supabase.from("appliance_states").delete().not("id", "is", null);
      await supabase.from("daily_usage_summary").delete().not("id", "is", null);

      // Upsert budget settings (single-row table)
      const { data: existing } = await supabase
        .from("budget_settings")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        await supabase
          .from("budget_settings")
          .update({ monthly_budget: monthly, daily_budget: daily })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("budget_settings")
          .insert({ monthly_budget: monthly, daily_budget: daily });
      }

      // Set all appliances to OFF baseline so live power starts at 0
      const { data: appliances } = await supabase.from("appliances").select("id");
      if (appliances && appliances.length > 0) {
        await supabase.from("appliance_states").insert(
          appliances.map((a) => ({ appliance_id: a.id, state: "off" }))
        );
      }

      navigate("/appliances");
    } catch (e) {
      console.error(e);
      toast({
        title: "Could not save budget",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const presetBudgets = [1500, 2500, 3500, 5000];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-16 pb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Set Your Monthly Budget
        </h1>
        <p className="text-muted-foreground">
          Enter the maximum amount you want to spend on electricity this month
        </p>
      </div>

      {/* Budget Input */}
      <div className="px-6 flex-1">
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
            <IndianRupee className="w-6 h-6 text-primary" />
          </div>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter amount"
            className="w-full pl-14 pr-4 py-5 text-3xl font-bold rounded-2xl border-2 border-primary/20 bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Preset Amounts */}
        <p className="text-sm text-muted-foreground mb-3">Quick select:</p>
        <div className="grid grid-cols-4 gap-3 mb-8">
          {presetBudgets.map((amount) => (
            <button
              key={amount}
              onClick={() => setBudget(amount.toString())}
              className={`py-3 rounded-xl font-semibold transition-all ${
                budget === amount.toString()
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              ₹{amount.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-info/10 rounded-2xl p-4 border border-info/20">
          <p className="text-sm text-foreground">
            <span className="font-semibold">💡 Tip:</span> Check your last electricity bill to set a realistic budget. Average household spends ₹2,000-4,000/month.
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={handleContinue}
          disabled={!budget || saving}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving..." : "Continue"}
        </button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          You can change this anytime in settings
        </p>
      </div>
    </div>
  );
};

export default BudgetSetup;
