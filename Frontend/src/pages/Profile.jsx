
// import { useState, useEffect } from "react";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   CreditCard,
//   ChevronDown,
//   ChevronUp,
//   ShoppingBag,
// } from "lucide-react";
// import Button from "../Admin/components/Button";
// import { PageHeader } from "../Admin/components/PageHeader";
// import { Card, CardContent, CardHeader } from "../Admin/components/Card";
// import FormField from "../component/Checkout/FormField";
// import { fetchOrdersApi } from "../services/OrdersApi";
// import { UpdateProfileApi, UserProfileApi } from "../services/ProfileUserAPi";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export function Profile() {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState({});
//   const [profileLoading, setProfileLoading] = useState(true);
//   const [profileError, setProfileError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState("");
//   const [mobileNo, setMobileNo] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [expandedOrders, setExpandedOrders] = useState({});

//   // Fetch profile data
//   useEffect(() => {
//     const fetchProfile = async () => {
//       setProfileLoading(true);
//       try {
//         const response = await UserProfileApi();
//         if (response.status === "success" && response.user) {
//           setProfile({
//             id: response.user.id,
//             name: response.user.name,
//             email: response.user.email,
//             phone: response.user.mobileNo,
//             role: response.user.role,
//             address: response.user.address || "Not provided",
//             createdAt: response.user.createdAt,
//           });
//           setName(response.user.name || "");
//           setMobileNo(response.user.mobileNo || "");
//         } else {
//           setProfileError("Failed to load profile data");
//           setProfile({});
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         setProfileError("Error loading profile data");
//         setProfile({});
//       } finally {
//         setProfileLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // Fetch order history
//   useEffect(() => {
//     const fetchHistory = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchOrdersApi();
//         if (response.status === "success") {
//           const parsedOrders = response.history.map((order) => ({
//             ...order,
//             billingInfo:
//               typeof order.billingInfo === "string"
//                 ? JSON.parse(order.billingInfo)
//                 : order.billingInfo,
//             shippingInfo:
//               typeof order.shippingInfo === "string"
//                 ? JSON.parse(order.shippingInfo)
//                 : order.shippingInfo,
//             cartItems:
//               typeof order.cartItems === "string"
//                 ? JSON.parse(order.cartItems)
//                 : order.cartItems,
//           }));
//           setOrders(parsedOrders);
//         } else {
//           setOrders([]);
//         }
//       } catch (err) {
//         console.error("Error fetching orders:", err.message);
//         setError(err.message);
//       }
//       setLoading(false);
//     };

//     fetchHistory();
//   }, []);

//   // Handle profile update
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsEditing(false);
//     setProfileLoading(true);

//     try {
//       const response = await UpdateProfileApi(name, mobileNo);
//       setProfile((prev) => ({
//         ...prev,
//         name: name,
//         phone: mobileNo,
//       }));
//       alert("Profile updated successfully");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       setProfileError("Failed to update profile");
//       alert("Failed to update profile");
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   // Handle cancel order
//   const cancelOrder = async (orderId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No authentication token found. Please log in.");
//       }

//       const response = await axios.post(
//         `${import.meta.env.VITE_baseUrl}/cancelOrder`,
//         { orderId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.status === "success") {
//         // Refresh order list
//         const updatedOrders = orders.map((order) =>
//           order.id === orderId ? { ...order, status: "cancelled" } : order
//         );
//         setOrders(updatedOrders);
//         alert(`Order #${orderId} has been cancelled`);
//       } else {
//         throw new Error(response.data.message || "Failed to cancel order");
//       }
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//       alert(error.message || "Failed to cancel order");
//     }
//   };

//   const handleCancel = () => {
//     setName(profile.name || "");
//     setMobileNo(profile.phone || "");
//     setIsEditing(false);
//   };

//   const toggleOrderExpand = (orderId) => {
//     setExpandedOrders((prev) => ({
//       ...prev,
//       [orderId]: !prev[orderId],
//     }));
//   };

