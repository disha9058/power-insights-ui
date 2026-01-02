import { AlertTriangle, Info, AlertCircle, Bell, Trash2 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { alerts } from "@/data/dummyData";

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
            <h1 className="page-title">Alerts</h1>
            <p className="page-subtitle">Stay informed about your energy usage</p>
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
            <p className="text-2xl font-bold text-warning">{alerts.filter(a => a.type === "warning").length}</p>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </div>
          <div className="flex-1 stat-card text-center py-4">
            <p className="text-2xl font-bold text-destructive">{alerts.filter(a => a.type === "danger").length}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
          <div className="flex-1 stat-card text-center py-4">
            <p className="text-2xl font-bold text-info">{alerts.filter(a => a.type === "info").length}</p>
            <p className="text-xs text-muted-foreground">Info</p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="section-title mb-0">Recent Alerts</h3>
            <button className="text-sm text-muted-foreground flex items-center gap-1">
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          </div>

          {alerts.map((alert) => (
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

        {/* Alert Settings Info */}
        <div className="stat-card">
          <h3 className="section-title">Alert Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">High usage threshold</span>
              <span className="text-sm font-medium">2.0 kW</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Peak hour alerts</span>
              <span className="text-sm font-medium text-success">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly report</span>
              <span className="text-sm font-medium text-success">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Alerts;
