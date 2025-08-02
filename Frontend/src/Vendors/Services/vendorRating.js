import { vendorApi, handleApiError } from "../Services/vendorApi";


export const vendorRating = async () => {
    try {
        const response = await vendorApi.get('/fetchRatingByVendor');
        console.log("Response vendor rating:- ", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}
