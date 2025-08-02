import { api, handleApiError } from "./api";

export const addToCartApi = async (item, quantity = 1) => {
    try {
        const response = await api.post("/addtoCart", { item_id: item.id, item_qty: quantity });
        console.log("response from cart :-", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const getcartItemsApi = async () => {
    try {
        const response = await api.get("/cartItems");
        console.log("get cart data printing :-", response.data);
        return response.data;
    } catch (error) {
        console.log("API OF THE GET CRAT ITEMS",error);
        handleApiError(error);
        throw error;
    }
};

export const updateCartQuantityApi = async (itemId, quantity) => {
    try {
        const response = await api.post(`/updateCartQuantity`, { item_id: itemId, item_qty: quantity });
        console.log("API response from updateCartQuantityApi :-", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const clearcartApi = async () => {
    try {
        const response = await api.delete("/clearCart");
        console.log("API response from clearcartApi :-", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};