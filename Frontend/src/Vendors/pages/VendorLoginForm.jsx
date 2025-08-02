import { Mail, Lock, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VendorLoginForm({ onSubmit, isLoading }) {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
    Navigate("/vendor")
    toast.success("Login successful", { autoClose: 1000 });

    // if (!isSubmitting) {
    //   navigate("/vendor");
    // }
  };

  return (
    <div className="w-full flex items-center justify-center mt-25 ">
      <div className="w-full max-w-md rounded-2xl -mt-18 ">
        {/* <h2 className="mb-4 text-center text-2xl font-bold text-gray-700">
          Vendor Login
        </h2> */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 p-3 pl-10 text-gray-700 focus:border-[#F5B651] focus:outline-none"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 p-3 pl-10 text-gray-700 focus:border-[#F5B651] focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>

          <p className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-[#F5B651] hover:underline"
            >
              Forgot Password?
            </Link>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full rounded-lg ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F5B651] hover:bg-[#e6a84a]"
            } p-3 text-white font-semibold flex items-center justify-center gap-2`}
          >
            {isLoading ? "Loading..." : <LogIn size={18} />} Login as Vendor
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Register as Vendor?{" "}
          <Link
            to="/vendor-register"
            className="text-[#F5B651] font-semibold hover:underline"
          >
            SignUp
          </Link>
        </p>
      </div>
    </div>
  );
}
