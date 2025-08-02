
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Shield,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify"; // Import react-toastify
import CheckIcon from "@mui/icons-material/Check"; // Keep CheckIcon for consistency

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("approved");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const location = useLocation();

  // Fetch approved vendors
  const fetchApprovedVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_baseUrl}/getAllVendor`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("Approved Vendors Data:", response.data);

      if (response.data.status === "success") {
        setVendors(response.data.vendors || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch vendors");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError(error.message || "An error occurred while fetching vendors");
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending vendors
  const fetchPendingVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_baseUrl}/pendingVendor`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      if (response.data.status === "success") {
        setPendingVendors(response.data.vendors || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch pending vendors");
      }
    } catch (error) {
      console.error("Error fetching pending vendors:", error);
      setError(error.message || "An error occurred while fetching pending vendors");
    } finally {
      setLoading(false);
    }
  };

  // Handle vendor approval/rejection
  const handleVendorAction = async (vendor, action) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      console.log("Vendor Object:", vendor);
      const actionUrl = `${import.meta.env.VITE_baseUrl}/approveVendor`;
      console.log("Vendor Action URL:", actionUrl);

      const response = await axios.post(
        actionUrl,
        {
          vendor_id: vendor.id,
          action: action, // 'approved' or 'rejected'
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("Vendor Action Response:", response.data);

      if (response.data.status === "success") {
        // Immediately remove from pending vendors
        setPendingVendors((prev) =>
          prev.filter((v) => v.id !== vendor.id)
        );

        // If approved, add to approved vendors immediately
        if (action === "approved") {
          const updatedVendor = response.data.vendor || {
            ...vendor,
            status: "approved",
          };
          setVendors((prev) => [...prev, updatedVendor]);
        }

        toast.success(
          <div className="flex items-center gap-2">
            <CheckIcon fontSize="small" />
            Vendor {vendor.name} {action} successfully
          </div>,
          {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
      } else {
        throw new Error(
          response.data.message || `Failed to ${action} vendor ${vendor.name}`
        );
      }
    } catch (error) {
      console.error(`Error ${action} vendor:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to ${action} vendor ${vendor.name}`;
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleDeleteClick = (vendor) => {
    setVendorToDelete(vendor);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const deleteUrl = `${import.meta.env.VITE_baseUrl}/vendorDelete/${
        vendorToDelete.id
      }`;
      console.log("Delete Request URL:", deleteUrl);

      const response = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      console.log("Delete Vendor Response:", response.data);
      if (response.data.status === "success") {
        setVendors((prev) =>
          prev.filter((v) => v.id !== vendorToDelete.id)
        );
        toast.success(
          <div className="flex items-center gap-2">
            <CheckIcon fontSize="small" />
            Vendor {vendorToDelete.name} deleted successfully
          </div>,
          {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
      } else {
        throw new Error(
          response.data.message || `Failed to delete vendor ${vendorToDelete.name}`
        );
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to delete vendor ${vendorToDelete.name}`;
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setVendorToDelete(null);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${import.meta.env.VITE_baseUrl}${
      imagePath.startsWith("/") ? "" : "/"
    }${imagePath}`;
  };

  // Fetch data on mount and route change
  useEffect(() => {
    fetchApprovedVendors();
    fetchPendingVendors();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-gray-500 font-medium">Loading vendors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              fetchApprovedVendors();
              fetchPendingVendors();
            }}
            className="px-4 py-2 bg-white border border-red-300 rounded-md text-red-600 hover:bg-red-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vendor Management
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Manage your approved vendors and review pending vendor applications
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex p-1 bg-gray-100 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 border ${
                activeTab === "approved"
                  ? "bg-white text-gray-800 border-gray-300 shadow-sm"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Building2 className="h-4 w-4 text-green-500" />
              Approved Vendors
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === "pending"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              ⏳ Pending Vendors
              {pendingVendors.length > 0 && (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  {pendingVendors.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Approved Vendors */}
        {activeTab === "approved" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vendors.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No approved vendors found</p>
              </div>
            ) : (
              vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md hover:translate-y-[-2px] flex"
                >
                  {/* Vendor Image (Left Side) */}
                  <div className="w-1/3 bg-gray-100">
                    <img
                      src={getImageUrl(vendor.image)}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Vendor Details (Right Side) */}
                  <div className="w-2/3 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {vendor.name}
                        </h3>
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium mt-1">
                          <Shield className="h-3 w-3" />
                          <span>Verified Vendor</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDeleteClick(vendor)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="flex items-start gap-2 text-gray-600">
                        <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm overflow-hidden text-ellipsis">
                          {vendor.email}
                        </p>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{vendor.mobileNo}</p>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {vendor.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pending Vendors */}
        {activeTab === "pending" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingVendors.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No pending vendors found</p>
              </div>
            ) : (
              pendingVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md flex"
                >
                  {/* Pending Vendor Image (Left Side) */}
                  <div className="w-1/3 bg-gray-100">
                    <img
                      src={getImageUrl(vendor.image)}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Pending Vendor Details (Right Side) */}
                  <div className="w-2/3 p-4">
                    <div className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium mb-2">
                      Pending Approval
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {vendor.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-gray-600">
                        <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm overflow-hidden text-ellipsis">
                          {vendor.email}
                        </p>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{vendor.mobileNo}</p>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {vendor.address}
                        </p>
                      </div>
                    </div>

                    {/* Approval/Rejection Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleVendorAction(vendor, "approved")}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleVendorAction(vendor, "rejected")}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Delete
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">
                  Are you sure you want to delete{" "}
                  <span className="font-medium">{vendorToDelete?.name}</span>?
                  This action cannot be undone.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Vendor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