//   // Helper function to get status badge color
//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "processing":
//         return "bg-blue-100 text-blue-800";
//       case "shipped":
//         return "bg-purple-100 text-purple-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       case "pending":
//       default:
//         return "bg-yellow-100 text-yellow-800";
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
//       <PageHeader
//         title="My Profile"
//         description="Manage your account information and view your order history"
//         className="mb-8"
//       >
//         {!isEditing ? (
//           <Button
//             variant="primary"
//             onClick={() => {
//               setIsEditing(true);
//               setName(profile.name || "");
//               setMobileNo(profile.phone || "");
//             }}
//           >
//             Edit Profile
//           </Button>
//         ) : (
//           <div className="flex gap-2">
//             <Button variant="secondary" onClick={handleCancel}>
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={handleSubmit}
//               disabled={profileLoading}
//             >
//               {profileLoading ? (
//                 <>
//                   <span className="mr-2">Saving</span>
//                   <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
//                 </>
//               ) : (
//                 "Save Changes"
//               )}
//             </Button>
//           </div>
//         )}
//       </PageHeader>

//       <div className="grid gap-6 md:grid-cols-3">
//         {/* Profile Card */}
//         <Card className="md:col-span-1 bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
//           <CardContent className="flex flex-col items-center py-8 px-4">
//             {profileLoading ? (
//               <div className="flex justify-center items-center h-64 w-full">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
//               </div>
//             ) : profileError ? (
//               <div className="flex flex-col items-center justify-center h-64 w-full p-4 text-center">
//                 <div className="text-red-500 mb-4">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-12 w-12 mx-auto"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                     />
//                   </svg>
//                 </div>
//                 <p className="text-gray-700">{profileError}</p>
//                 <Button
//                   variant="secondary"
//                   className="mt-4"
//                   onClick={() => window.location.reload()}
//                 >
//                   Retry
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {profile.name}
//                 </h2>
//                 <p className="text-gray-500 mt-1 mb-4">Customer</p>
//                 <div className="w-full mt-4 space-y-5 px-2">
//                   <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
//                     <Mail className="h-5 w-5 text-blue-500" />
//                     <span className="text-gray-700">{profile.email}</span>
//                   </div>
//                   <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
//                     <Phone className="h-5 w-5 text-green-500" />
//                     <span className="text-gray-700">{profile.phone}</span>
//                   </div>
//                   <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
//                     <MapPin className="h-5 w-5 text-red-500" />
//                     <span className="text-gray-700">{profile.address}</span>
//                   </div>
//                   {profile.createdAt && (
//                     <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
//                       <Calendar className="h-5 w-5 text-purple-500" />
//                       <span className="text-gray-700">
//                         Member since:{" "}
//                         {new Date(profile.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         {/* Profile Details Card */}
//         <Card className="md:col-span-2 bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
//           <CardHeader className="border-b border-gray-100 bg-gray-50 py-4">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Profile Information
//             </h3>
//           </CardHeader>
//           <CardContent>
//             {profileLoading ? (
//               <div className="animate-pulse p-6 space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
//                     <div className="h-6 bg-gray-200 rounded w-3/4"></div>
//                   </div>
//                   <div>
//                     <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
//                     <div className="h-6 bg-gray-200 rounded w-3/4"></div>
//                   </div>
//                   <div>
//                     <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
//                     <div className="h-6 bg-gray-200 rounded w-3/4"></div>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
//                   <div className="h-6 bg-gray-200 rounded w-full"></div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {isEditing ? (
//                   <form>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <FormField
//                         label="Name"
//                         name="name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                       />
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">
//                           Email
//                         </label>
//                         <p className="mt-1">{profile.email}</p>
//                       </div>
//                       <FormField
//                         label="Phone"
//                         name="phone"
//                         value={mobileNo}
//                         onChange={(e) => setMobileNo(e.target.value)}
//                       />
//                     </div>
//                   </form>
//                 ) : (
//                   <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-500">
//                           Name
//                         </h4>
//                         <p className="mt-1">{profile.name}</p>
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-500">
//                           Email
//                         </h4>
//                         <p className="mt-1">{profile.email}</p>
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-500">
//                           Phone
//                         </h4>
//                         <p className="mt-1">{profile.phone}</p>
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-500">
//                         Address
//                       </h4>
//                       <p className="mt-1">{profile.address}</p>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Order History Section */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
//           Order History
//         </h2>

