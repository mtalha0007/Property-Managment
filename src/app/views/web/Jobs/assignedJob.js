import React, { useEffect, useRef, useState } from "react";
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
  useTheme,
  Card,
  CardContent,
  useMediaQuery,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  IconButton,
  InputLabel,
  Tooltip,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import { styled } from "@mui/system";
import { jwtDecode } from "jwt-decode";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

import Colors from "../../../assets/styles";
import { Svgs } from "../../../assets/images";
import { useNavigate } from "react-router-dom";
import JobServices from "../../../api/JobServices/job.index";
import { ErrorHandler } from "../../../utils/ErrorHandler";
import Loader from "../../../components/Loader";
import moment from "moment/moment";
import { ErrorToaster, SuccessToaster } from "../../../components/Toaster";
import SimpleDialog from "../../../components/Dialog";
import SignaturePad from "react-signature-canvas";
import { useAuth } from "../../../context";

const tableHead = [
  "Id",
  "Job Name",
  "Property Name",
  "Position/Skill",
  "Date",
  "Status",
  "Contact No",
//   "Action",
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

const AppliedJobs = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [openSignDialog, setOpenSignDialog] = useState(false);
  const theme = useTheme();
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();


  const decodedToken = jwtDecode(user.token);
  const userIdFromToken = decodedToken.employee_id;

  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleReset = () => {
    setStatus("");
    setSearch("");
    setId("");
    getJobs(1, limit, "", "", "unassigned");
    handleClose();
  };

  const getJobs = async (
    pageParam = 1,
    limitParam = 10,
    idParam = "",
    searchParam = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await JobServices.getAssignedJobs(
        pageParam,
        limitParam,
        idParam,
        searchParam
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
    getJobs(page + 1, limit, id, search, "unassigned");
  }, [page, limit, search]);

  const handleSearch = () => {
    getJobs(1, limit, id, search);
    handleClose();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const filteredData = data.filter((item) =>
    item.skill_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 8,
            ml: { md: 1, xs: 3 },
          }}
        >
          <Typography
            sx={{ fontSize: "26px", color: Colors.primary, fontWeight: "600" }}
          >
            Assigned Jobs
          </Typography>
        </Box>
        {matches ? (
          <>
            <Box sx={{ padding: 2 }}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton onClick={handleOpen}>
                      <FilterAltIcon />
                    </IconButton>
                    <Typography variant="body1">Search By Filters </Typography>
                  </Box>

                  <Dialog
                    open={open}
                    onClose={handleClose}
                    fullWidth
                    maxWidth="sm"
                  >
                    <DialogTitle>Filter Options</DialogTitle>
                    <DialogContent>
                      <Box display="flex" flexDirection="column" gap={2}>
                        {/* ID Input Field */}
                        <InputLabel>Search By ID</InputLabel>
                        <TextField
                          type="number"
                          value={id}
                          placeholder="ID"
                          onChange={(e) => setId(e.target.value)}
                          sx={{
                            border: "none",
                            outline: "none",
                            boxShadow: "none",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                border: "none",
                              },
                            },
                            input: {
                              padding: "0px",
                              border: "1px solid #c4c4c4",
                              padding: "12px",
                            },
                          }}
                        />
                        <InputLabel>Search By Skill</InputLabel>

                        {/* Search Input Field */}
                        <TextField
                          placeholder="Search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </Box>
                    </DialogContent>

                    {/* Modal Actions */}
                    <DialogActions>
                      {/* Reset Button */}
                      <Button
                        sx={{ color: Colors.red }}
                        startIcon={<RestoreIcon />}
                        onClick={handleReset}
                      >
                        Reset
                      </Button>

                      {/* Search Button */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                      >
                        Search
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {loading ? (
                    <Box sx={{margin:"0 auto"}}>

                  <Loader width="40px" height="40px"  color={Colors.primary} />
                    </Box>
                ) : data.length === 0 ? (
                  // Show "No data found" message if there's no data
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: Colors.gray, // Adjust the color as per your theme
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      No data found
                    </Typography>
                  </Grid>
                ) : (
                  data.map((row) => (
                    <Grid item xs={12} sm={6} key={row.id}>
                      <Card
                        sx={{
                          background: Colors.dashboardBgColor,
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                          borderRadius: "12px",
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: "flex", mb: 1 }}>
                            <Typography
                              sx={{ fontWeight: "bold", width: "100px" }}
                            >
                              ID:
                            </Typography>
                            <Typography>{row.num_id}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", mb: 1 }}>
                            <Typography
                              sx={{ fontWeight: "bold", width: "100px" }}
                            >
                              Job Name:
                            </Typography>
                            <Typography>{row.name || "-"}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", mb: 1 }}>
                            <Typography
                              sx={{ fontWeight: "bold", width: "100px" }}
                            >
                              Property:
                            </Typography>
                            <Typography>{row.property_name}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", mb: 1 }}>
                            <Typography
                              sx={{ fontWeight: "bold", width: "100px" }}
                            >
                              Skill:
                            </Typography>
                            <Typography>{row.skill_type}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", mb: 1 }}>
                            <Typography
                              sx={{ fontWeight: "bold", width: "100px" }}
                            >
                              Date:
                            </Typography>
                            <Typography>
                              {moment(row.created_at).format("DD-MM-YYYY")}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", mb: 1 }}>
                            <Typography
                              sx={{ fontWeight: "bold", width: "100px" }}
                            >
                              Status:
                            </Typography>
                            <Typography>{row.status}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", mb: 1 }}>
                            <Typography
                              sx={{ fontWeight: "bold", width: "100px" }}
                            >
                              Contact:
                            </Typography>
                            <Typography>{row.cp_phone}</Typography>
                          </Box>

                       
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>

              {/* Pagination */}
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
                  }}
                  rowsPerPageOptions={[]}
                  count={count}
                  rowsPerPage={limit}
                  page={page}
                  onPageChange={handlePageChange}
                />
              </Box>
            </Box>
          </>
        ) : (
          <>
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
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={tableHead.length}
                        sx={{ textAlign: "center" }}
                      >
                        No Data Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() =>
                          navigate(`/jobrequest/details/${row._id}`)
                        }
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
                          {row.cp_phone}
                        </TableCell>
                       
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
                  rowsPerPageOptions={[]}
                  count={count}
                  rowsPerPage={limit}
                  page={page}
                  onPageChange={handlePageChange}
                />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default AppliedJobs;
