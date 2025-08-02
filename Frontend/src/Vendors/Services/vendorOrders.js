import { api,handleApiError } from "../../services/api";

export const fetchVendorOrders=async(vendorId)=>{
    try{
        const response= await api.get(`/orderHistoryByVendorId/${vendorId}`);
        console.log("Response for order history vendor:- ",response.data)
        return response.data;
    }
    catch(error){
        console.log("Error fetching vendor orders:", error);
        handleApiError(error);
    }
}