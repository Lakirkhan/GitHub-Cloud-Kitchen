import { api, handleApiError } from "./api";

export const fetchCategories = async () => {
    try {
        const response = await api.get("/fetchCategory");
        console.log("response:-", response.data);

        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const fetchItemsByCategoryIdApi = async (id) => {
    try {
        const response = await api.post("/fetchItemById", { id });
        console.log("fetchItemsByCategoryIdApi response:-", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
