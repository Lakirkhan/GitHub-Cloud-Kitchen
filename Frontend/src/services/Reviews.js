import { api, handleApiError } from "./api"

export const RatingApi = async (menu_id, rating) => {
    try {
        const response = await api.post("/rating", { menu_id, rating })
        return response.data
    } catch (error) {
        handleApiError(error)
        throw error
    }
}



export const getRatingApi = async ({ menu_id }) => {
    try {
        // Ensure the API request includes menu_id as a query parameter or in the body
        const response = await api.get(`/fetchRatingById/${menu_id}`); // Pass menu_id as a query parameter
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};


