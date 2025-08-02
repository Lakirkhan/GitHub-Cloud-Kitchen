import { api, handleApiError } from "./api";

export const PopularItemApi = async () => {
    try {
        const response = await api.get("/getPopularItem");
        console.log("response from Popular Item Api for home page :-", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};