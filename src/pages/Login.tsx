import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy login - navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6">
          <Zap className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">EnergyTrack</h1>
        <p className="text-muted-foreground text-center">
          Smart Electricity Consumption Monitoring
        </p>
      </div>

      {/* Login Form */}
      <div className="px-6 pb-12">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-12 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-sm text-primary font-medium">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn-primary mt-6">
            Sign In
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Don't have an account?{" "}
          <button className="text-primary font-medium">Sign up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
