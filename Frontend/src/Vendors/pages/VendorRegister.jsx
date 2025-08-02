// VendorRegister.jsx


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import {
  // checkEmailExistsApi,
  sendOtpAndVendorRegisterApi,
} from "../../services/authApi";

import { vendorRegisterRequest } from "../../redux/auth/authActions";
import VendorRegistrationForm from "../../component/VendorsRegistrationForm";
import OtpForm from "../../component/OtpForm";

const VendorRegister = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (data) => {
    setFormData(data);
    console.log("Submitting vendor data:", data);

    try {
      const response = await sendOtpAndVendorRegisterApi(
        data.name,
        data.email,
        data.mobileNo,
        data.address,
        data.password,
        data.image
      );

      if (response.message === "OTP sent successfully") {
        setShowOtp(true);
        toast.success("OTP sent successfully. Please check your email.",{
          position:"top-center",
          autoClose: 1000,
        });
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.message || "Error during registration");
      console.error("Error during vendor registration:", error);
    }
  };

  const handleVerify = (otp) => {
    if (!formData) return;
    console.log("Verifying vendor OTP:", formData.email, otp);
    dispatch(vendorRegisterRequest(formData.email, otp));
  };

  const handleResendOtp = async () => {
    if (!formData) {
      toast.error("Form data not available. Please fill the form first.");
      return;
    }

    try {
      const response = await sendOtpAndVendorRegisterApi(
        formData.name,
        formData.email,
        formData.mobileNo,
        formData.address,
        formData.password,
        formData.image
      );

      if (response.message === "OTP sent successfully") {
        toast.success("OTP resent successfully");
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Error resending OTP");
      console.error(error);
    }
  };

  return (
    <div>
      <VendorRegistrationForm
        onSubmit={onFinish}
        isSubmitting={false}
      />

      {showOtp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <OtpForm
              onClose={() => setShowOtp(false)}
              onVerify={handleVerify}
              onResend={handleResendOtp}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRegister;
