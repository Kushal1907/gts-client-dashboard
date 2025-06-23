// src/features/clients/clientSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Ensure this matches your JSON Server port

// Helper function to simulate delay for better UX (loading states)
const simulateDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to calculate date ranges for filtering
const getDateRange = (rangeType) => {
  const today = new Date();
  let startDate = null;
  let endDate = today; // Default end date is today

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

      let url = `${API_BASE_URL}/clients?_page=1&_limit=1000`; // Fetch up to 1000 clients for now

      // Apply search term filter
      if (filters.searchTerm) {
        url += `&q=${encodeURIComponent(filters.searchTerm)}`; // JSON Server full-text search
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

      // Apply date range filter
      const { startDate, endDate } = getDateRange(filters.dateRange);
      if (startDate) {
        url += `&signup_date_gte=${startDate}`;
      }
      if (endDate) {
        url += `&signup_date_lte=${endDate}`;
      }

      const response = await axios.get(url);
      const clients = response.data;
      const totalCount = response.headers["x-total-count"]
        ? parseInt(response.headers["x-total-count"], 10)
        : clients.length;

      // --- Data Transformation and Calculations (simulating SQL aggregations) ---
      // Note: In a real backend, these calculations would happen on the server side
      // with SQL queries (as outlined in clients.sql) for performance and scalability.
      const activeClients = clients.filter((c) => c.is_active).length;

      const industryDistribution = clients.reduce((acc, client) => {
        if (client.industry) {
          // Ensure industry exists
          acc[client.industry] = (acc[client.industry] || 0) + 1;
        }
        return acc;
      }, {});

      const locationDistribution = clients.reduce((acc, client) => {
        if (client.location) {
          // Ensure location exists
          acc[client.location] = (acc[client.location] || 0) + 1;
        }
        return acc;
      }, {});

      // Calculate average client tenure
      const signupDates = clients
        .map((c) => new Date(c.signup_date))
        .filter((date) => !isNaN(date.getTime())); // Filter out invalid dates
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
          : 0; // Average days in month

      // Calculate monthly client growth
      const monthlyGrowthRaw = clients.reduce((acc, client) => {
        const signupDate = new Date(client.signup_date);
        if (!isNaN(signupDate.getTime())) {
          // Ensure valid date
          // Format to YYYY-MM for grouping
          const yearMonth = `<span class="math-inline">\{signupDate\.getFullYear\(\)\}\-</span>{(signupDate.getMonth() + 1).toString().padStart(2, '0')}`;
          acc[yearMonth] = (acc[yearMonth] || 0) + 1;
        }
        return acc;
      }, {});

      // Sort monthly growth keys for consistent chart display and ensure continuity
      const monthlyGrowth = Object.keys(monthlyGrowthRaw)
        .sort()
        .map((key) => ({ name: key, value: monthlyGrowthRaw[key] }));

      return {
        clients, // Raw client data (optional, dashboard primarily uses derived stats)
        totalClients: totalCount,
        activeClients,
        clientTenure: avgTenureMonths,
        industryDistribution,
        locationDistribution,
        monthlyGrowth,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Provide a more specific error message from the API response if available
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
    clients: [], // Raw client data (optional, dashboard primarily uses derived stats)
    totalClients: 0,
    activeClients: 0,
    clientTenure: 0,
    industryDistribution: {}, // Object: { "IT": 5, "Finance": 3 }
    locationDistribution: {}, // Object: { "New York": 2, "London": 1 }
    monthlyGrowth: [], // Array: [{ name: "2023-01", value: 5 }, { name: "2023-02", value: 3 }]
    loading: false,
    error: null,
  },
  reducers: {
    // No synchronous reducers needed for this case
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear previous errors on new fetch
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
      })
      .addCase(fetchClientData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch client data";
        console.error("Failed to fetch client data:", action.payload); // Log for debugging
      });
  },
});

// Selectors for easy access to state data in components
export const selectClientData = (state) => state.clients;
export const selectLoading = (state) => state.clients.loading;
export const selectError = (state) => state.clients.error;

export default clientSlice.reducer;
