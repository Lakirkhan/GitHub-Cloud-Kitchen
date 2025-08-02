import { useState } from "react";

import { Mail } from "lucide-react";
import {
  resetPasswordApi,
  sendVerificationCodeApi,
  varifyEmailApi,
  verifyOtpForForgotPasswordApi,
} from "../services/authApi";
import OtpForm from "../component/OtpForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [password, setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await sendVerificationCodeApi(email);
      setMessage(data.message);
      setShowOtp(true);
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    }
  };
  const handleVerify = async (otp) => {
    try {
      const response = await verifyOtpForForgotPasswordApi(email, otp);
      console.log("Response at Forgot password otp varify:", response);
      if (response.status === "success") {
        setShowOtp(false);
        setShowPasswordFields(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== cnfPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
    try {
      const response = await resetPasswordApi(email, password);
      if (response.status === "success") {
        setShowPasswordFields(false);
        toast.success("Password reset successfully.Redirecting to Login");
        navigate("/login");
      }
      console.log(response);
    } catch (error) {
      setMessage(error.message || "Failed to reset password");
    }
  };
  return (
    <div className="w-full flex min-h-screen items-center justify-center bg-gray-100 p-6 capitalize">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          {!showPasswordFields ? "Forgot Password" : "Reset Password"}
        </h2>
        {!showPasswordFields ? (
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border p-3 pl-10 rounded-lg focus:border-[#F5B651] focus:outline-none"
              />
            </div>
            <button className="w-full p-3 bg-[#F5B651] text-white font-semibold rounded-lg hover:bg-[#e6a84a]">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border p-3 rounded-lg focus:border-[#F5B651] focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirm Password"
                value={cnfPassword}
                onChange={(e) => {
                  setCnfPassword(e.target.value);
                  if (password !== e.target.value) {
                    setPasswordError("Passwords do not match");
                  } else {
                    setPasswordError("");
                  }
                }}
                required
                className="w-full border p-3 rounded-lg focus:border-[#F5B651] focus:outline-none"
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <button className="w-full p-3 bg-[#F5B651] text-white font-semibold rounded-lg hover:bg-[#e6a84a]">
              Reset Password
            </button>
          </form>
        )}
        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
      </div>
      {showOtp && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <OtpForm
              onClose={() => setShowOtp(false)}
              onVerify={handleVerify}
              onResend={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
