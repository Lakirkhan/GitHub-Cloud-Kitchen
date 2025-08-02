// import { FETCH_MENU_FAILURE, FETCH_MENU_REQUEST, FETCH_MENU_SUCCESS } from "./constant";

const initialState = {
    loading: false,
    menu: [],
    error: null,
}

const menuReducer = (state = initialState, action) => {
    switch (action.type) {
        // case FETCH_MENU_REQUEST:
        //     console.log("Reducer: Fetch menu request initiated");
        //     return {
        //         ...state,
        //         loading: true,
        //     };
        // case FETCH_MENU_SUCCESS:
        //     console.log("Reducer_success", action.payload);
        //     return {
        //         ...state,
        //         loading: false,
        //         menu: action.payload,
        //     };

        // case FETCH_MENU_FAILURE:
        //     return {
        //         ...state,
        //         loading: false,
        //         error: action.payload,
        //     };
        default: return state;
    }
}


export default menuReducer;
