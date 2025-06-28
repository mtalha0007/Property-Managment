import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  Box,
  Select,
  Typography,
  Button,
  MenuItem,
  TablePagination,
  Avatar,
  Grid,
  TextField,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import { styled } from "@mui/system";
import Colors from "../../../../assets/styles";
import { Svgs } from "../../../../assets/images";
import { useNavigate } from "react-router-dom";
import CompanyServices from "../../../../api/CompanyServices/company.index";
import { ErrorHandler } from "../../../../utils/ErrorHandler";
import SimpleDialog from "../../../../components/Dialog";
import moment from "moment";
import Loader from "../../../../components/Loader";
import { DateField } from "../../../../components/DateField";

const tableHead = [
  "ID",
  "Name",
  "Phone",
  "Email",
  "Create at",
  // "Status",
  "Action",
];

const CustomSelect = styled(Select)({
  "&.MuiSelect-root": {
    border: "none",
    outline: "none",
    boxShadow: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSelect-icon": {
    color: "black",
  },
  "& .MuiSelect-select": {
    padding: "8px 32px 8px 8px",
  },
});

const App = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [count, setCount] = useState(0);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const getCompanies = async (
    idParam = "",
    searchParam = "",
    dateFromParam = "",
    dateToParam = "",
    pageParam = 1,
    limitParam = 10
  ) => {
    setLoading(true);
    try {
      const { data } = await CompanyServices.getCompany(
        idParam,
        searchParam,
        dateFromParam ? moment(dateFromParam).format("YYYY-MM-DD") : "",
        dateToParam ? moment(dateToParam).format("YYYY-MM-DD") : "",
        pageParam,
        limitParam
      );
      setData(data.list);
      setCount(data.count);
      setLoading(false);
    } catch (error) {
      ErrorHandler(error);
      console.log(error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompanies(id, search, dateFrom, dateTo, page + 1, limit);
  }, [ search, page, limit]);

  const handleDeleteCompany = async () => {
    try {
      const { responseCode } = await CompanyServices.deleteCompany(selectedCompanyId);
      if (responseCode === 200) {
        setOpenDialog(false);
        getCompanies(id, search, dateFrom, dateTo, page + 1, limit);
      }
    } catch (error) {
      ErrorHandler(error);
      console.log(error?.message);
    }
  };

  const handleSearch = () => {
    setPage(0);
    getCompanies(id, search, dateFrom, dateTo, 1, limit);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleReset = () => {
    setId("");
    setSearch("");
    setDateFrom(null);
    setDateTo(null);
    setPage(0);
    getCompanies("", "", "", "", 1, limit);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography
          sx={{ fontSize: "26px", color: Colors.primary, fontWeight: "600" }}
        >
          Companies
        </Typography>
        <Button
          onClick={() => navigate("/companies/create")}
          variant="contained"
          color="primary"
          sx={{ mx: 1 }}
        >
          Add New
        </Button>
      </Box>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "15px",
        }}
      >
        <Grid
          item
          display="flex"
          alignItems="center"
          sx={{ mt: 3, pl: 2 }}
          bgcolor={Colors.backgroundColor}
          border="1px solid rgba(10, 10, 10, 0.1)"
          borderRadius={2}
          boxShadow="0px 0px 100px 0px rgba(0,0,0,0.1)"
        >
          <FilterAltIcon />
          <Box
            sx={{
              width: "1px",
              height: "40px",
              backgroundColor: "lightgray",
              mx: 1,
            }}
          />
          <Box sx={{ px: 2, width: "100px" }}>Filter By</Box>
          <Box
            sx={{
              width: "1px",
              height: "40px",
              backgroundColor: "lightgray",
              mx: 1,
            }}
          />
          <FormControl sx={{ width: "100px", padding: "0px" }}>
            <TextField
              type="number"
              sx={{
                border: "none",
                outline: "none",
                boxShadow: "none",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
                input: { padding: "0px" },
                "& .MuiInputBase-input": {
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                },
              }}
              value={id}
              placeholder="ID"
              onChange={(e) => setId(e.target.value)}
            />
          </FormControl>
          <Box
            sx={{
              width: "1px",
              height: "40px",
              backgroundColor: "lightgray",
              mx: 1,
            }}
          />
          <Grid item>
            <Box>
              <DateField
                placeholder="Select Date From"
                value={dateFrom}
                onChange={(newValue) => setDateFrom(newValue)}
              />
            </Box>
          </Grid>
          <Box
            sx={{
              width: "1px",
              height: "40px",
              backgroundColor: "lightgray",
              mx: 1,
            }}
          />
          <Grid item>
            <Box>
              <DateField
                placeholder="Select Date To"
                value={dateTo}
                onChange={(newValue) => setDateTo(newValue)}
              />
            </Box>
          </Grid>
          <Box
            sx={{
              width: "1px",
              height: "40px",
              backgroundColor: "lightgray",
              mx: 1,
            }}
          />
          <TextField
            placeholder="Search"
            InputProps={{
              sx: {
                input: {
                  paddingTop: "7px !important",
                  paddingBottom: "7px !important",
                  paddingRight: "20px !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
            }}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Box
            sx={{
              width: "1px",
              height: "40px",
              backgroundColor: "lightgray",
              mx: 1,
            }}
          />
          <Button
            sx={{ color: Colors.red, mx: 1 }}
            startIcon={<RestoreIcon />}
            onClick={handleReset}
          >
            Reset Filter
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ mt: 2.7 }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <TableContainer
        sx={{
          mt: 2,
          backgroundColor: Colors.backgroundColor,
          borderRadius: "10px",
        }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              {tableHead.map((column, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "600",
                    color: Colors.black,
                    textAlign: column === "Name" ? "left" : "center",
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={tableHead.length}>
                  <Loader width="40px" height="40px" color={Colors.primary}  />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => navigate("/companies/details", { state: row })}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.num_id}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Avatar src={baseUrl + row.logo} />
                      {row.name}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {"+" + row.phone}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.email}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {moment(row?.created_at).format("DD-MM-YYYY")}
                  </TableCell>
                  {/* <TableCell sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        backgroundColor:
                          row.status !== "active"
                            ? Colors.seaGreen
                            : Colors.red,
                        borderRadius: "20px",
                        textAlign: "center",
                        px: 2,
                        py: 0.5,
                        color: Colors.white,
                        fontSize: "12px",
                        textTransform: "capitalize",
                      }}
                    >
                     
                    </Typography>
                  </TableCell> */}
                  <TableCell sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/companies/update", { state: row });
                        }}
                        dangerouslySetInnerHTML={{ __html: Svgs["edit"] }}
                      />
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDialog(true);
                          setSelectedCompanyId(row._id);
                        }}
                        dangerouslySetInnerHTML={{ __html: Svgs["delete"] }}
                      />
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <SimpleDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        border={`4px solid ${Colors.primary}`}
        title="Are you sure you want to delete?"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            mt: 5,
          }}
        >
          <Box
            onClick={() => setOpenDialog(false)}
            sx={{
              background: Colors.black,
              color: Colors.primary,
              borderRadius: "10px",
              px: 5,
              py: 2,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            No, Cancel
          </Box>
          <Box
            sx={{
              color: Colors.black,
              background: Colors.primary,
              borderRadius: "10px",
              px: 5,
              py: 2,
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={handleDeleteCompany}
          >
            Yes, Confirm
          </Box>
        </Box>
      </SimpleDialog>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "text.secondary", ml: 2 }}>
          {`Showing ${page * limit + 1}-${Math.min((page + 1) * limit, count)} of ${count}`}
        </Typography>
        <Box>
          <TablePagination
            component="div"
            sx={{
              borderBottom: "none",
              border: "1px solid black",
              bgcolor: "transparent",
              ".MuiTablePagination-toolbar": {
                paddingLeft: 0,
              },
              ".MuiTablePagination-spacer": {
                flex: "none",
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                display: "none",
              },
              ".MuiTablePagination-actions": {
                marginLeft: 0,
              },
              ".MuiTablePagination-actions button:first-child": {
                borderRadius: 0,
                p: 0,
                pr: "8px",
                borderRight: "1px solid black",
              },
              ".css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar .MuiTablePagination-actions": {
                marginLeft: "14px !important",
              },
              ".MuiTablePagination-toolbar": {
                minHeight: "14px !important",
                padding: "0px !important",
              },
            }}
            rowsPerPageOptions={[]} // Removes rows per page selector
            count={count}
            rowsPerPage={limit}
            page={page}
            onPageChange={handlePageChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default App;
