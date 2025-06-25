// src/components/ClientStats/ClientStats.js
// Force rebuild 20250623-3 (updated - full code with transient props for ToggleButton)
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import styled from "styled-components"; // No change here

import {
  fetchActiveInactiveCounts,
  fetchClientData,
  selectActiveClientCount,
  selectClientData,
  selectCurrentPage,
  selectError,
  selectInactiveClientCount,
  selectItemsPerPage,
  selectLoading,
  selectSortBy,
  selectSortOrder,
  setItemsPerPage,
  setPage,
  setSort,
} from "../../features/clients/clientSlice";
import ClientList from "../ClientList/ClientList";
import ErrorMessage from "../Shared/ErrorMessage";
import LoadingChart from "../Shared/LoadingChart";
import LoadingMetricCard from "../Shared/LoadingMetricCard";
import ClientChart from "./ClientChart";
import FilterControls from "./FilterControls";
import MetricCard from "./MetricCard";

// -------------------------------------------------------------------------
// Styled Components
// -------------------------------------------------------------------------
const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Arial", sans-serif;
  color: #333;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  min-height: 80vh;

  @media (max-width: 768px) {
    padding: 15px;
    margin: 0;
    max-width: 100%;
  }
`;

const Header = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2em;

  @media (max-width: 768px) {
    font-size: 1.6em;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
  justify-content: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  h3 {
    margin: 0;
    padding-right: 10px;
  }
`;

// --- CRITICAL CHANGE 1: Update ToggleButton definition to use $active ---
const ToggleButton = styled.button`
  background-color: ${(props) => (props.$active ? "#007bff" : "#ccc")};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$active ? "#0056b3" : "#999")};
  }
`;
// -------------------------------------------------------------------------
// END Styled Components
// -------------------------------------------------------------------------

