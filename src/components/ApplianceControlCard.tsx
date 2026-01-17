import { Appliance } from "@/hooks/useAppliances";

interface ApplianceControlCardProps {
  appliance: Appliance;
  currentState: string;
  onToggle: () => void;
  isLoading?: boolean;
}

const ApplianceControlCard = ({ 
  appliance, 
  currentState, 
  onToggle, 
  isLoading 
}: ApplianceControlCardProps) => {
  const isOn = currentState === "on";

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
          isOn ? "bg-success/20" : "bg-muted"
        }`}>
          <span className="text-2xl">{appliance.icon || "💡"}</span>
        </div>
        <div>
          <p className="font-medium text-foreground">{appliance.name}</p>
          <p className="text-xs text-muted-foreground">
            {appliance.power_rating}W • {isOn ? "Running" : "Off"}
          </p>
        </div>
      </div>
      <div className="gpio-toggle">
        <button
          className={`gpio-toggle-btn on ${isOn ? 'active' : ''}`}
          onClick={() => !isOn && onToggle()}
          disabled={isLoading}
        >
          on
        </button>
        <button
          className={`gpio-toggle-btn off ${!isOn ? 'active' : ''}`}
          onClick={() => isOn && onToggle()}
          disabled={isLoading}
        >
          off
        </button>
      </div>
    </div>
  );
};

export default ApplianceControlCard;
