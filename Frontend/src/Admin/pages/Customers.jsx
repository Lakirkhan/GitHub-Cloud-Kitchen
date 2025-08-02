"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Filter, MoreVertical, Calendar, Package } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable } from "../components/DataTable";

export function CustomersPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [amountFilter, setAmountFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_baseUrl}/fetchHistory`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHistory(data.history.reverse());
        setFilteredHistory(data.history.slice(0, 20)); // Load initial batch
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    let updatedHistory = [...history];

    if (statusFilter !== "All") {
      updatedHistory = updatedHistory.filter(
        (order) => order.status === statusFilter.toLowerCase()
      );
    }

    if (amountFilter !== "All") {
      const minAmount = Number.parseInt(amountFilter.replace(/\D/g, ""), 10);
      updatedHistory = updatedHistory.filter(
        (order) => order.item_total >= minAmount
      );
    }

    if (searchQuery) {
      updatedHistory = updatedHistory.filter((order) => {
        const billingInfo =
          typeof order.billingInfo === "string"
            ? JSON.parse(order.billingInfo)
            : order.billingInfo;

        const recipientName = billingInfo.recipient_name || "";

        return recipientName.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    setFilteredHistory(updatedHistory.slice(0, 20)); // Reset to initial batch
    setHasMore(updatedHistory.length > 20); // Check if more items are available
  }, [statusFilter, amountFilter, searchQuery, history]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      const nextBatch = filteredHistory.slice(0, filteredHistory.length + 20);
      setFilteredHistory(nextBatch);
      setHasMore(nextBatch.length < history.length);
      setLoading(false);
    }, 1000); // Simulate network delay
  }, [loading, hasMore, filteredHistory, history]);

  const lastHistoryRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBillingInfo = (order) => {
    if (!order.billingInfo) return { recipient_name: "N/A" };

    try {
      return typeof order.billingInfo === "string"
        ? JSON.parse(order.billingInfo)
        : order.billingInfo;
    } catch (e) {
      return { recipient_name: "Error parsing data" };
    }
  };

  const getCartItemsCount = (order) => {
    if (!order.cartItems) return 0;

    try {
      const items =
        typeof order.cartItems === "string"
          ? JSON.parse(order.cartItems)
          : order.cartItems;
      return items.length;
    } catch (e) {
      return 0;
    }
  };

  const columns = [
    // {
    //   key: "id",
    //   title: "Order ID",
    //   render: (value) => <span className="font-medium">#{value}</span>,
    // },
    {
      key: "customer",
      title: "Customer",
      render: (_, item) => {
        const billingInfo = getBillingInfo(item);
        const customerName = billingInfo.recipient_name || "UnknownCustomer";

        return (
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold overflow-hidden ${(() => {
                const colors = [
                  "bg-red-500",
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-yellow-500",
                  "bg-purple-500",
                  "bg-pink-500",
                  "bg-indigo-500",
                  "bg-teal-500",
                ];
                let hash = 0;
                for (let i = 0; i < customerName.length; i++) {
                  hash = customerName.charCodeAt(i) + ((hash << 5) - hash);
                }
                return colors[Math.abs(hash) % colors.length];
              })()}`}
            >
              {(() => {
                const words = customerName.trim().split(/\s+/);
                if (words.length === 1) {
                  return (
                    words[0][0] + (words[0][1] || words[0][0])
                  ).toUpperCase();
                }
                return (words[0][0] + words[words.length - 1][0]).toUpperCase();
              })()}
            </div>
            <div>
              <div className="font-medium text-gray-900">{customerName}</div>
              <div className="text-sm text-gray-500">
                {billingInfo.email || billingInfo.phone || "No contact info"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "items",
      title: "Items",
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-400" />
          <span>{getCartItemsCount(item)}</span>
        </div>
      ),
    },
    {
      key: "item_total",
      title: "Total Amount",
      render: (value) => (value ? `$${value.toFixed(2)}` : "$0.00"),
    },
    // {
    //   key: "status",
    //   title: "Status",
    //   render: (value) => (
    //     <span
    //       className={`px-2 py-1 rounded-full text-xs font-medium ${
    //         value === "completed"
    //           ? "bg-yellow-100 text-yellow-800"
    //           : value === "completed"
    //             ? "bg-green-100 text-green-800"
    //             : value === "cancelled"
    //               ? "bg-red-100 text-red-800"
    //               : "bg-gray-100 text-gray-800"
    //       }`}
    //     >
    //       {value ? value.charAt(0).toUpperCase() + value.slice(1) : "N/A"}
    //     </span>
    //   ),
    // },
    {
      key: "order_date",
      title: "Last Order",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{value ? formatDate(value) : "N/A"}</span>
        </div>
      ),
    },
    {
      key: "actions",
      title: "",
      render: () => (
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Customer History"
        description="View and manage customer details"
      >
        {/* <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Export Orders
        </button> */}
      </PageHeader>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search by customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
          {filterOpen && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <select
                  value={amountFilter}
                  onChange={(e) => setAmountFilter(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>All</option>
                  <option>{"> $100"}</option>
                  <option>{"> $500"}</option>
                  <option>{"> $1000"}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {" "}
          {/* Scrollable container */}
          <DataTable
            columns={columns}
            data={filteredHistory}
            onRowClick={(order) => console.log("Order clicked:", order)}
          />
          <div
            ref={lastHistoryRef}
            className="px-6 py-4 border-t border-gray-200 flex items-center justify-center"
          >
            {loading && <p className="text-sm text-gray-700">Loading...</p>}
            {!hasMore && (
              <p className="text-sm text-gray-700">No more orders to load</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