const ClientStats = () => {
  const dispatch = useDispatch();
  const {
    totalClients,
    clientTenure,
    industryDistribution,
    locationDistribution,
    monthlyGrowth,
  } = useSelector(selectClientData);

  const activeClientCount = useSelector(selectActiveClientCount);
  const inactiveClientCount = useSelector(selectInactiveClientCount);

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const currentPage = useSelector(selectCurrentPage);
  const itemsPerPage = useSelector(selectItemsPerPage);
  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);

  const [filters, setFilters] = useState({
    searchTerm: "",
    industry: "all",
    subscriptionTier: "all",
    dateRange: "all",
    customStartDate: null,
    customEndDate: null,
  });

  const [chartVisibility, setChartVisibility] = useState({
    industry: true,
    location: true,
    monthlyGrowth: true,
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    filters.searchTerm
  );

  // Effect for debouncing search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filters.searchTerm]);

  // Define a memoized function to fetch all dashboard data
  const fetchAllDashboardData = useCallback(() => {
    // We construct the filters object that needs to be passed to the thunks
    // It includes the debouncedSearchTerm for the fetch, and other filters from state.
    const currentFiltersForThunk = {
      searchTerm: debouncedSearchTerm, // Use the debounced value here
      industry: filters.industry,
      subscriptionTier: filters.subscriptionTier,
      dateRange: filters.dateRange,
      customStartDate: filters.customStartDate,
      customEndDate: filters.customEndDate,
    };

    dispatch(
      fetchClientData({
        ...currentFiltersForThunk, // Spread the current filters
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortBy,
        sortOrder: sortOrder,
      })
    );
    // IMPORTANT: Pass the constructed filters object to fetchActiveInactiveCounts as well
    dispatch(fetchActiveInactiveCounts(currentFiltersForThunk));
  }, [
    dispatch,
    filters.industry, // dependency array should contain all values used from `filters`
    filters.subscriptionTier,
    filters.dateRange,
    filters.customStartDate,
    filters.customEndDate,
    debouncedSearchTerm, // This needs to be a dependency since it changes asynchronously
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
    // Note: 'filters' as a whole object is not strictly necessary here
    // if all its properties that are used are individually listed.
    // However, if the structure of 'filters' might change or to simplify,
    // you could put 'filters' itself in the dependency array.
    // For clarity and to avoid potential stale closures, explicitly listing
    // the properties used from 'filters' for 'currentFiltersForThunk' is safer.
  ]);

  // Effect for initial data fetch and handling filter/pagination/sort changes
  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  // WebSocket connection and event listener for real-time updates
  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("dataUpdated", () => {
      console.log(
        "Received dataUpdated event from server. Refetching dashboard data..."
      );
      fetchAllDashboardData();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected from WebSocket server on component unmount");
    };
  }, [fetchAllDashboardData]);

  const handleFilterChange = useCallback(
    (newFilters) => {
      const shouldResetPage =
        newFilters.page === undefined &&
        newFilters.sortBy === undefined &&
        (newFilters.searchTerm !== filters.searchTerm ||
          newFilters.industry !== filters.industry ||
          newFilters.subscriptionTier !== filters.subscriptionTier ||
          newFilters.dateRange !== filters.dateRange ||
          newFilters.customStartDate !== filters.customStartDate ||
          newFilters.customEndDate !== filters.customEndDate);

      setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));

      if (shouldResetPage) {
        dispatch(setPage(1));
      }
      if (newFilters.limit !== undefined) {
        dispatch(setItemsPerPage(newFilters.limit));
      }
    },
    [filters, dispatch]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      dispatch(setPage(newPage));
    },
    [dispatch]
  );

  const handleItemsPerPageChange = useCallback(
    (newLimit) => {
      dispatch(setItemsPerPage(newLimit));
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    (sortParams) => {
      dispatch(setSort(sortParams));
      dispatch(setPage(1));
    },
    [dispatch]
  );

  const toggleChartVisibility = useCallback((chartName) => {
    setChartVisibility((prev) => ({
      ...prev,
      [chartName]: !prev[chartName],
    }));
  }, []);

  const industryChartData = Object.entries(industryDistribution).map(
    ([name, value]) => ({ name, value })
  );
  const locationChartData = Object.entries(locationDistribution).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <DashboardContainer>
      <Header>GTS Client Statistics Dashboard</Header>

      <FilterControls filters={filters} onFilterChange={handleFilterChange} />

      {error && <ErrorMessage message={error} />}

      <MetricsGrid>
        {loading ? (
          <>
            <LoadingMetricCard />
            <LoadingMetricCard />
            <LoadingMetricCard />
            <LoadingMetricCard />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Clients"
              value={totalClients.toLocaleString()}
            />
            <MetricCard
              title="Active Clients"
              value={activeClientCount.toLocaleString()}
            />
            <MetricCard
              title="Avg. Client Tenure"
              value={`${clientTenure.toFixed(1)} months`}
            />
            <MetricCard
              title="Overall Growth"
              value={`+${
                monthlyGrowth.length > 0
                  ? monthlyGrowth[monthlyGrowth.length - 1].value
                  : 0
              } this period`}
            />
          </>
        )}
      </MetricsGrid>

      <ChartsContainer>
        <div>
          <ChartHeader>
            <h3>Clients by Industry</h3>
            {/* --- CRITICAL CHANGE 2: Update ToggleButton usage to use $active --- */}
            <ToggleButton
              $active={chartVisibility.industry}
              onClick={() => toggleChartVisibility("industry")}
              aria-label={
                chartVisibility.industry
                  ? "Hide Clients by Industry chart"
                  : "Show Clients by Industry chart"
              }>
              {chartVisibility.industry ? "Hide" : "Show"}
            </ToggleButton>
          </ChartHeader>
          {loading ? (
            <LoadingChart />
          ) : (
            chartVisibility.industry && (
              <ClientChart
                title="Clients by Industry"
                data={industryChartData}
                type="Pie"
                dataKey="value"
                nameKey="name"
              />
            )
          )}
        </div>

        <div>
          <ChartHeader>
            <h3>Clients by Location</h3>
            {/* --- CRITICAL CHANGE 3: Update ToggleButton usage to use $active --- */}
            <ToggleButton
              $active={chartVisibility.location}
              onClick={() => toggleChartVisibility("location")}
              aria-label={
                chartVisibility.location
                  ? "Hide Clients by Location chart"
                  : "Show Clients by Location chart"
              }>
              {chartVisibility.location ? "Hide" : "Show"}
            </ToggleButton>
          </ChartHeader>
          {loading ? (
            <LoadingChart />
          ) : (
            chartVisibility.location && (
              <ClientChart
                title="Clients by Location"
                data={locationChartData}
                type="Bar"
                dataKey="value"
                nameKey="name"
              />
            )
          )}
        </div>

        <div>
          <ChartHeader>
            <h3>Monthly Client Growth</h3>
            {/* --- CRITICAL CHANGE 4: Update ToggleButton usage to use $active --- */}
            <ToggleButton
              $active={chartVisibility.monthlyGrowth}
              onClick={() => toggleChartVisibility("monthlyGrowth")}
              aria-label={
                chartVisibility.monthlyGrowth
                  ? "Hide Monthly Client Growth chart"
                  : "Show Monthly Client Growth chart"
              }>
              {chartVisibility.monthlyGrowth ? "Hide" : "Show"}
            </ToggleButton>
          </ChartHeader>
          {loading ? (
            <LoadingChart />
          ) : (
            chartVisibility.monthlyGrowth && (
              <ClientChart
                title="Monthly Client Growth"
                data={monthlyGrowth}
                type="Line"
                dataKey="value"
                nameKey="name"
              />
            )
          )}
        </div>
      </ChartsContainer>

      <ClientList
        page={currentPage}
        setPage={handlePageChange}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={handleItemsPerPageChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSort={handleSortChange}
      />
    </DashboardContainer>
  );
};

export default ClientStats;
