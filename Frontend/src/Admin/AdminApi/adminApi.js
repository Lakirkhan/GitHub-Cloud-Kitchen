import { api, handleApiError } from "../../services/api";

export const fetchMenuItems = async (page = 1, limit = 6, filters = {}) => {
    try {
        const response = await api.get(`/fetchItemPagination`, { params: { page, limit, ...filters } });
        return response.data;
    } catch (error) {
        console.log(error);
        handleApiError(error);
    }
}

export const addMenuItemApi = async (formData) => {
    try {
        console.log("addMenuItemApi received FormData:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
        }
        const active = formData.get("status") === "Available" ? "true" : "false";
        formData.append("active", active);

        formData.delete("status");

        console.log("formData at addMenuItemApi:", formData);

        const response = await api.post("/uploadItem", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return response.data;
    } catch (error) {
        console.log("Error in addMenuItemApi:", error);
        handleApiError(error);
    }
};

export const updateMenuItemApi = async (formData) => {
    try {
        console.log("updateMenuItemApi received FormData:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
        }
        const active = formData.get("status") === "Available" ? "true" : "false";
        formData.append("active", active);
        formData.delete("status");
        const response = await api.post("/updateItem", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return response.data;
    } catch (error) {
        console.log("❌ Error in updateMenuItemApi:", error);
        handleApiError(error);
    }
};


export const fetchCategoryApi = async () => {
    try {
        const response = await api.get("/fetchCategory");
        return response.data;
    } catch (error) {
        console.log(error);
        handleApiError(error);
    }
}


export const deleteMenuItemApi = async (itemId) => {
    try {
        const response = await api.delete(`/deleteItem/${itemId}`);
        console.log("deleteMenuItemApi response:", response.data);
        return response.data;
    } catch (error) {
        console.log("�� Error in deleteMenuItemApi:", error);
        handleApiError(error);
    }
};
