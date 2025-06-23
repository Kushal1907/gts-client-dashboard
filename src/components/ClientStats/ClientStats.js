// src/components/ClientStats/ClientStats.js
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  fetchClientData,
  selectClientData,
  selectError,
  selectLoading,
} from "../../features/clients/clientSlice";
import ErrorMessage from "../Shared/ErrorMessage";
import LoadingChart from "../Shared/LoadingChart"; // Skeleton for charts
import LoadingMetricCard from "../Shared/LoadingMetricCard"; // Skeleton for metric cards
import ClientChart from "./ClientChart";
import FilterControls from "./FilterControls";
import MetricCard from "./MetricCard";

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Arial", sans-serif;
  color: #333;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  min-height: 80vh; /* Ensure some height for loading states */

  @media (max-width: 768px) {
    padding: 15px;
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
  margin-bottom: 10px; /* Adjust spacing as needed */
  h3 {
    margin: 0;
    padding-right: 10px; /* Space between title and button */
  }
`;

const ToggleButton = styled.button`
  background-color: ${(props) => (props.active ? "#007bff" : "#ccc")};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#0056b3" : "#999")};
  }
`;

const ClientStats = () => {
  const dispatch = useDispatch();
  const {
    totalClients,
    activeClients,
    clientTenure,
    industryDistribution,
    locationDistribution,
    monthlyGrowth,
  } = useSelector(selectClientData);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [filters, setFilters] = useState({
    searchTerm: "",
    industry: "all",
    subscriptionTier: "all",
    dateRange: "all",
  });

  // State for chart visibility
  const [chartVisibility, setChartVisibility] = useState({
    industry: true,
    location: true,
    monthlyGrowth: true,
  });

  // Debounce for search term to avoid excessive API calls on every keystroke
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [initialLoad, setInitialLoad] = useState(true); // Flag to prevent initial immediate fetch on mount

  // Effect for debouncing search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [filters.searchTerm]);

  // Effect to fetch data when relevant filters change (excluding direct searchTerm for debounced effect)
  useEffect(() => {
    if (!initialLoad) {
      dispatch(
        fetchClientData({
          ...filters,
          searchTerm: debouncedSearchTerm, // Use debounced term for API call
        })
      );
    } else {
      setInitialLoad(false); // After first render, allow fetches
      dispatch(
        fetchClientData({ ...filters, searchTerm: debouncedSearchTerm })
      );
    }
  }, [
    dispatch,
    filters.industry,
    filters.subscriptionTier,
    filters.dateRange,
    debouncedSearchTerm,
  ]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  }, []);

  const toggleChartVisibility = useCallback((chartName) => {
    setChartVisibility((prev) => ({
      ...prev,
      [chartName]: !prev[chartName],
    }));
  }, []);

  // Convert distribution objects to array format for Recharts Pie/Bar charts
  const industryChartData = Object.entries(industryDistribution).map(
    ([name, value]) => ({ name, value })
  );
  const locationChartData = Object.entries(locationDistribution).map(
    ([name, value]) => ({ name, value })
  );
  // monthlyGrowth is already formatted as [{ name, value }] in clientSlice

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
          </>
        ) : (
          <>
            <MetricCard
              title="Total Clients"
              value={totalClients.toLocaleString()}
            />
            <MetricCard
              title="Active Clients"
              value={activeClients.toLocaleString()}
            />
            <MetricCard
              title="Avg. Client Tenure"
              value={`${clientTenure.toFixed(1)} months`}
            />
          </>
        )}
      </MetricsGrid>

      <ChartsContainer>
        <div>
          <ChartHeader>
            <h3>Clients by Industry</h3>
            <ToggleButton
              active={chartVisibility.industry}
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
            <ToggleButton
              active={chartVisibility.location}
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
            <ToggleButton
              active={chartVisibility.monthlyGrowth}
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
    </DashboardContainer>
  );
};

export default ClientStats;
