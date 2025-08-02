import { vendorApi, handleApiError } from "../Services/vendorApi";


export const vendorPopularItem = async (vendor_id) => {
    try {
        const response = await vendorApi.get(`/fetchPopularItemByVendor/${vendor_id}`);
        console.log("Response vendor Popular item:- ", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}

export const vendorProfile = async (vendor_id) => {
    try {
        const response = await vendorApi.get(`getVendorById/${vendor_id}`);
        console.log("Response vendor Profile:- ", response.data);
        return response.data;
    }
    catch {
        handleApiError(error);
        throw error;
    }
}

export const UpdateProfileVendorApi = async (name, mobileNo, address, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("mobileNo", mobileNo);
        formData.append("address", address);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        const response = await vendorApi.post("/vendorUpdateProfile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("response for profile Vendor :-", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
