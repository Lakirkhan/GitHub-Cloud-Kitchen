import { api, handleApiError } from "./api"

export const addAddressapi = async (recipient_name, phone, address, city, state, pincode) => {
    try {
        const response = await api.post("/addAddress", {
            recipient_name,
            phone,
            address,
            city,
            state,
            pincode,
        })
        console.log("Response from address API:", response.data)
        return response.data
    } catch (error) {
        handleApiError(error)
        throw error
    }
}

export const getAddressapi = async () => {
    try {
        const response = await api.get("/getAddressDetailById")
        console.log("Fetched addresses:", response.data)
        return response.data
    } catch (error) {
        handleApiError(error)
        throw error
    }
}

export const updateAddressapi = async (address) => {
    try {
        const { id, recipient_name, phone, address: addressLine, city, state, pincode } = address
        const response = await api.post("/updateAddress", {
            id,
            recipient_name,
            phone,
            address: addressLine,
            city,
            state,
            pincode,
        })
        console.log("Response from update address API:", response.data)
        return response.data
    } catch (error) {
        handleApiError(error)
        throw error
    }
}

