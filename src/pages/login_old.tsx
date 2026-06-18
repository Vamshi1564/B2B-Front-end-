import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Zap,
  Handshake,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  Package,
  ChevronDown,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { login } from "@/utils/auth";
import { API_URL } from "@/config/api";
import { toast } from "@/components/ui/sonner";
import launch_banner from "../assets/launch-banner.png";

interface LoginFormProps {
  role: string;
  onLogin: (user: any) => void;
}

const LoginForm = ({ role, onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConnectInfo, setShowConnectInfo] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isEmpty = (value: string) => submitted && !value.trim();

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!email.trim() || !password.trim()) {
      return;
    }

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Invalid credentials");
      return;
    }

    // 🔐 FIRST LOGIN CHECK
    if (data.firstLogin) {
      toast.info("Please change your password before continuing");

      // Store email temporarily for reset page
      localStorage.setItem("reset_email", email);

      navigate("/change-password");
      return;
    }

    // ✅ Normal Login Flow
    login(data.user);
    onLogin(data.user);

    toast.success("Welcome back!");

    if (data.user.role === "supplier") {
      navigate("/supplier/dashboard");
    } else {
      navigate("/home");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-6">
      <div className="space-y-2">
        <Label className="text-white">Email Address</Label>
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // className="h-12 rounded-xl bg-secondary/60 px-4"
          className={`w-full h-11 px-3 rounded-xl border border-black text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
            isEmpty(email)
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-black focus:ring-primary focus:border-primary"
          }`}
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // className="h-12 rounded-xl bg-secondary/60 px-4 pr-12"
            className={`w-full h-11 px-3 rounded-xl border border-black text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
              isEmpty(password)
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-black focus:ring-primary focus:border-primary"
            }`}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            className="text-white accent-primary w-4 h-4 rounded"
          />
          Remember me
        </label>

        <Link
          to="/change-password?forgot=true"
          className="text-white font-medium hover:opacity-80"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full h-12 hover:opacity-90 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl"
        style={{ backgroundColor: "#ff0000" }}
      >
        <span className="text-white font-bold">Sign In</span>
        <ArrowRight className="ml-1 w-4 h-4" />
      </Button>
    </form>
  );
};

const Login = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [playVideo, setPlayVideo] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    agents: 0,
    suppliers: 0,
  });
