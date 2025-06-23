// src/components/ClientStats/ClientStats.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  fetchClientData,
  selectClientData,
  selectError,
  selectLoading,
} from "../../features/clients/clientSlice";
import ErrorMessage from "../Shared/ErrorMessage";
import LoadingSpinner from "../Shared/LoadingSpinner";
import ClientChart from "./ClientChart";
import FilterControls from "./FilterControls";
import MetricCard from "./MetricCard";

const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Arial", sans-serif; /* Use a default font or GTS's specified font */
  color: #333;
  background-color: #f5f7fa; /* Light background for the dashboard */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

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
  justify-content: center; /* Center cards if there are not enough to fill a row */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
  margin-bottom: 30px; /* Spacing below charts */

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
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

  // Initial filter states
  const [filters, setFilters] = useState({
    dateRange: "all", // Not implemented yet, but placeholder
    industry: "all",
    subscriptionTier: "all",
  });

  // Fetch data whenever filters change
  useEffect(() => {
    dispatch(fetchClientData(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

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

      <MetricsGrid>
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
      </MetricsGrid>

      <ChartsContainer>
        <ClientChart
          title="Clients by Industry"
          data={industryChartData}
          type="Pie"
          dataKey="value"
          nameKey="name"
        />
        <ClientChart
          title="Clients by Location"
          data={locationChartData}
          type="Bar"
          dataKey="value"
          nameKey="name"
        />
        <ClientChart
          title="Monthly Client Growth"
          data={monthlyGrowth}
          type="Line"
          dataKey="value"
          nameKey="name"
        />
      </ChartsContainer>
    </DashboardContainer>
  );
};

export default ClientStats;
