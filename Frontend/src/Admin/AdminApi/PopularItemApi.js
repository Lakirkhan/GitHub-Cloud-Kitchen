import { api, handleApiError } from "../../services/api";

export const PopularItemApi = async () => {
    try {
        const response = await api.get("/getPopularItem");
        console.log("response from Popular Item Api :-", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};