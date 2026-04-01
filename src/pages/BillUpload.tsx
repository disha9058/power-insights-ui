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

      <div className="px-6 flex-1" />

      {/* Buttons */}
      <div className="px-6 pb-8 pt-4 space-y-3">
        <button
          onClick={handleSkip}
          className="btn-primary"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default BillUpload;
