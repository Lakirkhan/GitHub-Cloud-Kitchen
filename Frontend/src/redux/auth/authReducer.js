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

const initialState = {
  token: localStorage.getItem("token") || null,
  role: Number.parseInt(localStorage.getItem("role")) || null,
  flag: Number.parseInt(localStorage.getItem("flag")) || null,
  id: localStorage.getItem("id") || null,
  loading: false,
  error: null,
  success: false,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case VENDOR_REGISTER_REQUEST:
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
      console.log("LOGIN-Register Request AT Reducer: Initiated")
      console.log(action.payload)

      return { ...state, loading: true, error: null, success: false }

    case VENDOR_REGISTER_SUCCESS:
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token)
      localStorage.setItem("role", action.payload.role)
      localStorage.setItem("flag", action.payload.flag)

      if (action.payload.id) {
        localStorage.setItem("id", action.payload.id)
      }

      console.log("====================================")
      console.log("LOGIN-Register Request AT Reducer: Success", action.payload)
      console.log("====================================")

      return {
        ...state,
        token: action.payload.token,
        role: Number.parseInt(action.payload.role),
        flag: Number.parseInt(action.payload.flag) || action.payload.flag,
        id: action.payload.id,
        loading: false,
        error: null,
        success: true,
      }

    case VENDOR_REGISTER_FAILURE:
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
      console.log("LOGIN-Register Request AT Reducer: Failed")
      return { ...state, loading: false, error: action.payload, success: false }

    case LOGOUT:
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      localStorage.removeItem("flag")
      localStorage.removeItem("id")
      return { ...state, token: null, role: null, flag: null, id: null, loading: false, error: null, success: false }

    case RESETAUTHSTATE:
      return {
        ...state,
        success: false,
        error: null,
      }

    default:
      return state
  }
}

export default authReducer
