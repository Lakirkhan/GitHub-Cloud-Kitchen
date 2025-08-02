import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./reducer";
import createSagaMiddleware from "redux-saga";
import authReducer from "./auth/authReducer";
import authSaga from "./auth/authSaga";
import { all } from "redux-saga/effects";
// import cartReducer  from "./Cart/Cart_reducer";
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    menu: menuReducer,
    auth: authReducer,
    // cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

function* rootsaga() {
  yield all([authSaga()]);
}
sagaMiddleware.run(rootsaga);
export default store;
