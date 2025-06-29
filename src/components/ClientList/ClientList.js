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
  selectCurrentPage,
  selectItemsPerPage,
  selectLoading,
  selectSortBy,
  selectSortOrder,
  selectTotalClients,
} from "../../features/clients/clientSlice";

const TableWrapper = styled(Paper)`
  margin-top: 40px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  // FIX: Change overflow: hidden to overflow: auto or overflow-x: auto
  overflow: auto; /* Allows both horizontal and vertical scrolling if content overflows */
`;

const ClientList = ({ setPage, setItemsPerPage, setSort }) => {
  const { clients } = useSelector(selectClientData);
  const totalClients = useSelector(selectTotalClients);
  const currentPage = useSelector(selectCurrentPage);
  const itemsPerPage = useSelector(selectItemsPerPage);
  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);
  const loading = useSelector(selectLoading);

  const handleRequestSort = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSort({ sortBy: property, sortOrder: isAsc ? "desc" : "asc" });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
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
