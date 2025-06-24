// src/features/clients/clientSlice.js
// Force rebuild 20250623-1 (updated)
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosRetry from "axios-retry";

const API_BASE_URL = "http://localhost:3001";

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

const simulateDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getDateRange = (
  rangeType,
  customStartDate = null,
  customEndDate = null
) => {
  const today = new Date();
  let startDate = null;
  let endDate = today;

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
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      case "last_year":
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      case "all":
      default:
        startDate = null;
        endDate = null;
        break;
    }
  }

  const format = (date) => (date ? date.toISOString().split("T")[0] : null);

  return {
    startDate: format(startDate),
    endDate: format(endDate),
  };
};

// UPDATED ASYNC THUNK: Fetch Active and Inactive Client Counts from custom endpoint
export const fetchActiveInactiveCounts = createAsyncThunk(
  "clients/fetchActiveInactiveCounts",
  async (_, { rejectWithValue }) => {
    try {
      await simulateDelay(300);

      // Call the custom endpoint
      const response = await axios.get(`${API_BASE_URL}/clients/active`);
      const { activeClients, inactiveClients } = response.data; // Destructure directly

      return { active: activeClients, inactive: inactiveClients };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            `API Error fetching counts: ${error.message}`
        );
      }
      return rejectWithValue(
        "An unknown error occurred while fetching active/inactive counts."
      );
    }
  }
);

// Async Thunk to fetch main client data (remains mostly same, but ensures totalClients is accurate for pagination)
export const fetchClientData = createAsyncThunk(
  "clients/fetchClientData",
  async (filters = {}, { rejectWithValue }) => {
    try {
      await simulateDelay(500);

      const {
        page = 1,
        limit = 10,
        sortBy = "id",
        sortOrder = "asc",
      } = filters;

      let url = `${API_BASE_URL}/clients?_page=${page}&_limit=${limit}&_sort=${sortBy}&_order=${sortOrder}`;

      if (filters.searchTerm) {
        url += `&name_like=${encodeURIComponent(filters.searchTerm)}`;
      }
      if (filters.industry && filters.industry !== "all") {
        url += `&industry=${encodeURIComponent(filters.industry)}`;
      }
      if (filters.subscriptionTier && filters.subscriptionTier !== "all") {
        url += `&subscription_tier=${encodeURIComponent(
          filters.subscriptionTier
        )}`;
      }

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
      const totalCount = response.headers["x-total-count"]
        ? parseInt(response.headers["x-total-count"], 10)
        : clients.length;

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
        totalClients: totalCount,
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
    clients: [],
    totalClients: 0,
    activeClientCount: 0, // NEW: Dedicated state for active clients
    inactiveClientCount: 0, // NEW: Dedicated state for inactive clients
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
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
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
        state.clientTenure = action.payload.clientTenure;
        state.industryDistribution = action.payload.industryDistribution;
        state.locationDistribution = action.payload.locationDistribution;
        state.monthlyGrowth = action.payload.monthlyGrowth;
        state.currentPage = action.payload.currentPage;
        state.itemsPerPage = action.payload.itemsPerPage;
      })
      .addCase(fetchClientData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch client data";
        console.error("Failed to fetch client data:", action.payload);
      })
      // NEW Cases for fetchActiveInactiveCounts
      .addCase(fetchActiveInactiveCounts.pending, (state) => {
        // If you had a separate loading indicator for just these counts
      })
      .addCase(fetchActiveInactiveCounts.fulfilled, (state, action) => {
        state.activeClientCount = action.payload.active;
        state.inactiveClientCount = action.payload.inactive;
      })
      .addCase(fetchActiveInactiveCounts.rejected, (state, action) => {
        console.error(
          "Failed to fetch active/inactive counts:",
          action.payload
        );
        // Could set a specific error for counts if needed
      });
  },
});

export const { setPage, setItemsPerPage, setSort } = clientSlice.actions;

export const selectActiveClientCount = (state) =>
  state.clients.activeClientCount;
export const selectInactiveClientCount = (state) =>
  state.clients.inactiveClientCount; // Expose inactive count too

export const selectCurrentPage = (state) => state.clients.currentPage;
export const selectTotalClients = (state) => state.clients.totalClients;
export const selectItemsPerPage = (state) => state.clients.itemsPerPage;
export const selectSortBy = (state) => state.clients.sortBy;
export const selectSortOrder = (state) => state.clients.sortOrder;

export const selectClientData = (state) => state.clients;
export const selectLoading = (state) => state.clients.loading;
export const selectError = (state) => state.clients.error;

export default clientSlice.reducer;
