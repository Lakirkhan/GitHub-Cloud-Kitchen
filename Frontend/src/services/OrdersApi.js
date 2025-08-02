import { api, handleApiError } from "./api"

export const submitOrderApi = async (orderData) => {
    try {
        const { cartItems, billingInfo, shippingInfo, paymentMethod, totalAmount, status } = orderData

        console.log("Submitting order with data:", {
            cartItems,
            billingInfo,
            shippingInfo,
            paymentMethod,
            item_total: totalAmount,
            status,
        })

        const response = await api.post("/orderHistory", {
            cartItems,
            billingInfo,
            shippingInfo,
            paymentMethod,
            item_total: totalAmount,
            status,
        })

        console.log("Response from submitOrderApi:", response.data)
        return response.data
    } catch (error) {
        handleApiError(error)
        throw error
    }
}



export const fetchOrdersApi = async () => {
    try {
        const response = await api.get("/fechHistoryById")
        console.log("Fetched orders in profile :", response.data)
        return response.data
    } catch (error) {
        handleApiError(error)
        throw error
    }
}