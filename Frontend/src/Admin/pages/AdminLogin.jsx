import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLoginForm from "./AdminLoginForm";
import { loginRequest, resetAuthState } from "../../redux/auth/authActions";
const AdminLogin = () => {
  const dispatch = useDispatch();
  const { error, token, loading, flag } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const onFinish = (formData) => {
    dispatch(loginRequest(formData.email, formData.password, 1)); 
  };

  useEffect(() => {
    if (error) {
      dispatch(resetAuthState());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(resetAuthState());
      if (flag === "admin") {
        navigate("/admin"); // Redirect admin
      } else if (flag === "vendor") {
        navigate("/vendor"); // Redirect vendor
      } else {
        navigate("/"); // Redirect user
      }
    }
  }, [token, flag, dispatch, navigate]);

  return <AdminLoginForm onSubmit={onFinish} isLoading={loading} />;
};

export default AdminLogin;
