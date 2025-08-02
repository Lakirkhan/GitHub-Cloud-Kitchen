import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  RESETAUTHSTATE,
  VENDOR_REGISTER_REQUEST,
  VENDOR_REGISTER_SUCCESS,
  VENDOR_REGISTER_FAILURE,
} from "./authConstants"

export const registerRequest = (email, otp) => ({
  type: REGISTER_REQUEST,
  payload: {
    email: email,
    verifyOtp: otp,
  },
})

export const registerSuccess = (token, role, id, flag) => ({
  type: REGISTER_SUCCESS,
  payload: { token, role, id, flag },
})

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error,
})

export const loginRequest = (email, password, role) => ({
  type: LOGIN_REQUEST,
  payload: { email: email, password: password, role: role },
})

export const loginSuccess = (token, role, id, flag) => ({
  type: LOGIN_SUCCESS,
  payload: { token, role, id, flag },
})

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
})

export const logout = () => ({ type: LOGOUT })

export const resetAuthState = () => ({ type: RESETAUTHSTATE })

export const vendorRegisterRequest = (email, otp) => ({
  type: VENDOR_REGISTER_REQUEST,
  payload: {
    email: email,
    verifyOtp: otp,
  },
})

export const vendorRegisterSuccess = (token, role, id, flag) => ({
  type: VENDOR_REGISTER_SUCCESS,
  payload: { token, role, id, flag },
})

export const vendorRegisterFailure = (error) => ({
  type: VENDOR_REGISTER_FAILURE,
  payload: error,
})
