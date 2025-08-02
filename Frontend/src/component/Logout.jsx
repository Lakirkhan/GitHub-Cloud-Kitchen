import { useDispatch } from "react-redux";
import { logout } from "../redux/auth/authActions";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";


const Logout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logout());
    }, [dispatch]);

    return <Navigate to="/login" replace />;
};

export default Logout;
