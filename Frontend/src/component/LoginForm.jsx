"use client";

import { Mail, Lock, LogIn, User, Briefcase, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import image from "../assets/LoginPage-Banner/02.png";

export default function LoginForm({
  onSubmit,
  isLoading,
  onTabChange,
  activeTab: propActiveTab,
}) {
  const [activeTab, setActiveTab] = useState(propActiveTab || "user");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (propActiveTab && propActiveTab !== activeTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative h-64 w-full md:h-auto md:w-2/5">
            <img
              src={image || "/placeholder.svg"}
              alt="Cloud Kitchen"
              className="h-full w-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white md:p-8">
              <h3 className="text-2xl font-bold">Welcome Back</h3>
              <p className="mt-2 text-sm opacity-90">
                Sign in to access your account
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full p-6 md:w-3/5 md:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
              <p className="mt-2 text-sm text-gray-600">
                Access your account and manage your orders
              </p>
            </div>

            {/* Tab Selector */}
            <div className="mb-6">
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all ${
                    activeTab === "user"
                      ? "bg-[#F5B651] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleTabClick("user")}
                  type="button"
                >
                  <User size={16} /> User
                </button>
                <button
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all ${
                    activeTab === "vendor"
                      ? "bg-[#F5B651] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleTabClick("vendor")}
                  type="button"
                >
                  <Briefcase size={16} /> Vendor
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform ${
                      errors.email ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-lg border px-10 py-2.5 text-gray-700 transition-all focus:border-[#F5B651] focus:outline-none focus:ring-1 focus:ring-[#F5B651] ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform ${
                      errors.password ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-lg border px-10 py-2.5 text-gray-700 transition-all focus:border-[#F5B651] focus:outline-none focus:ring-1 focus:ring-[#F5B651] ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  to={
                    activeTab === "vendor"
                      ? "/vendor-forgot-password"
                      : "/forgot-password"
                  }
                  className="text-sm font-medium text-[#F5B651] hover:text-[#e6a84a] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full rounded-lg bg-[#F5B651] px-5 py-3 font-medium text-white transition-all hover:bg-[#e6a84a] focus:outline-none focus:ring-2 focus:ring-[#F5B651] focus:ring-offset-2 ${
                    isLoading ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <LogIn size={18} className="mr-2" /> Login as{" "}
                      {activeTab === "vendor" ? "Vendor" : "User"}
                    </span>
                  )}
                </button>
              </div>

              {/* Signup Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to={
                      activeTab === "vendor" ? "/vendor-register" : "/register"
                    }
                    className="font-medium text-[#F5B651] hover:text-[#e6a84a] hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
