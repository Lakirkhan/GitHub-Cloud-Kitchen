import { vendorApi, handleApiError } from "../Services/vendorApi";

export const venderFetchMenu = async (vendor_id) => {
    console.log("Fetching menu for vendor:", vendor_id);

    try {
        const response = await vendorApi.get(`/fetchItemByVendorId/${vendor_id}`);
        console.log("Response for vendor menu in panel:", response.data);
        let menuItems;
        let length = 0;

        if (Array.isArray(response.data)) {
            menuItems = response.data;
            length = menuItems.length;
        } else if (Array.isArray(response.data.items)) {
            menuItems = response.data.items;
            length = menuItems.length;
        } else if (typeof response.data === 'object') {
            menuItems = response.data;
            length = Object.keys(menuItems).length;
        }

        console.log("Menu length:", length);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const venderAddMenuItem = async (formData) => {
    try {
        console.log("addMenuItemApi received FormData:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
        }
        const active = formData.get("status") === "Available" ? "true" : "false";
        formData.append("active", active);

        formData.delete("status");

        console.log("formData at addMenuItemApi:", formData);

        const response = await vendorApi.post("/uploadItem", formData);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};



export const vendorOrder = async (vendor_id) => {
    try {
        const response = await vendorApi.get(`/totalOrder/${vendor_id}`);
        console.log("Response for vendor order in panel:", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}


export const vendorRevenue = async (vendor_id) => {
    try {
        const response = await vendorApi.get(`/totalRevenue/${vendor_id}`);
        console.log("Response for vendor revenue in panel:", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}


export const vendorTodayRevenue = async (vendor_id) => {
    try{
        const response=await vendorApi.get(`/getTodayRevenue/${vendor_id}`);
        console.log("Response for vendor today revenue in panel:", response.data);
        return response.data;
        }catch(error){
        handleApiError(error);
        throw error;
        }
    }
