// src/features/clients/clientSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Ensure this matches your JSON Server port

// Helper function to simulate delay for better UX (loading states)
const simulateDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Async Thunk to fetch client data
export const fetchClientData = createAsyncThunk(
  "clients/fetchClientData",
  async (filters = {}, { rejectWithValue }) => {
    try {
      await simulateDelay(500); // Simulate network latency

      let url = `${API_BASE_URL}/clients?_page=1&_limit=1000`; // Fetch up to 1000 clients for now

      // Apply filters dynamically based on the filters object
      if (filters.industry && filters.industry !== "all") {
        url += `&industry=${filters.industry}`;
      }
      if (filters.subscriptionTier && filters.subscriptionTier !== "all") {
        url += `&subscription_tier=${filters.subscriptionTier}`;
      }

      const response = await axios.get(url);
      const clients = response.data;
      // For JSON Server, total count is often in 'x-total-count' header if pagination is truly enabled
      // or fallback to clients.length if not explicitly configured in JSON Server setup.
      const totalCount = response.headers["x-total-count"]
        ? parseInt(response.headers["x-total-count"], 10)
        : clients.length;

      // --- Data Transformation and Calculations (simulating SQL aggregations) ---
      const activeClients = clients.filter((c) => c.is_active).length;

      const industryDistribution = clients.reduce((acc, client) => {
        acc[client.industry] = (acc[client.industry] || 0) + 1;
        return acc;
      }, {});

      const locationDistribution = clients.reduce((acc, client) => {
        acc[client.location] = (acc[client.location] || 0) + 1;
        return acc;
      }, {});

      // Calculate average client tenure (simplified for mock data)
      const signupDates = clients.map((c) => new Date(c.signup_date));
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

      // Calculate monthly client growth (simplified for mock data)
      const monthlyGrowthRaw = clients.reduce((acc, client) => {
        const signupDate = new Date(client.signup_date);
        // Format to YYYY-MM for grouping
        const yearMonth = `<span class="math-inline">\{signupDate\.getFullYear\(\)\}\-</span>{(signupDate.getMonth() + 1).toString().padStart(2, '0')}`;
        acc[yearMonth] = (acc[yearMonth] || 0) + 1;
        return acc;
      }, {});

      // Sort monthly growth keys for consistent chart display
      const monthlyGrowth = Object.keys(monthlyGrowthRaw)
        .sort()
        .map((key) => ({ name: key, value: monthlyGrowthRaw[key] })); // Convert to array of objects for Recharts LineChart

      return {
        clients, // Keep raw clients if needed elsewhere, though not directly used in this dashboard UI
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
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue("An unknown error occurred");
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
      });
  },
});

// Selectors for easy access to state data in components
export const selectClientData = (state) => state.clients;
export const selectLoading = (state) => state.clients.loading;
export const selectError = (state) => state.clients.error;

export default clientSlice.reducer;
