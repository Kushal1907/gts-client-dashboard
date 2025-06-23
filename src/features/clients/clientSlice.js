// src/features/clients/clientSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Ensure this matches your JSON Server port

// Helper function to simulate delay for better UX (loading states)
const simulateDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to calculate date ranges for filtering
const getDateRange = (
  rangeType,
  customStartDate = null,
  customEndDate = null
) => {
  const today = new Date();
  let startDate = null;
  let endDate = today; // Default end date is today

  if (rangeType === "custom" && customStartDate && customEndDate) {
    startDate = new Date(customStartDate);
    endDate = new Date(customEndDate);
  } else {
    switch (rangeType) {
      case "last_3_months":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth() - 3,
          today.getDate()
        );
        break;
      case "last_6_months":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth() - 6,
          today.getDate()
        );
        break;
      case "this_year":
        startDate = new Date(today.getFullYear(), 0, 1); // January 1st of current year
        break;
      case "last_year":
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31); // December 31st of last year
        break;
      case "all":
      default:
        startDate = null; // No start date filter
        endDate = null; // No end date filter
        break;
    }
  }

  // Format dates to YYYY-MM-DD for JSON Server
  const format = (date) => (date ? date.toISOString().split("T")[0] : null);

  return {
    startDate: format(startDate),
    endDate: format(endDate),
  };
};

// Async Thunk to fetch client data
export const fetchClientData = createAsyncThunk(
  "clients/fetchClientData",
  async (filters = {}, { rejectWithValue }) => {
    try {
      await simulateDelay(500); // Simulate network latency

      // Add pagination and sort parameters
      const {
        page = 1,
        limit = 10,
        sortBy = "id",
        sortOrder = "asc",
      } = filters;

      let url = `${API_BASE_URL}/clients?_page=${page}&_limit=${limit}&_sort=${sortBy}&_order=${sortOrder}`;

      // Apply search term filter for specific name search
      if (filters.searchTerm) {
        url += `&name_like=${encodeURIComponent(filters.searchTerm)}`;
      }

      // Apply industry filter
      if (filters.industry && filters.industry !== "all") {
        url += `&industry=${encodeURIComponent(filters.industry)}`;
      }

      // Apply subscription tier filter
      if (filters.subscriptionTier && filters.subscriptionTier !== "all") {
        url += `&subscription_tier=${encodeURIComponent(
          filters.subscriptionTier
        )}`;
      }

      // Apply date range filter (including custom dates)
      const { startDate, endDate } = getDateRange(
        filters.dateRange,
        filters.customStartDate,
        filters.customEndDate
      );
      if (startDate) {
        url += `&signup_date_gte=${startDate}`;
      }
      if (endDate) {
        url += `&signup_date_lte=${endDate}`;
      }

      const response = await axios.get(url);
      const clients = response.data;
      // JSON Server sends total count in 'x-total-count' header for pagination
      const totalCount = response.headers["x-total-count"]
        ? parseInt(response.headers["x-total-count"], 10)
        : clients.length;

      // --- Data Transformation and Calculations (simulating SQL aggregations) ---
      // Note: These aggregations are now performed on the *filtered and paginated* data.
      // For accurate *overall* stats, you'd make a separate call without pagination.
      // For simplicity in this demo, we'll calculate based on the current page's data.
      // If you need global stats, you would dispatch another fetch with _limit=totalCount
      // or set up separate API endpoints for metrics vs. paginated list.

      const activeClients = clients.filter((c) => c.is_active).length;

      const industryDistribution = clients.reduce((acc, client) => {
        if (client.industry) {
          acc[client.industry] = (acc[client.industry] || 0) + 1;
        }
        return acc;
      }, {});

      const locationDistribution = clients.reduce((acc, client) => {
        if (client.location) {
          acc[client.location] = (acc[client.location] || 0) + 1;
        }
        return acc;
      }, {});

      // Calculate average client tenure (only for clients on current page)
      const signupDates = clients
        .map((c) => new Date(c.signup_date))
        .filter((date) => !isNaN(date.getTime()));
      const today = new Date();
      let totalTenureDays = 0;
      if (signupDates.length > 0) {
        totalTenureDays = signupDates.reduce((sum, date) => {
          const diffTime = Math.abs(today.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }, 0);
      }
      const avgTenureMonths =
        signupDates.length > 0
          ? totalTenureDays / signupDates.length / 30.44
          : 0;

      // Calculate monthly client growth (only for clients on current page)
      const monthlyGrowthRaw = clients.reduce((acc, client) => {
        const signupDate = new Date(client.signup_date);
        if (!isNaN(signupDate.getTime())) {
          const yearMonth = `${signupDate.getFullYear()}-${(
            signupDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}`;
          acc[yearMonth] = (acc[yearMonth] || 0) + 1;
        }
        return acc;
      }, {});

      const monthlyGrowth = Object.keys(monthlyGrowthRaw)
        .sort()
        .map((key) => ({ name: key, value: monthlyGrowthRaw[key] }));

      return {
        clients,
        totalClients: totalCount, // This is the total count before pagination
        activeClients,
        clientTenure: avgTenureMonths,
        industryDistribution,
        locationDistribution,
        monthlyGrowth,
        currentPage: page,
        itemsPerPage: limit,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || `API Error: ${error.message}`
        );
      }
      console.error("Unknown error in fetchClientData:", error);
      return rejectWithValue("An unknown error occurred while fetching data.");
    }
  }
);

const clientSlice = createSlice({
  name: "clients",
  initialState: {
    clients: [], // Raw client data for the current page
    totalClients: 0, // Total count of clients matching filters (for pagination)
    activeClients: 0,
    clientTenure: 0,
    industryDistribution: {},
    locationDistribution: {},
    monthlyGrowth: [],
    loading: false,
    error: null,
    currentPage: 1,
    itemsPerPage: 10,
    sortBy: "id",
    sortOrder: "asc",
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSort: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientData.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.clients;
        state.totalClients = action.payload.totalClients;
        state.activeClients = action.payload.activeClients;
        state.clientTenure = action.payload.clientTenure;
        state.industryDistribution = action.payload.industryDistribution;
        state.locationDistribution = action.payload.locationDistribution;
        state.monthlyGrowth = action.payload.monthlyGrowth;
        state.currentPage = action.payload.currentPage;
        state.itemsPerPage = action.payload.itemsPerPage;
        // sortBy and sortOrder are updated by setSort reducer when filters are applied
      })
      .addCase(fetchClientData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch client data";
        console.error("Failed to fetch client data:", action.payload);
      });
  },
});

export const { setPage, setSort, setItemsPerPage } = clientSlice.actions; // Export new actions

export const selectClientData = (state) => state.clients;
export const selectLoading = (state) => state.clients.loading;
export const selectError = (state) => state.clients.error;
export const selectCurrentPage = (state) => state.clients.currentPage;
export const selectTotalClients = (state) => state.clients.totalClients;
export const selectItemsPerPage = (state) => state.clients.itemsPerPage;
export const selectSortBy = (state) => state.clients.sortBy;
export const selectSortOrder = (state) => state.clients.sortOrder;

export default clientSlice.reducer;
