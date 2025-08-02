
import { call, put, takeLatest } from "redux-saga/effects"
import { toast } from "react-toastify"
import { REGISTER_REQUEST, LOGIN_REQUEST, VENDOR_REGISTER_REQUEST } from "./authConstants"
import {
  registerSuccess,
  registerFailure,
  loginSuccess,
  loginFailure,
  vendorRegisterSuccess,
  vendorRegisterFailure,
} from "./authActions"
import { loginUserApi, varifyEmailApi, VendorvarifyEmailApi } from "../../services/authApi"

function* registerSaga(action) {
  try {
    console.log("At register saga", action.payload)
    // Call API
    const response = yield call(varifyEmailApi, action.payload)
    console.log("API Response:", response)
    // Ensure role is not undefined
    const token = response.token
    const role = 2 // Default role for regular users is 2
    const flag = 2 // Default flag for regular users is 2
    console.log("Token and Role:", token, role, flag)
    // Store in local storage
    yield call([localStorage, "setItem"], "token", token)
    yield call([localStorage, "setItem"], "role", role)
    yield call([localStorage, "setItem"], "flag", flag)
    // Dispatch success action
    yield put(registerSuccess(token, role, null, flag))
    toast.success("Registration successful")
  } catch (error) {
    const errorMessage = error.message || "Registration failed"
    yield put(registerFailure(errorMessage))
    toast.error(errorMessage)
  }
}

function* vendorregisterSaga(action) {
  try {
    console.log("At vendor register saga", action.payload)
    const response = yield call(VendorvarifyEmailApi, action.payload)
    console.log("API Response vendor:", response)
    const token = response.token
    const role = 3 // Role for vendor is 3
    console.log("token and role", token, role)
    yield call([localStorage, "setItem"], "token", token)
    yield call([localStorage, "setItem"], "role", role)
    yield call([localStorage, "setItem"], "flag", "vendor") // For consistency
    yield put(vendorRegisterSuccess(token, role))
    toast.success("Vendor Registration successful")
  } catch (error) {
    const errorMessage = error.message || "Registration failed"
    yield put(vendorRegisterFailure(errorMessage))
    toast.error(errorMessage)
  }
}

function* loginSaga(action) {
  try {
    console.log("Login saga action:", action.payload) // Debug log
    const response = yield call(loginUserApi, action.payload)
    console.log("Login API response:", response) // Debug log

    const { token, role, id, message } = response

    // Determine flag based on role and message
    let flag
    if (role === 2) {
      // For role 2, check if admin or regular user based on message
      flag = message && message.toLowerCase().includes("admin") ? 1 : 2
    } else if (role === 3) {
      flag = 3 // For vendors, use numeric flag for consistency
    }

    console.log("Determined flag:", flag) // Debug log
    console.log("Login data:", { token, role, id, flag })

    yield call([localStorage, "setItem"], "token", token)
    yield call([localStorage, "setItem"], "role", role)
    yield call([localStorage, "setItem"], "id", id)
    yield call([localStorage, "setItem"], "flag", flag)

    yield put(loginSuccess(token, role, id, flag))
    toast.success("Login successful")
  } catch (error) {
    console.log(error)
    toast.error(error.message || "Login failed")
    yield put(loginFailure(error.message || "Login failed"))
  }
}

export default function* authSaga() {
  yield takeLatest(REGISTER_REQUEST, registerSaga)
  yield takeLatest(LOGIN_REQUEST, loginSaga)
  yield takeLatest(VENDOR_REGISTER_REQUEST, vendorregisterSaga)
}
