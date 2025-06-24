// src/components/ClientStats/FilterControls.js

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import styled from "styled-components";

const FilterContainer = styled(Box)`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

const FilterControls = ({ filters, onFilterChange }) => {
  const {
    searchTerm,
    industry,
    subscriptionTier,
    dateRange,
    customStartDate,
    customEndDate,
  } = filters;

  const handleInputChange = (e) => {
    onFilterChange({ [e.target.name]: e.target.value });
  };

  const handleDateChange = (dateType) => (date) => {
    onFilterChange({ [dateType]: date });
  };

  const handleClearFilters = () => {
    onFilterChange({
      searchTerm: "",
      industry: "all",
      subscriptionTier: "all",
      dateRange: "all",
      customStartDate: null,
      customEndDate: null,
      page: 1,
    });
  };

  return (
    <FilterContainer>
      {/*
        CRITICAL CHANGE FOR MUI GRID V2:
        1. Add `columns` prop to the Grid container (e.g., columns={12} for a 12-column grid system).
        2. Replace `xs`, `sm`, `md` props on individual Grid items with `sx={{ gridColumn: { breakpoint: 'span X' } }}`.
           'span X' means the item will span X columns within the container's defined columns.
      */}
      <Grid container spacing={2} alignItems="flex-end" columns={12}>
        {" "}
        {/* Define the total columns for the grid system */}
        {/* Search Term */}
        <Grid
          sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
          <TextField
            label="Search Clients"
            variant="outlined"
            fullWidth
            name="searchTerm"
            value={searchTerm}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Industry Filter */}
        <Grid
          sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Industry</InputLabel>
            <Select
              label="Industry"
              name="industry"
              value={industry}
              onChange={handleInputChange}>
              <MenuItem value="all">All Industries</MenuItem>
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
              <MenuItem value="Retail">Retail</MenuItem>
              <MenuItem value="Manufacturing">Manufacturing</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Subscription Tier Filter */}
        <Grid
          sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Subscription Tier</InputLabel>
            <Select
              label="Subscription Tier"
              name="subscriptionTier"
              value={subscriptionTier}
              onChange={handleInputChange}>
              <MenuItem value="all">All Tiers</MenuItem>
              <MenuItem value="Basic">Basic</MenuItem>
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Date Range Filter */}
        <Grid
          sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Signup Date Range</InputLabel>
            <Select
              label="Signup Date Range"
              name="dateRange"
              value={dateRange}
              onChange={handleInputChange}>
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="lastMonth">Last Month</MenuItem>
              <MenuItem value="last3Months">Last 3 Months</MenuItem>
              <MenuItem value="last6Months">Last 6 Months</MenuItem>
              <MenuItem value="lastYear">Last Year</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Custom Date Range Pickers (conditionally rendered) */}
        {dateRange === "custom" && (
          <>
            <Grid
              sx={{
                gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" },
              }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={customStartDate}
                  onChange={handleDateChange("customStartDate")}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth variant="outlined" />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid
              sx={{
                gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" },
              }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={customEndDate}
                  onChange={handleDateChange("customEndDate")}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth variant="outlined" />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </>
        )}
        {/* Clear Filters Button */}
        {/* Adjusted gridColumn for custom date range visibility */}
        <Grid
          sx={{
            gridColumn: {
              xs: "span 12",
              sm: "span 6",
              md: dateRange === "custom" ? "span 6" : "span 3",
            },
          }}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleClearFilters}
            sx={{ height: "56px" }} // Match TextField height
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </FilterContainer>
  );
};

export default FilterControls;
