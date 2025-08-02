import { api, handleApiError } from "./api"

export const fetchMenu = async () => {
    try {
        const response = await api.get("/fetchItem");
        return response.data;

    } catch (error) {
        handleApiError(error);
        throw error;
    }
}
