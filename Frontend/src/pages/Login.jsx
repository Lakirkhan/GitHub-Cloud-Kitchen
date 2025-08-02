import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, resetAuthState } from "../redux/auth/authActions";
import { useNavigate } from "react-router-dom";
import LoginForm from "../component/LoginForm";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const { error, token, loading, role, flag } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user");

  // Function to handle form submission from LoginForm
  const onFinish = (formData) => {
    console.log("Login attempt with tab:", activeTab);

    // Set role based on tab type
    const roleValue = activeTab === "vendor" ? 3 : 2;
    console.log("Using role value:", roleValue);

    dispatch(loginRequest(formData.email, formData.password, roleValue));
  };

  // Listen for tab changes from LoginForm
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle errors
  useEffect(() => {
    if (error) {
      dispatch(resetAuthState());
    }
  }, [error, dispatch]);

  // Handle successful login and navigation
  useEffect(() => {
    if (token) {
      console.log("Login successful. Role:", role, "Flag:", flag);

      // Navigate based on role and flag
      if (role === 2) {
        if (flag === 1) {
          console.log("Navigating to admin dashboard");
          navigate("/admin");
        } else {
          console.log("Navigating to user dashboard");
          navigate("/");
        }
      } else if (role === 3) {
        console.log("Navigating to vendor dashboard");
        navigate("/vendor");
      } else {
        console.log("Navigating to home page");
        navigate("/");
      }

      // Reset auth state after navigation
      dispatch(resetAuthState());
    }
  }, [token, role, flag, dispatch, navigate]);

  return (
    <LoginForm
      onSubmit={onFinish}
      isLoading={loading}
      onTabChange={handleTabChange}
      activeTab={activeTab}
    />
  );
};

export default Login;
