import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Check } from "lucide-react";
import { appliancesList } from "@/data/dummyData";

const Appliances = () => {
  const [selectedAppliances, setSelectedAppliances] = useState<number[]>([]);
  const [applianceCount, setApplianceCount] = useState("");
  const navigate = useNavigate();

  const toggleAppliance = (id: number) => {
    setSelectedAppliances((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigate("/dashboard");
  };

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
        {/* Appliance Count */}
        <div className="stat-card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Total Appliances</p>
              <p className="text-xs text-muted-foreground">Approximate number at home</p>
            </div>
          </div>
          <input
            type="number"
            value={applianceCount}
            onChange={(e) => setApplianceCount(e.target.value)}
            placeholder="e.g., 15"
            className="input-field text-center text-xl font-bold"
          />
        </div>

        {/* Appliance Checklist */}
        <h3 className="section-title">Common Appliances</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select the ones you use regularly
        </p>

        <div className="grid grid-cols-2 gap-3">
          {appliancesList.map((appliance) => {
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
                  <span className="text-2xl">{appliance.icon}</span>
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
                  ~{appliance.typical}W
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-background via-background to-transparent">
        <button
          onClick={handleContinue}
          className="btn-primary"
        >
          Start Tracking
        </button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          {selectedAppliances.length} appliances selected
        </p>
      </div>
    </div>
  );
};

export default Appliances;
