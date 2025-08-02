
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const CategoryPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [pendingCategories, setPendingCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [reviewAction, setReviewAction] = useState("");
  const [reviewComments, setReviewComments] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchPendingCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_baseUrl}/fetchCategory`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(response.data.category);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Failed to fetch categories",
        severity: "error",
      });
    }
  };

  const fetchPendingCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_baseUrl}/pendingCategories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching pending categories:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Failed to fetch pending categories",
        severity: "error",
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenReviewDialog = (category, action) => {
    console.log("Category object:", category);
    setCurrentCategory(category);
    setReviewAction(action);
    setReviewComments("");
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setCurrentCategory(null);
    setReviewAction("");
    setReviewComments("");
  };

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const payload = {
        categoryId: currentCategory?.id,
        action: reviewAction,
        comments: reviewComments,
      };
      console.log("Submitting review with payload:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_baseUrl}/categoryReview`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSnackbar({
        open: true,
        message: `Category ${reviewAction} successfully`,
        severity: "success",
      });

      fetchPendingCategories();
      if (reviewAction === "approved") {
        fetchCategories();
      }

      handleCloseReviewDialog();
    } catch (error) {
      console.error("Error submitting review:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to ${reviewAction} category`;

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          mb: 4,
          color: "#1a237e",
          textAlign: "center",
        }}
      >
        Category Management
      </Typography>

      <Paper
        sx={{
          mb: 4,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1.1rem",
              color: "#424242",
              padding: "16px",
            },
            "& .Mui-selected": {
              color: "#3f51b5",
              backgroundColor: "rgba(63, 81, 181, 0.1)",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#3f51b5",
              height: 3,
            },
          }}
        >
          <Tab label="Approved Categories" />
          <Tab label="Pending Approval" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {categories.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
                      },
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        height: 200,
                        width: "100%",
                        objectFit: "cover",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                      image={`${import.meta.env.VITE_baseUrl}${
                        category.category_image
                      }`}
                      alt={category.category_name}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{
                              fontWeight: 700,
                              color: "#1a237e",
                              lineHeight: 1.3,
                            }}
                          >
                            {category.category_name}
                          </Typography>
                          <Chip
                            label={category.status}
                            color="success"
                            size="small"
                            sx={{
                              fontWeight: 600,
                              backgroundColor: "#4caf50",
                              color: "#fff",
                              borderRadius: 2,
                              px: 1,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {category.category_description}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          color: "#3f51b5",
                          mt: 1,
                        }}
                      >
                        Orders: {category.order_count || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              {pendingCategories.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
                      },
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        height: 200,
                        width: "100%",
                        objectFit: "cover",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                      image={`${import.meta.env.VITE_baseUrl}${
                        category.category_image
                      }`}
                      alt={category.category_name}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{
                              fontWeight: 700,
                              color: "#1a237e",
                              lineHeight: 1.3,
                            }}
                          >
                            {category.category_name}
                          </Typography>
                          <Chip
                            label={category.status}
                            color="warning"
                            size="small"
                            sx={{
                              fontWeight: 600,
                              backgroundColor: "#ff9800",
                              color: "#fff",
                              borderRadius: 2,
                              px: 1,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {category.category_description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mt: 2,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckIcon />}
                          onClick={() =>
                            handleOpenReviewDialog(category, "approved")
                          }
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            py: 1,
                            backgroundColor: "#4caf50",
                            "&:hover": {
                              backgroundColor: "#388e3c",
                            },
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<CloseIcon />}
                          onClick={() =>
                            handleOpenReviewDialog(category, "rejected")
                          }
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            py: 1,
                            backgroundColor: "#d32f2f",
                            "&:hover": {
                              backgroundColor: "#b71c1c",
                            },
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Review Confirmation Dialog */}
      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog}>
        <DialogTitle
          sx={{
            fontWeight: 600,
            backgroundColor: reviewAction === "approved" ? "#e8f5e9" : "#ffebee",
            color: "#1a237e",
            py: 2,
          }}
        >
          {reviewAction === "approved" ? "Approve Category" : "Reject Category"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography sx={{ mb: 3, fontSize: "1rem", color: "#424242" }}>
            Are you sure you want to {reviewAction} "
            {currentCategory?.category_name}"?
          </Typography>
          <TextField
            fullWidth
            label="Comments (Optional)"
            value={reviewComments}
            onChange={(e) => setReviewComments(e.target.value)}
            multiline
            rows={4}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseReviewDialog}
            sx={{
              textTransform: "none",
              color: "#757575",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReviewSubmit}
            color={reviewAction === "approved" ? "success" : "error"}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
            }}
          >
            {reviewAction === "approved" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoryPage;