import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IndianRupee, Wallet } from "lucide-react";

const BudgetSetup = () => {
  const [budget, setBudget] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (budget) {
      navigate("/bill-upload");
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
          disabled={!budget}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          You can change this anytime in settings
        </p>
      </div>
    </div>
  );
};

export default BudgetSetup;