//         {loading ? (
//           <div className="flex justify-center items-center h-40">
//             <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600"></div>
//           </div>
//         ) : error ? (
//           <Card className="bg-white shadow-sm">
//             <CardContent className="p-6">
//               <div className="text-red-500 flex items-center justify-center p-4">
//                 <p>Error loading orders: {error}</p>
//               </div>
//             </CardContent>
//           </Card>
//         ) : orders.length > 0 ? (
//           <div className="space-y-4">
//             {orders.map((order) => (
//               <Card
//                 key={order.id}
//                 className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
//               >
//                 <div
//                   className="p-5 border-b cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
//                   onClick={() => toggleOrderExpand(order.id)}
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="flex-shrink-0">
//                       <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-full shadow-sm">
//                         <ShoppingBag className="h-6 w-6 text-blue-600" />
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-lg text-gray-800">
//                         Order #{order.id}
//                       </h3>
//                       <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
//                         <div className="flex items-center">
//                           <Calendar className="h-4 w-4 mr-1 text-blue-500" />
//                           <span>
//                             {new Date(order.order_date).toLocaleDateString()}
//                           </span>
//                         </div>
//                         <div className="flex items-center">
//                           <CreditCard className="h-4 w-4 mr-1 text-green-500" />
//                           <span>
//                             {order.paymentMethod === "cod"
//                               ? "Cash on Delivery"
//                               : order.paymentMethod}
//                           </span>
//                         </div>
//                         <div>
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                               order.status
//                             )}`}
//                           >
//                             {order.status.charAt(0).toUpperCase() +
//                               order.status.slice(1)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <span className="font-bold text-lg text-gray-800">
//                       ₹{order.item_total.toFixed(2)}
//                     </span>
//                     {expandedOrders[order.id] ? (
//                       <ChevronUp className="h-5 w-5 ml-3 text-blue-500" />
//                     ) : (
//                       <ChevronDown className="h-5 w-5 ml-3 text-blue-500" />
//                     )}
//                   </div>
//                 </div>

//                 {expandedOrders[order.id] && (
//                   <div className="p-5 bg-gray-50 border-t border-gray-100 animate-fadeIn">
//                     <div className="grid md:grid-cols-2 gap-8">
//                       <div className="bg-white p-4 rounded-lg shadow-sm">
//                         <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b">
//                           Order Items
//                         </h4>
//                         <div className="space-y-4">
//                           {order.cartItems.map((item) => (
//                             <div
//                               key={item.id}
//                               className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//                             >
//                               <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
//                                 <img
//                                   src={`${import.meta.env.VITE_baseUrl}${
//                                     item.item_image
//                                   }`}
//                                   alt={item.item_name}
//                                   className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
//                                   onError={(e) => {
//                                     e.target.src =
//                                       "https://via.placeholder.com/80?text=Image+Not+Found";
//                                   }}
//                                 />
//                               </div>
//                               <div className="flex-1">
//                                 <h5 className="font-semibold text-gray-800">
//                                   {item.item_name}
//                                 </h5>
//                                 <div className="flex justify-between text-sm text-gray-600 mt-1">
//                                   <span className="bg-gray-100 px-2 py-1 rounded-md">
//                                     Qty: {item.item_qty}
//                                   </span>
//                                   <span className="font-medium">
//                                     ₹{item.item_price.toFixed(2)}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                         <div className="mt-4 pt-3 border-t">
//                           <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
//                             <span className="font-semibold text-gray-800">
//                               Total
//                             </span>
//                             <span className="font-bold text-lg text-blue-600">
//                               ₹{order.item_total.toFixed(2)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <div className="mb-6">
//                           <h4 className="font-semibold text-gray-800 mb-3">
//                             Shipping Information
//                           </h4>
//                           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//                             {order.shippingInfo && (
//                               <>
//                                 <p className="font-semibold text-gray-800">
//                                   {order.shippingInfo.recipient_name}
//                                 </p>
//                                 <p className="text-gray-600 mt-2">
//                                   {order.shippingInfo.address}
//                                 </p>
//                                 <p className="text-gray-600">
//                                   {order.shippingInfo.city},{" "}
//                                   {order.shippingInfo.state}{" "}
//                                   {order.shippingInfo.pincode}
//                                 </p>
//                                 <div className="mt-3 pt-3 border-t border-gray-100">
//                                   <p className="text-gray-600 flex items-center">
//                                     <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-500 mr-2">
//                                       📱
//                                     </span>
//                                     {order.shippingInfo.phone}
//                                   </p>
//                                   <p className="text-gray-600 flex items-center mt-2">
//                                     <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-500 mr-2">
//                                       ✉️
//                                     </span>
//                                     {order.shippingInfo.email}
//                                   </p>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         </div>

