import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { fetchVendorOrders } from "../../Services/vendorOrders";
import { useSelector } from "react-redux";
import { Filter, Plus, Eye } from "lucide-react";
import "./order.css";

export function Orders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showDropdown, setShowDropdown] = useState(null);

  const vendorId = useSelector((state) => state.auth.id);
  console.log("Vendor ID from Redux:", vendorId);

  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetchVendorOrders(vendorId)
      .then((response) => {
        console.log("Response for order history vendor:- ", response.data);
        setOrders(response.data);
      })
      .catch((error) => {
        console.log("Error fetching vendor orders:", error);
        handleApiError(error);
      });
  };
  useEffect(() => {
    fetchOrders();
  }, [vendorId]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "processing":
        return "warning";
      case "cancelled":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    // In a real app, this would update the order status in your database
    console.log(`Changing order ${orderId} status to ${newStatus}`);
    setShowDropdown(null);
  };

  const toggleDropdown = (orderId) => {
    if (showDropdown === orderId) {
      setShowDropdown(null);
    } else {
      setShowDropdown(orderId);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDetailsClick = (order) => {
    setSelectedOrder(order);
    fetchOrders(); // Call API on click
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="w-full px-4 py-6 md:px-6 lg:px-8">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl font-bold">Orders</CardTitle>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              {/* <Button size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button> */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-b-lg">
            <table className="w-full">
              <thead className="bg-muted/50 border-t border-b">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Order ID
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Order Date
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Total Amount
                  </th>
                  <th className="px-4 py-3.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Vendor Items
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                        #{order.orderId}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                        {order.orderDate}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <Badge
                          variant={getStatusColor(order.status)}
                          className="px-2.5 py-0.5 font-medium"
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-right">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium">
                          {order.vendorItems.length}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-right">
                        <button
                          className="details-btn"
                          onClick={() => handleDetailsClick(order)}
                        >
                          <Eye className="icon" />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-muted-foreground"
                    >
                      No orders found. New orders will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {isPopupOpen && selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center popup-overlay">
                <div className="bg-white w-full max-w-4xl mx-4 md:mx-auto rounded-lg p-6 shadow-lg relative overflow-y-auto max-h-[90vh]">
                  {/* Header */}
                  <div className="mb-6 flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl md:text-2xl font-bold">
                      Order #{selectedOrder.orderId} Details
                    </h2>
                    <button
                      onClick={closePopup}
                      className="text-2xl font-bold text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Order + Customer Info */}
                  <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                    {/* Order Information */}
                    <div className="flex-1 bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h3 className="font-semibold text-lg mb-3 text-gray-800">
                        Order Information
                      </h3>
                      <p>
                        <span className="text-gray-500">Order Date:</span>{" "}
                        {selectedOrder.orderDate}
                      </p>
                      <p className="flex items-center mt-1">
                        <span className="text-gray-500">Status:</span>
                        <span className="ml-2 px-2 py-1 bg-gray-200 rounded-full text-sm capitalize">
                          {selectedOrder.status}
                        </span>
                      </p>
                      <p className="mt-1">
                        <span className="text-gray-500">Total Amount:</span> ₹
                        {selectedOrder.totalAmount}
                      </p>
                    </div>

                    {/* Customer Information */}
                    <div className="flex-1 bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h3 className="font-semibold text-lg mb-3 text-gray-800">
                        Customer Information
                      </h3>
                      {(() => {
                        const info = JSON.parse(selectedOrder.shippingInfo);
                        return (
                          <div className="text-sm text-gray-700 space-y-1">
                            <p>
                              <span className="font-medium text-gray-600">
                                Name:
                              </span>{" "}
                              {info.recipient_name}
                            </p>
                            <p>
                              <span className="font-medium text-gray-600">
                                Email:
                              </span>{" "}
                              {info.email}
                            </p>
                            <p>
                              <span className="font-medium text-gray-600">
                                Phone:
                              </span>{" "}
                              {info.phone}
                            </p>
                            <p>
                              <span className="font-medium text-gray-600">
                                City:
                              </span>{" "}
                              {info.city}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Vendor Items */}
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                      Vendor Items ({selectedOrder.vendorItems.length})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                        <thead className="font-semibold text-gray-600">
                          <tr>
                            <th className="py-2">ITEM ID</th>
                            <th className="py-2">ITEM NAME</th>
                            <th className="py-2">QUANTITY</th>
                            <th className="py-2">PRICE</th>
                            <th className="py-2">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.vendorItems.map((item, index) => (
                            <tr key={index} className="bg-white">
                              <td className="py-2">{item.item_id}</td>
                              <td className="py-2">{item.item_name}</td>
                              <td className="py-2">{item.item_qty}</td>
                              <td className="py-2">₹{item.item_price}</td>
                              <td className="py-2">₹{item.item_total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Total Amount */}
                    <div className="text-right font-bold mt-4 text-gray-800">
                      Total: ₹{selectedOrder.totalAmount}
                    </div>
                  </div>

                  {/* Close Button */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={closePopup}
                      className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {orders.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{orders.length}</span>{" "}
                orders
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="h-8" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal could be added here */}
    </div>
  );
}
