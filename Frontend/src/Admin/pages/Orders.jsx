
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Collapse,
  Chip,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FileDownload as FileDownloadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { saveAs } from 'file-saver';

// Custom MUI Theme
const theme = createTheme({
  palette: {
    primary: { main: '#4F46E5' },
    secondary: { main: '#EC4899' },
    background: { default: '#F9FAFB' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

const OrderPage = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
  });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [validStatuses, setValidStatuses] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const FALLBACK_IMAGE = 'https://via.placeholder.com/150?text=Image+Not+Found';

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const [historyResponse, statusResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_baseUrl}/fetchHistory`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_baseUrl}/getOrderStatus`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setHistory(historyResponse.data.history);
      setFilteredHistory(historyResponse.data.history);
      if (statusResponse.data.status === 'success') {
        setValidStatuses(statusResponse.data.validStatuses);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to fetch initial data',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  // Filtering logic
  useEffect(() => {
    let filtered = [...history];

    if (filters.status !== 'all') {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    if (filters.search) {
      filtered = filtered.filter((order) => {
        const shipping = parseShippingInfo(order.shippingInfo);
        const searchLower = filters.search.toLowerCase();
        return (
          shipping.recipient_name?.toLowerCase().includes(searchLower) ||
          order.id.toString().includes(searchLower)
        );
      });
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((order) =>
        new Date(order.order_date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter((order) =>
        new Date(order.order_date) <= new Date(filters.dateTo)
      );
    }

    setFilteredHistory(filtered);
  }, [filters, history]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredHistory].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    setFilteredHistory(sorted);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(0);
  };

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const updateOrderStatus = async (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus || newStatus === history.find((o) => o.id === orderId).status || isUpdating) return;

    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.post(
        `${import.meta.env.VITE_baseUrl}/updateOrderStatus`,
        { orderId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Update response:', response.data);

      // Update local state to reflect the new status
      setHistory((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setFilteredHistory((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setStatusUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[orderId];
        return newUpdates;
      });

      setSnackbar({
        open: true,
        message: `Order #${orderId} status updated to ${newStatus}`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating order status:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || 'Failed to update order status',
        severity: 'error',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const parseCartItems = (cartItems) => {
    try {
      return JSON.parse(cartItems);
    } catch (error) {
      console.error('Error parsing cartItems:', error);
      return [];
    }
  };

  const parseShippingInfo = (shippingInfo) => {
    try {
      return JSON.parse(shippingInfo);
    } catch (error) {
      console.error('Error parsing shippingInfo:', error);
      return {};
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return FALLBACK_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_baseUrl}${imagePath}`;
  };

  const exportToCSV = () => {
    const headers = [
      'Order ID',
      'Customer',
      'Phone',
      'Address',
      'Items',
      'Total',
      'Payment Method',
      'Status',
      'Order Date',
    ];

    const csvRows = filteredHistory.map((order) => {
      const shipping = parseShippingInfo(order.shippingInfo);
      const items = parseCartItems(order.cartItems)
        .map((item) => `${item.item_name} (x${item.item_qty})`)
        .join('; ');
      return [
        order.id,
        shipping.recipient_name || '',
        shipping.phone || '',
        shipping.address || '',
        items,
        order.item_total,
        order.paymentMethod,
        order.status,
        new Date(order.order_date).toLocaleString(),
      ]
        .map((value) => `"${value}"`)
        .join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'order_history.csv');
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <CircularProgress size={60} color="primary" />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="min-h-screen bg-gray-50">
        <Container maxWidth="xl" className="py-12">
          <Box className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Typography
              variant="h4"
              className="font-extrabold text-gray-800 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text"
            >
              Order Dashboard
            </Typography>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={exportToCSV}
              color="primary"
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              Export Report
            </Button>
          </Box>

          {/* Filters */}
          <Paper className="mb-8 p-6 bg-white/95 backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <TextField
                label="Search Orders"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                variant="outlined"
                InputProps={{
                  startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
                }}
                className="bg-gray-50 rounded-lg"
              />
              <FormControl variant="outlined" className="bg-gray-50 rounded-lg">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {validStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="From Date"
                name="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                className="bg-gray-50 rounded-lg"
              />
              <TextField
                label="To Date"
                name="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                className="bg-gray-50 rounded-lg"
              />
            </div>
          </Paper>

          {/* Table */}
          <TableContainer component={Paper} className="overflow-hidden">
            <Table>
              <TableHead>
                <TableRow className="bg-gradient-to-r from-indigo-50 to-pink-50">
                  <TableCell width={50} />
                  <TableCell>
                    <Button
                      onClick={() => handleSort('id')}
                      endIcon={<SortIcon />}
                      className="text-gray-700 font-semibold"
                    >
                      Order ID
                    </Button>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">Customer</TableCell>
                  <TableCell className="font-semibold text-gray-700">Items</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSort('item_total')}
                      endIcon={<SortIcon />}
                      className="text-gray-700 font-semibold"
                    >
                      Total
                    </Button>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">Payment</TableCell>
                  <TableCell className="font-semibold text-gray-700">Status</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSort('order_date')}
                      endIcon={<SortIcon />}
                      className="text-gray-700 font-semibold"
                    >
                      Date
                    </Button>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-700">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => {
                    const shippingInfo = parseShippingInfo(order.shippingInfo);
                    const cartItems = parseCartItems(order.cartItems);
                    const isExpanded = expandedRows.has(order.id);
                    const currentStatus = statusUpdates[order.id] || order.status;

                    return (
                      <React.Fragment key={order.id}>
                        <TableRow className="hover:bg-indigo-50/50 transition-all duration-200">
                          <TableCell>
                            <IconButton
                              onClick={() => toggleRowExpansion(order.id)}
                              size="small"
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell className="font-medium text-indigo-600">{order.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{shippingInfo.recipient_name || 'N/A'}</span>
                              <span className="text-sm text-gray-500">{shippingInfo.phone}</span>
                              <span className="text-xs text-gray-400">{shippingInfo.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {cartItems.slice(0, 2).map((item) => (
                              <div key={item.id} className="text-sm text-gray-600 flex items-center gap-2">
                                <img
                                  src={getImageUrl(item.item_image)}
                                  alt={item.item_name}
                                  className="w-6 h-6 rounded-full object-cover"
                                  onError={(e) => {
                                    console.error(`Failed to load image for ${item.item_name}: ${item.item_image}`);
                                    e.target.src = FALLBACK_IMAGE;
                                  }}
                                />
                                <span>{item.item_name} (x{item.item_qty})</span>
                              </div>
                            ))}
                            {cartItems.length > 2 && (
                              <span className="text-xs text-indigo-500">
                                +{cartItems.length - 2} more
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900">
                            ₹{order.item_total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.paymentMethod.toUpperCase()}
                              size="small"
                              className="bg-indigo-100 text-indigo-800 font-medium"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={currentStatus}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              size="small"
                              className="w-32"
                              disabled={isUpdating}
                            >
                              {validStatuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(order.order_date).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={() => updateOrderStatus(order.id)}
                              disabled={
                                isUpdating ||
                                !statusUpdates[order.id] ||
                                statusUpdates[order.id] === order.status
                              }
                            >
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box className="p-6 bg-indigo-50/30 border-t border-indigo-100">
                                <Typography
                                  variant="h6"
                                  className="mb-4 font-semibold text-indigo-900"
                                >
                                  Order Details #{order.id}
                                </Typography>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <Typography
                                      variant="subtitle1"
                                      className="font-semibold text-gray-900 mb-2"
                                    >
                                      Shipping Information
                                    </Typography>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <p><span className="font-medium">Address:</span> {shippingInfo.address}</p>
                                      <p><span className="font-medium">City:</span> {shippingInfo.city}, {shippingInfo.state}</p>
                                      <p><span className="font-medium">Pincode:</span> {shippingInfo.pincode}</p>
                                    </div>
                                  </div>
                                  <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <Typography
                                      variant="subtitle1"
                                      className="font-semibold text-gray-900 mb-2"
                                    >
                                      Order Items
                                    </Typography>
                                    {cartItems.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                                      >
                                        <img
                                          src={getImageUrl(item.item_image)}
                                          alt={item.item_name}
                                          className="w-12 h-12 rounded-md object-cover shadow-sm"
                                          onError={(e) => {
                                            console.error(`Failed to load image for ${item.item_name}: ${item.item_image}`);
                                            e.target.src = FALLBACK_IMAGE;
                                          }}
                                        />
                                        <div className="text-sm">
                                          <p className="font-medium text-gray-900">{item.item_name}</p>
                                          <p className="text-gray-600">
                                            Qty: {item.item_qty} | ₹{item.item_total.toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredHistory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="mt-4 bg-white rounded-b-xl shadow-lg"
            sx={{ '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { fontSize: '0.9rem' } }}
          />

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default OrderPage;

