import { AlertTriangle, AlertCircle, Info, Bell } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { budgetAlerts } from "@/data/dummyData";

const getAlertIcon = (type: string) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    case "danger":
      return <AlertCircle className="w-5 h-5 text-destructive" />;
    case "info":
    default:
      return <Info className="w-5 h-5 text-info" />;
  }
};

const getAlertStyle = (type: string) => {
  switch (type) {
    case "warning":
      return "alert-warning";
    case "danger":
      return "alert-danger";
    case "info":
    default:
      return "alert-info";
  }
};

const Alerts = () => {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Budget Alerts</h1>
            <p className="page-subtitle">Stay on top of your electricity spending</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Alert Stats */}
        <div className="flex gap-3">
          <div className="flex-1 stat-card text-center py-4">
            <p className="text-2xl font-bold text-warning">
              {budgetAlerts.filter(a => a.type === "warning").length}
            </p>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </div>
          <div className="flex-1 stat-card text-center py-4">
            <p className="text-2xl font-bold text-destructive">
              {budgetAlerts.filter(a => a.type === "danger").length}
            </p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
          <div className="flex-1 stat-card text-center py-4">
            <p className="text-2xl font-bold text-info">
              {budgetAlerts.filter(a => a.type === "info").length}
            </p>
            <p className="text-xs text-muted-foreground">Tips</p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          <h3 className="section-title mb-0">Recent Alerts</h3>

          {budgetAlerts.map((alert) => (
            <div key={alert.id} className={`alert-card ${getAlertStyle(alert.type)}`}>
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-foreground text-sm">{alert.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            Alerts are generated based on your budget and spending patterns
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Alerts;
