import { api, handleApiError } from "./api";

export const registerUserApi = async (user) => {
  try {
    const response = await api.post("/register", user);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
export const loginUserApi = async (user) => {
  try {
    const response = await api.post("/login", user);
    console.log('====================================');
    console.log(response.data);
    console.log('====================================');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const sendVerificationCodeApi = async (email) => {
  try {
    const response = await api.post("/sendVerificationCode", { email });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const sendVerificationCodeVendorApi = async (email) => {
  try {
    const response = await api.post("/vendorSendVerificationCode", { email });
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
export const verifyOtpForForgotPasswordApi = async (
  email,
  verificationCode
) => {
  try {
    const response = await api.post("/verifyCode", { email, verificationCode });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const verifyOtpForForgotPasswordVendorApi = async (
  email,
  verificationCode
) => {
  try {
    const response = await api.post("/vendorVerifyCode", { email, verificationCode });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const resetPasswordApi = async (email, newPassword) => {
  try {
    const response = await api.post("/savePassword", { email, newPassword });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const resetPasswordVendorApi = async (email, newPassword) => {
  try {
    const response = await api.post("/vendorSavePassword", { email, newPassword });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const sendOtpAndRegisterApi = async (
  name,
  email,
  mobileNo,
  password,
  role = 2
) => {
  try {
    const response = await api.post("/sendOtp", {
      name,
      email,
      mobileNo,
      password,
      role
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// export const sendOtpAndVendorRegisterApi = async (
//   name,
//   email,
//   mobileNo,
//   address,
//   password,
//   image
// ) => {
//   try {
//     const response = await api.post("/vendorSendOtp", {
//       name,
//       email,
//       mobileNo,
//       address,
//       password,
//       image
//     });
//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };

export const sendOtpAndVendorRegisterApi = async (name, email, mobileNo, address, password, image) => {
  try {
    // Create a FormData object to handle file upload
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("mobileNo", mobileNo)
    formData.append("address", address)
    formData.append("password", password)
    formData.append("image", image) // Append the file object directly

    const response = await api.post("/vendorSendOtp", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    })
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}


export const VendorvarifyEmailApi = async (credential) => {
  try {
    const response = await api.post("/vendorVerifyOtp", credential);
    console.log("VendorvarifyEmailApi:- ",response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};



export const varifyEmailApi = async (credential) => {
  try {
    const response = await api.post("/verifyOtp", credential);
    console.log("varifyEmailApi:- ",response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const checkEmailExistsApi = async (email) => {
  try {
    const response = await api.post("/verifyEmail", { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