//                         <div>
//                           <h4 className="font-semibold text-gray-800 mb-3">
//                             Order Timeline
//                           </h4>
//                           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//                             <div className="space-y-4">
//                               <div className="flex items-start">
//                                 <div className="relative">
//                                   <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 mt-1 z-10"></div>
//                                   <div className="absolute top-5 bottom-0 left-2.5 w-0.5 bg-gray-200 -ml-px h-full"></div>
//                                 </div>
//                                 <div className="ml-4">
//                                   <p className="font-semibold text-gray-800">
//                                     Order Placed
//                                   </p>
//                                   <p className="text-sm text-gray-500">
//                                     {new Date(order.createdAt).toLocaleString()}
//                                   </p>
//                                 </div>
//                               </div>
//                               <div className="flex items-start">
//                                 <div className="relative">
//                                   <div
//                                     className={`flex-shrink-0 h-5 w-5 rounded-full ${
//                                       order.status !== "pending" &&
//                                       order.status !== "cancelled"
//                                         ? "bg-green-500"
//                                         : order.status === "cancelled"
//                                         ? "bg-red-500"
//                                         : "bg-gray-300"
//                                     } mt-1 z-10`}
//                                   ></div>
//                                   <div className="absolute top-5 bottom-0 left-2.5 w-0.5 bg-gray-200 -ml-px h-full"></div>
//                                 </div>
//                                 <div className="ml-4">
//                                   <p className="font-semibold text-gray-800">
//                                     Order Processing
//                                   </p>
//                                   <p className="text-sm text-gray-500">
//                                     {order.status === "cancelled"
//                                       ? "Cancelled"
//                                       : order.status !== "pending"
//                                       ? "Completed"
//                                       : "Pending"}
//                                   </p>
//                                 </div>
//                               </div>
//                               <div className="flex items-start">
//                                 <div>
//                                   <div
//                                     className={`flex-shrink-0 h-5 w-5 rounded-full ${
//                                       order.status === "completed"
//                                         ? "bg-green-500"
//                                         : order.status === "cancelled"
//                                         ? "bg-red-500"
//                                         : "bg-gray-300"
//                                     } mt-1`}
//                                   ></div>
//                                 </div>
//                                 <div className="ml-4">
//                                   <p className="font-semibold text-gray-800">
//                                     Order Completed
//                                   </p>
//                                   <p className="text-sm text-gray-500">
//                                     {order.status === "completed"
//                                       ? "Delivered"
//                                       : order.status === "cancelled"
//                                       ? "Cancelled"
//                                       : "Pending"}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Cancel Order Button */}
//                         {order.status !== "cancelled" &&
//                           order.status !== "completed" && (
//                             <div className="mt-6">
//                               <Button
//                                 variant="secondary"
//                                 className="bg-red-100 text-red-800 hover:bg-red-200"
//                                 onClick={() => cancelOrder(order.id)}
//                               >
//                                 Cancel Order
//                               </Button>
//                             </div>
//                           )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <Card className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
//             <CardContent className="p-8">
//               <div className="text-center py-10">
//                 <div className="bg-gray-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <ShoppingBag className="h-12 w-12 text-gray-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                   No orders yet
//                 </h3>
//                 <p className="text-gray-500 max-w-md mx-auto mb-6">
//                   When you place an order, it will appear here with all the
//                   details.
//                 </p>
//                 <Button
//                   variant="primary"
//                   className="mt-2 px-6 py-2 shadow-md hover:shadow-lg transition-shadow duration-300"
//                   onClick={() => navigate("/menu")}
//                 >
//                   Order Now
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Profile;



import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";
import Button from "../Admin/components/Button";
import { PageHeader } from "../Admin/components/PageHeader";
import { Card, CardContent, CardHeader } from "../Admin/components/Card";
import FormField from "../component/Checkout/FormField";
import { fetchOrdersApi } from "../services/OrdersApi";
import { UpdateProfileApi, UserProfileApi } from "../services/ProfileUserAPi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
} from "@mui/material";

