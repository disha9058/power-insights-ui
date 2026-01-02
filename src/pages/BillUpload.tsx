import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, IndianRupee, Zap } from "lucide-react";
import { billData } from "@/data/dummyData";

const BillUpload = () => {
  const [uploaded, setUploaded] = useState(false);
  const navigate = useNavigate();

  const handleUpload = () => {
    setUploaded(true);
  };

  const handleContinue = () => {
    navigate("/appliances");
  };

  const handleSkip = () => {
    navigate("/appliances");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <p className="text-sm text-muted-foreground mb-1">Step 2 of 3</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Upload Previous Bill
        </h1>
        <p className="text-muted-foreground text-sm">
          This helps us estimate your consumption patterns
        </p>
      </div>

      <div className="px-6 flex-1">
        {!uploaded ? (
          /* Upload Area */
          <button
            onClick={handleUpload}
            className="w-full aspect-[4/3] border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="font-semibold text-foreground mb-1">
              Tap to upload bill
            </p>
            <p className="text-sm text-muted-foreground">
              Image or PDF format
            </p>
          </button>
        ) : (
          /* Extracted Details */
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-success/10 rounded-xl border border-success/20">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium text-foreground">Bill uploaded successfully</span>
            </div>

            <div className="stat-card">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Extracted Details</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Billing Period</span>
                  <span className="font-semibold">{billData.billingPeriod}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Total Bill Amount</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    ₹{billData.billAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">Units Consumed</span>
                  </div>
                  <span className="font-semibold">{billData.unitsConsumed} kWh</span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Daily Average</span>
                  <span className="font-semibold">{billData.averageDaily} kWh/day</span>
                </div>
              </div>
            </div>

            <div className="bg-info/10 rounded-xl p-4 border border-info/20">
              <p className="text-sm text-foreground">
                Based on your bill, your average daily cost was <span className="font-bold">₹{Math.round(billData.billAmount / 30)}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="px-6 pb-8 pt-4 space-y-3">
        <button
          onClick={handleContinue}
          className="btn-primary"
        >
          Continue
        </button>
        {!uploaded && (
          <button
            onClick={handleSkip}
            className="w-full py-3 text-muted-foreground font-medium"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
};

export default BillUpload;
