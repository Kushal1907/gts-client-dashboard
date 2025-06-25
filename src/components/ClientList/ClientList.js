// src/components/ClientList/ClientList.js

import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  selectClientData,
  selectCurrentPage, // Direct import
  selectItemsPerPage, // Main client data
  selectLoading, // Direct import
  selectSortBy, // Direct import
  selectSortOrder, // Direct import
  selectTotalClients, // Direct import
} from "../../features/clients/clientSlice"; // Ensure correct path

const TableWrapper = styled(Paper)`
  margin-top: 40px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  // FIX: Change overflow: hidden to overflow: auto or overflow-x: auto
  overflow: auto; /* Allows both horizontal and vertical scrolling if content overflows */
`;

// ClientList now receives values directly from Redux, not as props from ClientStats' local state
const ClientList = ({ setPage, setItemsPerPage, setSort }) => {
  // Remove page, itemsPerPage, sortBy, sortOrder from props
  const { clients } = useSelector(selectClientData); // get clients array
  const totalClients = useSelector(selectTotalClients); // Total count from Redux
  const currentPage = useSelector(selectCurrentPage); // Current page from Redux
  const itemsPerPage = useSelector(selectItemsPerPage); // Items per page from Redux
  const sortBy = useSelector(selectSortBy); // Sort by from Redux
  const sortOrder = useSelector(selectSortOrder); // Sort order from Redux
  const loading = useSelector(selectLoading);

  const handleRequestSort = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSort({ sortBy: property, sortOrder: isAsc ? "desc" : "asc" });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1); // MUI page is 0-indexed, our Redux is 1-indexed
  };

  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <TableWrapper elevation={3}>
      <Typography variant="h5" gutterBottom sx={{ marginBottom: 2 }}>
        Client Details List
      </Typography>
      {loading && clients.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading clients list...
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="client table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "name"}
                      direction={sortBy === "name" ? sortOrder : "asc"}
                      onClick={() => handleRequestSort("name")}>
                      Client Name
                      {sortBy === "name" ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortOrder === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "industry"}
                      direction={sortBy === "industry" ? sortOrder : "asc"}
                      onClick={() => handleRequestSort("industry")}>
                      Industry
                      {sortBy === "industry" ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortOrder === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "location"}
                      direction={sortBy === "location" ? sortOrder : "asc"}
                      onClick={() => handleRequestSort("location")}>
                      Location
                      {sortBy === "location" ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortOrder === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "subscription_tier"}
                      direction={
                        sortBy === "subscription_tier" ? sortOrder : "asc"
                      }
                      onClick={() => handleRequestSort("subscription_tier")}>
                      Tier
                      {sortBy === "subscription_tier" ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortOrder === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "signup_date"}
                      direction={sortBy === "signup_date" ? sortOrder : "asc"}
                      onClick={() => handleRequestSort("signup_date")}>
                      Signup Date
                      {sortBy === "signup_date" ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortOrder === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Is Active</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 3 }}>
                      No clients found matching the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.industry}</TableCell>
                      <TableCell>{client.location}</TableCell>
                      <TableCell>{client.subscription_tier}</TableCell>
                      <TableCell>{client.signup_date}</TableCell>
                      <TableCell align="center">
                        {client.is_active ? "Yes" : "No"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalClients}
            rowsPerPage={itemsPerPage}
            page={currentPage - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </TableWrapper>
  );
};

export default ClientList;