const [video, setVideo] = useState<any>(null);
  const [openCards, setOpenCards] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/count`);
        const data = await res.json();

        console.log("API RESPONSE:", data); // 👈 check this

        setCounts({
          agents: data.total_agents,
          suppliers: data.total_suppliers,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);
  useEffect(() => {
 fetch(`${API_URL}/api/videos/active`)
  .then(res => res.json())
  .then(data => setVideo(data))
    .catch(err => console.error(err));
}, []);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* <main className="flex-1 relative overflow-hidden "> */}
            <main className="flex-1 relative overflow-hidden bg-background bg-gradient-to-br from-sky-200 via-sky-200 to-sky-200">

        {/* Soft gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10 " >
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-8xl mx-auto">
            {/* LEFT COLUMN */}
            <div className="hidden lg:flex flex-col space-y-10">
              {/* CONTENT BLOCK */}
              <div className="space-y-8 text-foreground">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                    Welcome
                  </p>

                  <h1 className="text-4xl font-bold leading-tight">
                    Your <span className="text-gradient">B2B Partnership</span>{" "}
                    Hub
                  </h1>

                  <p className="mt-4 text-muted-foreground text-lg max-w-md">
                    Access competitive rates, manage deals, and grow your
                    business with our trusted platform.
                  </p>
                </div>
                {/* VIDEO BLOCK */}

                {/* <div className="relative w-full flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl bg-[#FAFAD2] h-[380px]">
                  <div className="text-center text-muted-foreground px-6">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      Launching <span className="text-red-600">April 1st</span>
                    </h2>

                    <p className="text-lg md:text-xl">
                      Something exciting is coming soon 🚀
                    </p>
                  </div>
                </div> */}

                <div className="relative w-full flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl  bg-[#FAFAD2] h-[380px]">

                {video?.video_url ? (
  <video
    src={`${API_URL}${video.video_url}`}
    className="w-full h-full object-cover"
    controls
    autoPlay
    muted
    loop
  />
) : (
                  <div className="text-center text-muted-foreground px-6">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      Launching <span className="text-red-600">April 1st</span>
                    </h2>

                    <p className="text-lg md:text-xl">
                      Something exciting is coming soon 🚀
                    </p>
                  </div>
                )}

              </div>
              </div>

              {/* FEATURES */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    icon: Handshake,
                    label: "Connect",
                    description:
                      "Connect with verified suppliers and agents to build trusted partnerships.",
                  },
                  {
                    icon: Zap,
                    label: "Communicate",
                    description:
                      "Communicate instantly with partners to negotiate deals and manage bookings.",
                  },
                  {
                    icon: Shield,
                    label: "Convert",
                    description:
                      "Convert opportunities into successful bookings and grow your business.",
                  },
                ].map(({ icon: Icon, label, description }) => (
                  <div
                    key={label}
                    className="relative text-center"
                    onMouseEnter={() => setActiveTooltip(label)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <div className="cursor-pointer bg-gradient-to-r from-[#0F1F5C] via-[#1F3F93] to-[#0F1F5C] border rounded-2xl p-5 shadow-lg hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <p className="font-semibold text-white">{label}</p>
                    </div>

                    {/* Tooltip */}
                    <div
                      className={`
        absolute top-full mt-3 left-1/2 -translate-x-1/2
        w-64 bg-white border shadow-xl rounded-xl p-4 text-sm text-white-600 z-20
        transition-all duration-300
        ${
          activeTooltip === label
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        }
      `}
                    >
                      <p className="font-semibold text-gray-900 mb-1">
                        {label}
                      </p>
                      <p>{description}</p>

                      {/* Arrow */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t rotate-45"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* STATS */}
              <div className="flex gap-12 pt-4">
                {[
                  { value: "500+", label: "Partners" },
                  { value: "50K+", label: "Transactions" },
                  { value: "99.9%", label: "Uptime" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-3xl font-extrabold text-primary">
                      {value}
                    </p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              {/* </div> */}
            </div>
            {/* LOGIN CARD */}
            {/* <div className="max-w-md w-full max-w-8xl lg:ml-auto mt-2"> */}
            <div className="w-full max-w-2xl lg:ml-auto mt-3">
              <div className="bg-card  rounded-2xl shadow-2xl border p-8 bg-gradient-to-r from-[#0F1F5C] via-[#1F3F93] to-[#0F1F5C]">
                <h2 className="text-2xl font-bold mb-1 text-white">Sign In</h2>
                <p className="text-sm text-white mb-6">
                  Choose your account type to continue
                </p>

                <Tabs defaultValue="agent">
                  <TabsList className="w-full bg-muted rounded-xl p-1 flex gap-1">
                    <TabsTrigger
                      value="agent"
                      className="
  flex-1 rounded-xl py-2.5 text-sm font-semibold
  text-muted-foreground
  transition-all
  data-[state=active]:bg-[#B8960B]
  data-[state=active]:text-primary-foreground
  data-[state=active]:shadow-lg
"
                    >
                      Agent
                    </TabsTrigger>

                    <TabsTrigger
                      value="supplier"
                      className="
  flex-1 rounded-xl py-2.5 text-sm font-semibold
  text-muted-foreground
  transition-all
  data-[state=active]:bg-[#B8960B]
  data-[state=active]:text-primary-foreground
  data-[state=active]:shadow-lg
"
                    >
                      Supplier
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="agent">
                    <LoginForm role="agent" onLogin={onLogin} />
                  </TabsContent>

                  <TabsContent value="supplier">
                    <LoginForm role="supplier" onLogin={onLogin} />
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-white">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-[#ff0000] font-bold hover:opacity-80"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-5">
                {[
                  { icon: Users, label: "Agents Registered", count: counts.agents },
                  {
                    icon: Package,
                    label: "Suppliers Registered",
                    count: counts.suppliers,
                  },
                ].map(({ icon: Icon, label, count }) => {
                  const isOpen = openCards[label];

                  return (
                    <div
                      key={label}
                      className="bg-gradient-to-r from-[#0F1F5C] via-[#1F3F93] to-[#0F1F5C] border rounded-2xl p-5 shadow-lg text-center hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center gap-3"
                    >
                      {/* Icon */}
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Animated Content */}
                   <div className="flex flex-col items-center overflow-hidden">
  {/* Label */}
  <div
    className={`transition-all duration-300 ${
      isOpen ? "opacity-0 h-0" : "opacity-100 h-6"
    }`}
    onClick={() =>
      setOpenCards((prev) => ({
        ...prev,
        [label]: !prev[label],
      }))
    }
  >
    <div className="flex items-center gap-2 cursor-pointer">
      <p className="font-semibold text-white">{label}</p>
      <ChevronDown
        className="w-5 h-5 text-white hover:text-gray-200 transition-transform duration-300"
      />
    </div>
  </div>

  {/* Count */}
  <div
    className={`transition-all duration-300 ${
      isOpen ? "opacity-100 h-6" : "opacity-0 h-0"
    }`}
    onClick={() =>
      setOpenCards((prev) => ({
        ...prev,
        [label]: !prev[label],
      }))
    }
  >
    <div className="flex items-center gap-2 cursor-pointer">
      <p className="font-bold text-white">
        {count} {label}
      </p>
      <ChevronDown
        className="w-5 h-5 rotate-180 text-white hover:text-gray-200 transition-transform duration-300"
      />
    </div>
  </div>
</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
