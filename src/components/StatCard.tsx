import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  iconColor?: string;
}

const StatCard = ({ icon: Icon, label, value, unit, iconColor = "text-primary" }: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 ${iconColor} mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="stat-value">
        {value}
        {unit && <span className="text-lg font-medium text-muted-foreground ml-1">{unit}</span>}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatCard;