export function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const response = await UserProfileApi();
        if (response.status === "success" && response.user) {
          setProfile({
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            phone: response.user.mobileNo,
            role: response.user.role,
            address: response.user.address || "Not provided",
            createdAt: response.user.createdAt,
          });
          setName(response.user.name || "");
          setMobileNo(response.user.mobileNo || "");
        } else {
          setProfileError("Failed to load profile data");
          setProfile({});
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileError("Error loading profile data");
        setProfile({});
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch order history
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await fetchOrdersApi();
        if (response.status === "success") {
          const parsedOrders = response.history.map((order) => ({
            ...order,
            billingInfo:
              typeof order.billingInfo === "string"
                ? JSON.parse(order.billingInfo)
                : order.billingInfo,
            shippingInfo:
              typeof order.shippingInfo === "string"
                ? JSON.parse(order.shippingInfo)
                : order.shippingInfo,
            cartItems:
              typeof order.cartItems === "string"
                ? JSON.parse(order.cartItems)
                : order.cartItems,
          }));
          setOrders(parsedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err.message);
        setError(err.message);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    setProfileLoading(true);

    try {
      await UpdateProfileApi(name, mobileNo);
      setProfile((prev) => ({
        ...prev,
        name: name,
        phone: mobileNo,
      }));
      toast.success("Profile updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileError("Failed to update profile");
      toast.error("Failed to update profile", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Open cancel modal
  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setShowCancelModal(true);
  };

  // Handle cancel order
  const cancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.warn("Cancellation reason is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (cancelReason.trim().length < 5) {
      toast.warn("Reason must be at least 5 characters long", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_baseUrl}/cancelOrder`,
        { orderId: selectedOrderId, cancel_reason: cancelReason.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        // Update local orders state
        const updatedOrders = orders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: "cancelled" } : order
        );
        setOrders(updatedOrders);
        setShowCancelModal(false);
        toast.success(`Order #${selectedOrderId} has been cancelled`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        throw new Error(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      let errorMessage = error.message || "Failed to cancel order";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleCancel = () => {
    setName(profile.name || "");
    setMobileNo(profile.phone || "");
    setIsEditing(false);
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <PageHeader
        title="My Profile"
        description="Manage your account information and view your order history"
        className="mb-8"
      >
        {!isEditing ? (
          <Button
            variant="primary"
            onClick={() => {
              setIsEditing(true);
              setName(profile.name || "");
              setMobileNo(profile.phone || "");
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={profileLoading}
            >
              {profileLoading ? (
                <>
                  <span className="mr-2">Saving</span>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="flex flex-col items-center py-8 px-4">
            {profileLoading ? (
              <div className="flex justify-center items-center h-64 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              </div>
            ) : profileError ? (
              <div className="flex flex-col items-center justify-center h-64 w-full p-4 text-center">
                <div className="text-red-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">{profileError}</p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-gray-500 mt-1 mb-4">Customer</p>
                <div className="w-full mt-4 space-y-5 px-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <Phone className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <span className="text-gray-700">{profile.address}</span>
                  </div>
                  {profile.createdAt && (
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      <span className="text-gray-700">
                        Member since:{" "}
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="md:col-span-2 bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="border-b border-gray-100 bg-gray-50 py-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Profile Information
            </h3>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <div className="animate-pulse p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ) : (
              <>
                {isEditing ? (
                  <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Email
                        </label>
                        <p className="mt-1">{profile.email}</p>
                      </div>
                      <FormField
                        label="Phone"
                        name="phone"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                      />
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Name
                        </h4>
                        <p className="mt-1">{profile.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Email
                        </h4>
                        <p className="mt-1">{profile.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Phone
                        </h4>
                        <p className="mt-1">{profile.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Address
                      </h4>
                      <p className="mt-1">{profile.address}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order History Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Order History
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : error ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="text-red-500 flex items-center justify-center p-4">
                <p>Error loading orders: {error}</p>
              </div>
            </CardContent>
          </Card>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="p-5 border-b cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleOrderExpand(order.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-full shadow-sm">
                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        Order #{order.id}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                          <span>
                            {new Date(order.order_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1 text-green-500" />
                          <span>
                            {order.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : order.paymentMethod}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-lg text-gray-800">
                      ₹{order.item_total.toFixed(2)}
                    </span>
                    {expandedOrders[order.id] ? (
                      <ChevronUp className="h-5 w-5 ml-3 text-blue-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 ml-3 text-blue-500" />
                    )}
                  </div>
                </div>

                {expandedOrders[order.id] && (
                  <div className="p-5 bg-gray-50 border-t border-gray-100 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b">
                          Order Items
                        </h4>
                        <div className="space-y-4">
                          {order.cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                              <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                                <img
                                  src={`${import.meta.env.VITE_baseUrl}${
                                    item.item_image
                                  }`}
                                  alt={item.item_name}
                                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/80?text=Image+Not+Found";
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-800">
                                  {item.item_name}
                                </h5>
                                <div className="flex justify-between text-sm text-gray-600 mt-1">
                                  <span className="bg-gray-100 px-2 py-1 rounded-md">
                                    Qty: {item.item_qty}
                                  </span>
                                  <span className="font-medium">
                                    ₹{item.item_price.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t">
                          <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                            <span className="font-semibold text-gray-800">
                              Total
                            </span>
                            <span className="font-bold text-lg text-blue-600">
                              ₹{order.item_total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Shipping Information
                          </h4>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            {order.shippingInfo && (
                              <>
                                <p className="font-semibold text-gray-800">
                                  {order.shippingInfo.recipient_name}
                                </p>
                                <p className="text-gray-600 mt-2">
                                  {order.shippingInfo.address}
                                </p>
                                <p className="text-gray-600">
                                  {order.shippingInfo.city},{" "}
                                  {order.shippingInfo.state}{" "}
                                  {order.shippingInfo.pincode}
                                </p>
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-gray-600 flex items-center">
                                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-500 mr-2">
                                      📱
                                    </span>
                                    {order.shippingInfo.phone}
                                  </p>
                                  <p className="text-gray-600 flex items-center mt-2">
                                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-500 mr-2">
                                      ✉️
                                    </span>
                                    {order.shippingInfo.email}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Order Timeline
                          </h4>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="space-y-4">
                              <div className="flex items-start">
                                <div className="relative">
                                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 mt-1 z-10"></div>
                                  <div className="absolute top-5 bottom-0 left-2.5 w-0.5 bg-gray-200 -ml-px h-full"></div>
                                </div>
                                <div className="ml-4">
                                  <p className="font-semibold text-gray-800">
                                    Order Placed
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div className="relative">
                                  <div
                                    className={`flex-shrink-0 h-5 w-5 rounded-full ${
                                      order.status !== "pending" &&
                                      order.status !== "cancelled"
                                        ? "bg-green-500"
                                        : order.status === "cancelled"
                                        ? "bg-red-500"
                                        : "bg-gray-300"
                                    } mt-1 z-10`}
                                  ></div>
                                  <div className="absolute top-5 bottom-0 left-2.5 w-0.5 bg-gray-200 -ml-px h-full"></div>
                                </div>
                                <div className="ml-4">
                                  <p className="font-semibold text-gray-800">
                                    Order Processing
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {order.status === "cancelled"
                                      ? "Cancelled"
                                      : order.status !== "pending"
                                      ? "Completed"
                                      : "Pending"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <div>
                                  <div
                                    className={`flex-shrink-0 h-5 w-5 rounded-full ${
                                      order.status === "completed"
                                        ? "bg-green-500"
                                        : order.status === "cancelled"
                                        ? "bg-red-500"
                                        : "bg-gray-300"
                                    } mt-1`}
                                  ></div>
                                </div>
                                <div className="ml-4">
                                  <p className="font-semibold text-gray-800">
                                    Order Completed
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {order.status === "completed"
                                      ? "Delivered"
                                      : order.status === "cancelled"
                                      ? "Cancelled"
                                      : "Pending"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cancel Order Button */}
                        {order.status !== "cancelled" &&
                          order.status !== "completed" && (
                            <div className="mt-6">
                              <Button
                                variant="secondary"
                                className="bg-red-100 text-red-800 hover:bg-red-200"
                                onClick={() => openCancelModal(order.id)}
                                aria-label={`Cancel order ${order.id}`}
                              >
                                Cancel Order
                              </Button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            <CardContent className="p-8">
              <div className="text-center py-10">
                <div className="bg-gray-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  When you place an order, it will appear here with all the
                  details.
                </p>
                <Button
                  variant="primary"
                  className="mt-2 px-6 py-2 shadow-md hover:shadow-lg transition-shadow duration-300"
                  onClick={() => navigate("/menu")}
                >
                  Order Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cancel Order Modal */}
      <Dialog
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Order #{selectedOrderId}</DialogTitle>
        <DialogContent>
          <p className="text-gray-600 mb-4">
            Please provide a reason for cancelling this order.
          </p>
          <TextareaAutosize
            minRows={4}
            placeholder="Enter cancellation reason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Cancellation reason"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="secondary"
            onClick={() => setShowCancelModal(false)}
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={cancelOrder}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
}

export default Profile;
