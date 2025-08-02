import { api, handleApiError } from "./api";

export const fetchAllVendors = async () => {
    try {
        const response = await api.get("/getAllVendor");
        console.log("response for All Vendors:-", response.data);

        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
