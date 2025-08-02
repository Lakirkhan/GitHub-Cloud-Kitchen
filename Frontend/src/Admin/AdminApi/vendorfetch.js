import { api, handleApiError } from "../../services/api";

export const fetchVendors = async () => {
    try {
        const response = await api.get("/getAllVendor");
        console.log("Response from fetchVendors:", response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        handleApiError(error);
    }
}
