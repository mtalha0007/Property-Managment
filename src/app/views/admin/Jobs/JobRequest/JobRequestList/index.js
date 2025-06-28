import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Box,
  Select,
  Typography,
  Button,
  MenuItem,
  TablePagination,
  Grid,
  TextField,
  IconButton,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import { styled } from "@mui/system";

import Colors from "../../../../../assets/styles";
import { Svgs } from "../../../../../assets/images";
import { useNavigate } from "react-router-dom";
import JobServices from "../../../../../api/JobServices/job.index";
import { ErrorHandler } from "../../../../../utils/ErrorHandler";
import Loader from "../../../../../components/Loader";
import moment from "moment/moment";
import LaunchIcon from "@mui/icons-material/Launch";

const tableHead = [
  "Id",
  "Job Name",
  "Property Name",
  "Position/Skill",
  "Date",
  "Status",
  "Contact No",
  "Action",
  // "Applicant List",
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
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const rowsPerPage = 6;
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const handleReset = () => {
    setStatus("");
    setSearch("");
    setId("");
    getJobs(1, limit, "", "", "");
  };

  const getJobs = async (
    pageParam = 1,
    limitParam = 10,
    idParam = "",
    searchParam = "",
    statusParam = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await JobServices.getJobs(
        pageParam,
        limitParam,
        idParam,
        searchParam,
        statusParam
      );
      setData(data.list);
      setCount(data.count);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs(page + 1, limit, id, search, status);
  }, [page, limit, search]);

  const handleSearch = () => {
    getJobs(1, limit, id, search, status);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const filteredData = data.filter((item) =>
    item.skill_type.toLowerCase().includes(search.toLowerCase())
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
          Job Request
        </Typography>
        <Button
          onClick={() => navigate("/jobrequest/create")}
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
          gap: "25px",
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
          <FormControl sx={{ minWidth: 120, mx: 1 }}>
            <CustomSelect
              displayEmpty
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="">Status</MenuItem>
              {/* <MenuItem value="completed">Completed</MenuItem> */}
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="unassigned">Unassigned</MenuItem>
            </CustomSelect>
          </FormControl>
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
                  paddingRight: "50px !important",
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
          {/* <TextField
              sx={{ mt: "22px" }}
              placeholder="Search By Skill"
              InputProps={{
                sx: {
                  input: {
                    paddingTop: "7px !important",
                    paddingBottom: "7px !important",
                    paddingRight: "50px !important",
                  },
                },
              }}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            /> */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ mt: 2.7, ml: 2 }}
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
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      width: "150px",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {column}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={tableHead.length}>
                  <Loader width="40px" height="40px" color={Colors.primary}  />
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => navigate(`/jobrequest/details/${row._id}`)}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.num_id}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.name ? row.name : "-"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.property_name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.skill_type}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {moment(row.created_at).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        backgroundColor:
                          row.status === "pending" ||
                          row.status === "completed" ||
                          row.status === "inprogress"
                            ? Colors.seaGreen
                            : Colors.yellow,
                        borderRadius: "20px",
                        textAlign: "center",
                        px: 2,

                        py: 0.5,
                        color: Colors.white,
                        fontSize: "12px",
                        textTransform: "capitalize ",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {row.status === "pending" ||
                      row.status === "inprogress" ||
                      row.status === "completed"
                        ? "Assigned"
                        : row.status}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {"+" + row.cp_phone}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {/* {row.status} */}
                      {row.status == "unassigned" ? (
                        <>
                          <Box
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/jobrequest/update/${row._id}`);
                            }}
                            dangerouslySetInnerHTML={{ __html: Svgs["edit"] }}
                          ></Box>

                          <Box
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/jobrequest/assignto", { state: row });
                            }}
                            sx={{
                              border: `1px solid ${Colors.primary}`,
                              color: Colors.primary,
                              px: 2,
                              fontSize: "15px",
                              cursor: "pointer",
                              borderRadius: "15px",
                            }}
                          >
                            Assign To
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            sx={{
                              border: `1px solid ${Colors.seaGreen}`,
                              color: Colors.seaGreen,
                              px: 2,
                              fontSize: "15px",
                              cursor: "pointer",
                              borderRadius: "15px",
                              ml: 2.3,
                            }}
                          >
                            Assigned
                          </Box>
                        </>
                      )}
                    </Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobrequest/applicant-list/${row?._id}`);
                      }}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <LaunchIcon />
                    </Box>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "text.secondary", ml: 2 }}>
          {`Showing ${page * limit + 1}-${Math.min(
            (page + 1) * limit,
            count
          )} of ${count}`}
        </Typography>
        <Box>
          <TablePagination
            component={Paper}
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
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
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
              ".css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar .MuiTablePagination-actions ":
                {
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
