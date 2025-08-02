import { api, handleApiError } from "./api";


export const UserProfileApi = async () => {
    try {
        const response = await api.get("/getUserById");
        console.log("response for profile :-", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};


export const UpdateProfileApi = async (name,mobileNo ) => {
    try {
        const response = await api.post("/updateProfile",{name:name,mobileNo:mobileNo});
        console.log("response for profile :-", response.data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};