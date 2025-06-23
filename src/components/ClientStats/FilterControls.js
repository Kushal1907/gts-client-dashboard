// src/components/ClientStats/FilterControls.js
import styled from "styled-components";

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap; /* Allow filters to wrap on smaller screens */
  justify-content: flex-start; /* Align items to the start */

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start; /* Align items to the start */
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1; /* Allow items to grow */
  min-width: 180px; /* Minimum width for each select/input */

  label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
    font-size: 0.9em;
  }

  select,
  input[type="text"] {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
    cursor: text; /* For input */
    background-color: #fcfcfc;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    appearance: none; /* Remove default select arrow */
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 18px;
    position: relative; /* For custom arrow positioning */
  }

  select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000' width='18px' height='18px'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
  }

  input[type="text"] {
    &::placeholder {
      color: #bbb;
    }
  }

  select:focus,
  input[type="text"]:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const FilterControls = ({ filters, onFilterChange }) => {
  const industries = [
    "All",
    "IT",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
  ];
  const subscriptionTiers = ["All", "Free", "Basic", "Premium", "Enterprise"];
  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "last_3_months", label: "Last 3 Months" },
    { value: "last_6_months", label: "Last 6 Months" },
    { value: "this_year", label: "This Year" },
    { value: "last_year", label: "Last Year" },
  ];

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    // Convert 'All' to 'all' for internal logic if applicable
    onFilterChange({ [name]: value === "All" ? "all" : value });
  };

  const handleSearchChange = (e) => {
    // Implement debouncing for search input to avoid too many API calls
    // For simplicity, we'll directly update here, but for production, debouncing is recommended.
    onFilterChange({ searchTerm: e.target.value });
  };

  return (
    <FilterContainer>
      <SelectWrapper>
        <label htmlFor="search-input">Search Client Name:</label>
        <input
          id="search-input"
          type="text"
          name="searchTerm"
          placeholder="e.g., Innovate Solutions"
          value={filters.searchTerm || ""}
          onChange={handleSearchChange}
          aria-label="Search by Client Name"
        />
      </SelectWrapper>

      <SelectWrapper>
        <label htmlFor="industry-filter">Industry:</label>
        <select
          id="industry-filter"
          name="industry"
          value={filters.industry === "all" ? "All" : filters.industry}
          onChange={handleSelectChange}
          aria-label="Filter by Industry">
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </SelectWrapper>

      <SelectWrapper>
        <label htmlFor="subscription-filter">Subscription Tier:</label>
        <select
          id="subscription-filter"
          name="subscriptionTier"
          value={
            filters.subscriptionTier === "all"
              ? "All"
              : filters.subscriptionTier
          }
          onChange={handleSelectChange}
          aria-label="Filter by Subscription Tier">
          {subscriptionTiers.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </select>
      </SelectWrapper>

      <SelectWrapper>
        <label htmlFor="date-range-filter">Signup Date:</label>
        <select
          id="date-range-filter"
          name="dateRange"
          value={filters.dateRange}
          onChange={handleSelectChange}
          aria-label="Filter by Signup Date Range">
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </SelectWrapper>
    </FilterContainer>
  );
};

export default FilterControls;
