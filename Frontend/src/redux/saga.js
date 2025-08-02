// import { fetchMenuFailure, fetchMenuSuccess } from "./actions";
// import { FETCH_MENU_FAILURE, FETCH_MENU_REQUEST, FETCH_MENU_SUCCESS } from "./constant";
// import { call, put, takeLatest } from "redux-saga/effects"

// function* fetchMenu() {
//     try {
//         const response = yield call(fetch, "192.168.28.18:7000/fetchItem");
//         const data = yield response.json();
//         console.log("data in saga:-", data.item);
//         yield put(fetchMenuSuccess(data.items));
//     } catch (error) {
//         yield put(fetchMenuFailure(error));
//     }
// }

// export default function* menuSaga() {
//     yield takeLatest(FETCH_MENU_REQUEST, fetchMenu);
// }
