import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginRequest, resetAuthState } from "../../redux/auth/authActions";
import VendorLoginForm from "./VendorLoginForm";

const VendorLogin = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();

  const onFinish = (formData) => {
    dispatch(loginRequest(formData.email, formData.password, 3)); // Role 3 for vendor
    if (token) {
      dispatch(resetAuthState());
      localStorage.setItem("role", 3);
      navigate("/vendor");
    }
  };

  useEffect(() => {
    if (error) {
      dispatch(resetAuthState());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(resetAuthState());
      localStorage.setItem("role", 3);
      navigate("/vendor");
    }
  }, [token, dispatch]);

  return (
    <div>
      <VendorLoginForm onSubmit={onFinish} isLoading={loading} />
    </div>
  );
};

export default VendorLogin;
