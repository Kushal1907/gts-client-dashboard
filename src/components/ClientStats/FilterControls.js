import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import styled from "styled-components";

const FiltersContainer = styled(Box)`
  // Style the MUI Box with styled-components
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const FilterControls = ({ filters, onFilterChange }) => {
  const handleIndustryChange = (event) => {
    onFilterChange({ industry: event.target.value });
  };

  const handleSubscriptionTierChange = (event) => {
    onFilterChange({ subscriptionTier: event.target.value });
  };

  const handleDateRangeChange = (event) => {
    const range = event.target.value;
    onFilterChange({
      dateRange: range,
      customStartDate: null,
      customEndDate: null,
    });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ searchTerm: e.target.value });
  };

  const handleClearFilters = () => {
    onFilterChange({
      searchTerm: "",
      industry: "all",
      subscriptionTier: "all",
      dateRange: "all",
      customStartDate: null,
      customEndDate: null,
    });
  };

  const handleCustomStartDateChange = (date) => {
    onFilterChange({
      customStartDate: date,
      dateRange: "custom",
    });
  };

  const handleCustomEndDateChange = (date) => {
    onFilterChange({
      customEndDate: date,
      dateRange: "custom",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {" "}
      {/* Wrap with LocalizationProvider */}
      <FiltersContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search Client Name"
              variant="outlined"
              value={filters.searchTerm}
              onChange={handleSearchChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Filter by Industry"
              value={filters.industry}
              onChange={handleIndustryChange}
              variant="outlined"
              size="small">
              <MenuItem value="all">All Industries</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
              <MenuItem value="Manufacturing">Manufacturing</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Subscription Tier"
              value={filters.subscriptionTier}
              onChange={handleSubscriptionTierChange}
              variant="outlined"
              size="small">
              <MenuItem value="all">All Tiers</MenuItem>
              <MenuItem value="Basic">Basic</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
              <MenuItem value="Enterprise">Enterprise</MenuItem>
              <MenuItem value="Free">Free</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Signup Date Range"
              value={filters.dateRange}
              onChange={handleDateRangeChange}
              variant="outlined"
              size="small">
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="last_3_months">Last 3 Months</MenuItem>
              <MenuItem value="last_6_months">Last 6 Months</MenuItem>
              <MenuItem value="this_year">This Year</MenuItem>
              <MenuItem value="last_year">Last Year</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem> {}
            </TextField>
          </Grid>

          {}
          {filters.dateRange === "custom" && (
            <>
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="Start Date"
                  value={filters.customStartDate}
                  onChange={handleCustomStartDateChange}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="End Date"
                  value={filters.customEndDate}
                  onChange={handleCustomEndDateChange}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={6} md={filters.dateRange === "custom" ? 1 : 3}>
            {" "}
            {}
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleClearFilters}
              sx={{ height: "40px" }}>
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </FiltersContainer>
    </LocalizationProvider>
  );
};

export default FilterControls;
