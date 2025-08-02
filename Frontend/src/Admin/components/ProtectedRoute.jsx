// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ allowedRoles }) => {
//   const roleNum = useSelector((state) => state.auth.role);
//   const flag = useSelector((state) => state.auth.flag);
//   console.log("ProtectedRoute flag:", flag); // Debugging line

//   const role = roleNum === 3 ? "vendor" : flag === 1 ? "admin" : "user";
//     console.log("ProtectedRoute role:", role); // Debugging line

//   if (!allowedRoles.includes(role)) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ allowedRoles }) => {
//   const roleNum = useSelector((state) => state.auth.role);
//   console.log("ProtectedRoute - roleNum:", roleNum); // Debug log

//   const flag = useSelector((state) => state.auth.flag);

//   console.log("ProtectedRoute - roleNum:", roleNum, "flag:", flag); // Debug log

//   // Determine the role string based on roleNum and flag
//   let role;
//   if (roleNum === 3) {
//     role = "vendor";
//   } else if (roleNum === 2) {
//     if (flag === 1) {
//       role = "admin";
//     } else {
//       role = "user";
//     }
//   }

//   console.log("ProtectedRoute - determined role:", role); // Debug log
//   console.log("ProtectedRoute - allowedRoles:", allowedRoles); // Debug log

//   // Check if the current role is in the allowed roles
//   if (!role || !allowedRoles.includes(role)) {
//     console.log("Access denied, redirecting to home"); // Debug log
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const roleNum = useSelector((state) => state.auth.role);
  const flag = useSelector((state) => state.auth.flag);
  const token = useSelector((state) => state.auth.token);

  console.log(
    "ProtectedRoute - roleNum:",
    roleNum,
    "flag:",
    flag,
    "token:",
    token
  ); // Debug log

  // First check if user is authenticated
  if (!token) {
    console.log("No token found, redirecting to login"); // Debug log
    return <Navigate to="/login" replace />;
  }

  // Determine the role string based on roleNum and flag
  let role;
  if (roleNum === 3) {
    role = "vendor";
  } else if (roleNum === 2) {
    if (flag === 1) {
      role = "admin";
    } else {
      role = "user";
    }
  }

  console.log("ProtectedRoute - determined role:", role); // Debug log
  console.log("ProtectedRoute - allowedRoles:", allowedRoles); // Debug log

  // Check if the current role is in the allowed roles
  if (!role || !allowedRoles.includes(role)) {
    console.log("Access denied, redirecting to unauthorized"); // Debug log
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
