// import React, { useEffect, useState } from "react";
// import RegistrationForm from "../component/RegistrationForm";
// import { useNavigate } from "react-router-dom";
// import OtpForm from "../component/OtpForm";
// import { sendOtpAndRegisterApi, varifyEmailApi } from "../services/authApi";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { registerRequest } from "../redux/auth/authActions";
// import { selectSuccess } from "../redux/auth/authSelector";

// const Register = () => {
//   const [showOtp, setShowOtp] = useState(false);
//   const [formData, setFormData] = useState(null);
//   const regSuccess = useSelector(selectSuccess);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const onFinish = async (data) => {
//     setFormData(data);
//     try {
//       const response = await sendOtpAndRegisterApi(
//         data.name,
//         data.email,
//         data.mobileNo,
//         data.password
//       );
//       if (response.message === "OTP sent successfully") {
//         setShowOtp(true);
//       } else {
//         console.log(response);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleVerify = (otp) => {
//     console.log("At handle Verify........", formData.email, otp);
//     dispatch(registerRequest(formData.email, otp));
//   };
//   useEffect(() => {
//     if (regSuccess) {
//       toast.success("Email verified And Account created successfully!");
//       setShowOtp(false);
//       navigate("/");
//     }
//   }, [regSuccess]);
//   const handleResendOtp = async () => {
//     try {
//       const response = await sendOtpAndRegisterApi(
//         formData.name,
//         formData.email,
//         formData.mobileNo,
//         formData.password
//       );
//       if (response.message === "OTP sent successfully") {
//         setShowOtp(true);
//       } else {
//         console.log(response);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div>
//       <RegistrationForm onSubmit={onFinish} />
//       {showOtp && (
//         <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <OtpForm
//               onClose={() => setShowOtp(false)}
//               onVerify={handleVerify}
//               onResend={handleResendOtp}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Register;



import { useEffect, useState } from "react";
import RegistrationForm from "../component/RegistrationForm";
import { useNavigate } from "react-router-dom";
import OtpForm from "../component/OtpForm";
import { sendOtpAndRegisterApi } from "../services/authApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { registerRequest } from "../redux/auth/authActions";
import { selectSuccess } from "../redux/auth/authSelector";

const Register = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState(null);
  const regSuccess = useSelector(selectSuccess);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (data) => {
    setFormData(data);
    try {
      const response = await sendOtpAndRegisterApi(
        data.name,
        data.email,
        data.mobileNo,
        data.password
      );
      if (response.message === "OTP sent successfully") {
        setShowOtp(true);
        toast.success("OTP sent successfully. Please check your email.");
      } else {
        toast.error(response.message || "Failed to send OTP");
        console.log(response);
      }
    } catch (error) {
      toast.error(error.message || "Error sending OTP");
      console.log(error);
    }
  };

  const handleVerify = (otp) => {
    console.log("Verifying OTP for:", formData.email, otp);
    dispatch(registerRequest(formData.email, otp));
  };

  useEffect(() => {
    if (regSuccess) {
      toast.success("Email verified and account created successfully!");
      setShowOtp(false);
      navigate("/");
    }
  }, [regSuccess, navigate]);

  const handleResendOtp = async () => {
    try {
      const response = await sendOtpAndRegisterApi(
        formData.name,
        formData.email,
        formData.mobileNo,
        formData.password
      );
      if (response.message === "OTP sent successfully") {
        toast.success("OTP resent successfully");
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.message || "Error resending OTP");
      console.log(error);
    }
  };

  return (
    <div>
      <RegistrationForm onSubmit={onFinish} />
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

export default Register;
