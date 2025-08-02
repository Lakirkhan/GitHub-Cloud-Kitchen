import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const OtpForm = ({ onClose, onVerify, onResend }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      setOtp(pasteData.split(""));
      pasteData.split("").forEach((num, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = num;
        }
      });
      inputRefs.current[5]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }
    console.log("Entered OTP:", enteredOtp);
    onVerify(enteredOtp);
    navigate("/vendor")
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-72 relative">
        <h2 className="text-lg font-semibold">Enter OTP</h2>
        <p className="text-sm text-gray-600 text-center mt-1">
          We have sent a verification code to your Email
        </p>
        <form onSubmit={handleSubmit} className="w-full mt-4">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={otp[index]}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-10 text-center text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>
          <button
            type="submit" 
            className="w-full mt-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            Verify
          </button>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        <p className="text-sm text-gray-600 mt-3 text-center">
          Didn't receive the code?{" "}
          <button
            className="text-blue-500 font-semibold hover:underline"
            onClick={onResend}
          >
            Resend Code
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpForm;
