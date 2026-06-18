import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { login } from "@/utils/auth";
import { API_URL } from "@/config/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const emailFromLogin = localStorage.getItem("reset_email");

  const [email, setEmail] = useState(emailFromLogin || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ================= STEP 1 - SEND OTP =================
  const sendOtp = async () => {
    if (!email) {
      toast.error("Email required");
      return;
    }

    setLoading(true);

    const res = await fetch(`${API_URL}/api/admin/send-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    console.log("API response:", data);
    setLoading(false);

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("OTP sent to your email 📩");
    setStep(2);
  };

  // ================= STEP 2 - VERIFY OTP =================
  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    // Instead of verifying separately in backend,
    // we just move to next step.
    // Final verification will happen in reset-password API.
    setStep(3);
  };

  // ================= STEP 3 - UPDATE PASSWORD =================
  const updatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("All fields required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // if (newPassword.length < 6) {
    //   toast.error("Password must be at least 6 characters");
    //   return;
    // }
    // ✅ Strong password validation
    const strongPassword = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPassword.test(newPassword)) {
      toast.error(
        "Password must be at least 8 characters and include letters, numbers & special characters",
      );
      return;
    }

    setLoading(true);

    const res = await fetch(`${API_URL}/api/admin/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        newPassword,
      }),
    });

    const data = await res.json();
    console.log("API Response:", data);

    setLoading(false);

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Password updated successfully 🎉");

    // login(data.user);
    // localStorage.removeItem("reset_email");

    // if (data.user.role === "supplier") {
    //   navigate("/supplier/dashboard");
    // } else {
    //   navigate("/home");
    // }
    navigate("/login", {
      state: { message: "Please login here" },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-2xl border p-8">
        {/* LOGO */}
        <div className="flex items-center justify-center w-full mb-3">
          <div className="relative group cursor-pointer">
            <Link
              to="/"
              className="flex items-center bg-white p-[2px] rounded-[10px]
      shadow-[0_0_30px_10px_rgba(255,255,255,0.8)]"
            >
              <img src="/b2blogo.png" alt="Logo" className="h-20 w-auto" />
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center">Reset Password</h2>
        {/* STEP 1 - EMAIL */}
        {step === 1 && (
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              value={email}
              disabled={!!emailFromLogin}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl"
            />
            <Button
              onClick={sendOtp}
              disabled={loading}
              className="w-full h-12"
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        )}

        {/* STEP 2 - OTP */}
        {step === 2 && (
          <div className="space-y-5">
            <Label>Enter OTP</Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="h-12 rounded-xl"
            />
            <Button onClick={verifyOtp} className="w-full h-12">
              Verify OTP
            </Button>
          </div>
        )}

        {/* STEP 3 - NEW PASSWORD */}
        {step === 3 && (
          <div className="space-y-5">
            {/* NEW PASSWORD */}
            <div>
              <Label>New Password</Label>

              <div className="relative mt-1">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Min 8 chars, include letters, numbers & symbols"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12 rounded-xl pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <Label>Confirm Password</Label>

              <div className="relative mt-1">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Min 8 chars, include letters, numbers & symbols"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-xl pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <Button
              onClick={updatePassword}
              disabled={loading}
              className="w-full h-12"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
