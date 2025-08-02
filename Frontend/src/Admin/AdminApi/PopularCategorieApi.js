import { api, handleApiError } from "../../services/api";

export const PopularCategoriesApi = async () => {
    try {
        const response = await api.get("/getPopularCategory");
        console.log("response from Popular Category Api :-", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};