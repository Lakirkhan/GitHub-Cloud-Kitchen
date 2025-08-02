import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
const AnalyticsPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_baseUrl}/fetchHistory`);
        const data = await response.json();
        if (data.status === 'success') {
          setHistoryData(data.history);
        }
      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Process data for charts
  const processSalesData = () => {
    const salesByDate = {};
    historyData.forEach(order => {
      const date = new Date(order.order_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      salesByDate[date] = (salesByDate[date] || 0) + order.item_total;
    });
    return {
      labels: Object.keys(salesByDate),
      datasets: [
        {
          label: 'Total Sales (₹)',
          data: Object.values(salesByDate),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };
  const processTopItemsData = () => {
    const itemCount = {};
    historyData.forEach(order => {
      const cartItems = JSON.parse(order.cartItems);
      cartItems.forEach(item => {
        itemCount[item.item_name] = (itemCount[item.item_name] || 0) + item.item_qty;
      });
    });
    const sortedItems = Object.entries(itemCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    return {
      labels: sortedItems.map(([name]) => name),
      datasets: [
        {
          label: 'Units Sold',
          data: sortedItems.map(([, qty]) => qty),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  };
  const processUserData = () => {
    const ordersByUser = {};
    historyData.forEach(order => {
      ordersByUser[order.addedby] = (ordersByUser[order.addedby] || 0) + 1;
    });
    return {
      labels: Object.keys(ordersByUser).map(id => `User ${id}`),
      datasets: [
        {
          data: Object.values(ordersByUser),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',  '#9966FF', '#F06292'],
          borderColor: '#fff',
          borderWidth: 1,
        },
      ],
    };
  };
  const processPaymentData = () => {
    const paymentCount = {};
    historyData.forEach(order => {
      paymentCount[order.paymentMethod] = (paymentCount[order.paymentMethod] || 0) + 1;
    });
    return {
      labels: Object.keys(paymentCount),
      datasets: [
        {
          data: Object.values(paymentCount),
          backgroundColor: ['#FF9800', '#2196F3', '#E91E63'],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  };
  const processCityData = () => {
    const ordersByCity = {};
    historyData.forEach(order => {
      const shippingInfo = JSON.parse(order.shippingInfo);
      const city = shippingInfo.city || 'Unknown';
      ordersByCity[city] = (ordersByCity[city] || 0) + 1;
    });
    return {
      labels: Object.keys(ordersByCity),
      datasets: [
        {
          label: 'Orders',
          data: Object.values(ordersByCity),
          backgroundColor: '#42A5F5',
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  };
  const processAvgOrderValue = () => {
    const avgByDate = {};
    const countByDate = {};
    historyData.forEach(order => {
      const date = new Date(order.order_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      avgByDate[date] = (avgByDate[date] || 0) + order.item_total;
      countByDate[date] = (countByDate[date] || 0) + 1;
    });
    const labels = Object.keys(avgByDate);
    const data = labels.map(date => (avgByDate[date] / countByDate[date]).toFixed(2));
    return {
      labels,
      datasets: [
        {
          label: 'Avg Order Value (₹)',
          data,
          borderColor: '#FF5722',
          backgroundColor: 'rgba(255, 87, 34, 0.2)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    AscendantRatio: true,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 12 } } },
      title: { display: true, font: { size: 14 } },
      tooltip: { backgroundColor: '#333', titleFont: { size: 12 }, bodyFont: { size: 10 } },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h6" className="text-gray-500 animate-pulse">
          Loading Analytics...
        </Typography>
      </Box>
    );
  }
  return (
    <Container maxWidth="lg" className=" bg-gray-50 min-h-screen">
      <Typography
        variant="h4"
        className=" py-2 mb-6 text-left font-bold text-gray-800 tracking-tight"
      >
        Analytics
      </Typography>
      <Grid container spacing={3}>
        {/* Total Sales Over Time */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className="shadow-md rounded-lg bg-white hover:shadow-lg transition-shadow duration-200 h-80">
            <CardContent>
              <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                Total Sales Over Time
              </Typography>
              <Box className="h-60">
                <Line
                  data={processSalesData()}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { text: 'Sales Trend' } },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Top Selling Items */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className="shadow-md rounded-lg bg-white hover:shadow-lg transition-shadow duration-200 h-80">
            <CardContent>
              <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                Top 5 Selling Items
              </Typography>
              <Box className="h-60">
                <Bar
                  data={processTopItemsData()}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { text: 'Top Items Sold' } },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Orders by User */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className="shadow-md rounded-lg bg-white hover:shadow-lg transition-shadow duration-200 h-80">
            <CardContent>
              <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                Orders by User
              </Typography>
              <Box className="h-60">
                <Pie
                  data={processUserData()}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { text: 'User Distribution' } },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Payment Method Distribution */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className="shadow-md rounded-lg bg-white hover:shadow-lg transition-shadow duration-200 h-80">
            <CardContent>
              <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                Payment Methods
              </Typography>
              <Box className="h-60">
                <Doughnut
                  data={processPaymentData()}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { text: 'Payment Distribution' } },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Orders by City */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className="shadow-md rounded-lg bg-white hover:shadow-lg transition-shadow duration-200 h-80">
            <CardContent>
              <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                Orders by City
              </Typography>
              <Box className="h-60">
                <Bar
                  data={processCityData()}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { text: 'City-wise Orders' } },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Average Order Value Over Time */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className="shadow-md rounded-lg bg-white hover:shadow-lg transition-shadow duration-200 h-80">
            <CardContent>
              <Typography variant="h6" className="mb-2 font-semibold text-gray-700">
                Avg Order Value
              </Typography>
              <Box className="h-60">
                <Line
                  data={processAvgOrderValue()}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, title: { text: 'Avg Order Trend' } },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
export default AnalyticsPage;