"use client";

import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Upload,
  MapPin,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import zxcvbn from "zxcvbn";
import { debounce } from "lodash";
import image from "../assets/LoginPage-Banner/03.png";

export default function VendorRegistrationForm({
  onSubmit,
  isSubmitting,
  checkEmailExists,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobileNo: "",
      password: "",
      cnfPassword: "",
      address: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      cnfPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      mobileNo: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Invalid mobile number")
        .required("Mobile number is required"),
      address: Yup.string().required("Address is required"),
      image: Yup.mixed().required("Profile image is required"),
    }),
    onSubmit: async (values) => {
      if (emailError) {
        toast.error(emailError);
        return;
      }

      try {
        await onSubmit({
          name: values.name,
          email: values.email,
          mobileNo: values.mobileNo,
          address: values.address,
          password: values.password,
          image: values.image,
        });
      } catch (error) {
        toast.error("Registration failed. Please try again.");
      }
    },
  });

  // Check if email exists when email field changes
  useEffect(() => {
    if (!checkEmailExists) return;

    const debouncedCheck = debounce(async () => {
      if (formik.values.email && formik.values.email.includes("@")) {
        try {
          const data = await checkEmailExists(formik.values.email);
          setEmailError(
            data.message === "Email Is Valid" ? "" : "Email is already in use"
          );
        } catch (error) {
          setEmailError(error.message || "Something went wrong");
        }
      }
    }, 500);

    debouncedCheck();
    return () => debouncedCheck.cancel();
  }, [formik.values.email, checkEmailExists]);

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
              <h3 className="text-2xl font-bold">Join Our Network</h3>
              <p className="mt-2 text-sm opacity-90">
                Register as a vendor and grow your business with us
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full p-6 md:w-3/5 md:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Vendor Registration
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Create your vendor account and start selling
              </p>
            </div>

            <form
              onSubmit={formik.handleSubmit}
              noValidate
              className="space-y-5"
            >
              <div className="grid gap-5 md:grid-cols-2">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform ${
                        formik.touched.name && formik.errors.name
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your name "
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-lg border px-10 py-2.5 text-gray-700 transition-all focus:border-[#F5B651] focus:outline-none focus:ring-1 focus:ring-[#F5B651] ${
                        formik.touched.name && formik.errors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

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
                        (formik.touched.email && formik.errors.email) ||
                        emailError
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-lg border px-10 py-2.5 text-gray-700 transition-all focus:border-[#F5B651] focus:outline-none focus:ring-1 focus:ring-[#F5B651] ${
                        (formik.touched.email && formik.errors.email) ||
                        emailError
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.email}
                    </p>
                  )}
                  {emailError && (
                    <p className="mt-1 text-xs text-red-500">{emailError}</p>
                  )}
                </div>

                {/* Mobile Number Field */}
                <div>
                  <label
                    htmlFor="mobileNo"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone
                      className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform ${
                        formik.touched.mobileNo && formik.errors.mobileNo
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      id="mobileNo"
                      type="tel"
                      name="mobileNo"
                      placeholder="Enter the mobile number"
                      value={formik.values.mobileNo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-lg border px-10 py-2.5 text-gray-700 transition-all focus:border-[#F5B651] focus:outline-none focus:ring-1 focus:ring-[#F5B651] ${
                        formik.touched.mobileNo && formik.errors.mobileNo
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formik.touched.mobileNo && formik.errors.mobileNo && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.mobileNo}
                    </p>
                  )}
                </div>

                {/* Address Field */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="relative">
                    <MapPin
                      className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform ${
                        formik.touched.address && formik.errors.address
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      id="address"
                      type="text"
                      name="address"
                      placeholder="Your business address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-lg border px-10 py-2.5 text-gray-700 transition-all focus:border-[#F5B651] focus:outline-none focus:ring-1 focus:ring-[#F5B651] ${
                        formik.touched.address && formik.errors.address
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formik.touched.address && formik.errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
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
                        formik.touched.password && formik.errors.password
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      id="password"
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formik.values.password}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setPasswordStrength(zxcvbn(e.target.value).score);
                      }}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-lg border px-10 py-2.5 text-gray-700 transition-all focus:border-[#F5B651] focus:outline-none focus:ring-1 focus:ring-[#F5B651] ${
                        formik.touched.password && formik.errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                    >
                      {passwordVisible ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.password}
                    </p>
                  )}
                  {formik.touched.password && formik.values.password && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            passwordStrength < 2
                              ? "bg-red-500"
                              : passwordStrength < 4
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${(passwordStrength + 1) * 20}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        Password strength:{" "}
                        <span
                          className={`font-medium ${
                            passwordStrength < 2
                              ? "text-red-500"
                              : passwordStrength < 4
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {
                            [
                              "Very Weak",
                              "Weak",
                              "Medium",
                              "Strong",
                              "Very Strong",
                            ][passwordStrength]
                          }
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="cnfPassword"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform ${
                        formik.touched.cnfPassword && formik.errors.cnfPassword
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      id="cnfPassword"
                      type="password"
                      name="cnfPassword"
                      placeholder="••••••••"
                      value={formik.values.cnfPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-lg border px-10 py-2.5 text-gray-700 transition-all focus:border-[#F5B651] focus:outline-none focus:ring-1 focus:ring-[#F5B651] ${
                        formik.touched.cnfPassword && formik.errors.cnfPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formik.touched.cnfPassword && formik.errors.cnfPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.cnfPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Image Upload Field */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Profile Image
                </label>
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Profile Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="flex cursor-pointer flex-col items-center rounded-lg border border-dashed border-gray-300 bg-white px-4 py-4 text-center transition hover:bg-gray-50">
                      <Upload className="mb-2 h-6 w-6 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {imagePreview
                          ? "Change profile image"
                          : "Upload profile image"}
                      </span>
                      <span className="mt-1 text-xs text-gray-500">
                        JPG, PNG or GIF (Max 2MB)
                      </span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        onBlur={formik.handleBlur}
                      />
                    </label>
                    {formik.touched.image && formik.errors.image && (
                      <p className="mt-1 text-xs text-red-500">
                        {formik.errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full rounded-lg bg-[#F5B651] px-5 py-3 font-medium text-white transition-all hover:bg-[#e6a84a] focus:outline-none focus:ring-2 focus:ring-[#F5B651] focus:ring-offset-2 ${
                    isSubmitting ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {isSubmitting ? (
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
                      <User size={18} className="mr-2" /> Register as Vendor
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#F5B651] hover:text-[#e6a84a] hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
