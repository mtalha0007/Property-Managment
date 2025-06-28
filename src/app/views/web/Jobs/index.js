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
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import { styled } from "@mui/system";

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

const tableHead = [
  "Id",
  "Job Name",
  "Property Name",
  "Position/Skill",
  "Date",
  // "Status",
  "Contact No",
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
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [openSignDialog, setOpenSignDialog] = useState(false);
  const rowsPerPage = 6;
  const theme = useTheme();
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const sigPadRef = useRef({});

  const handleSignClick = (job) => {
    setSelectedJob(job);
    setOpenSignDialog(true);
  };

  const clearSignature = () => {
    sigPadRef.current.clear();
  };

  const submitSignature = () => {
    const base64Signature = sigPadRef.current.toDataURL();
    console.log("Signature Base64:", base64Signature);
    setOpenSignDialog(false);
  };

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
    getJobs(page + 1, limit, id, search, "unassigned");
  }, [page, limit, search]);

  const handleSearch = () => {
    getJobs(1, limit, id, search, status);
    handleClose();
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const filteredData = data.filter((item) =>
    item.skill_type.toLowerCase().includes(search.toLowerCase())
  );

  const ApplyOnJob = async () => {
    const obj = {
      job_id: selectedJob?._id,
    };
    try {
      const data = await JobServices.applyOnJob(obj);
      SuccessToaster(data.message);
      setOpenDialog(false);
      getJobs(page + 1, limit, id, search, "unassigned");
    } catch (error) {
      ErrorToaster(error);
    }
  };

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
            Job List
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
              {/* <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "25px",
        }}
      >
        <Grid item xs={12} sm={6}>
          <Grid
            container
            alignItems="center"
            bgcolor={Colors.backgroundColor}
            border="1px solid rgba(10, 10, 10, 0.1)"
            borderRadius={2}
            boxShadow="0px 0px 100px 0px rgba(0,0,0,0.1)"
            padding="10px"
          >
            <FilterAltIcon />
            <Box sx={{ width: "1px", height: "40px", backgroundColor: "lightgray", mx: 1 }} />
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
                },
                input: { padding: "0px" },
              }}
              value={id}
              placeholder="ID"
              onChange={(e) => setId(e.target.value)}
            />
           
            <TextField
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button sx={{ color: Colors.red, mx: 1 }} startIcon={<RestoreIcon />} onClick={handleReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mt: 1 }}>
            Search
          </Button>
        </Grid>
      </Grid> */}

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {loading ? (
                  <Loader width="40px" height="40px" color={Colors.primary} />
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
                          {/* <Box sx={{ display: "flex", mb: 1 }}>
                            <Typography
                              sx={{ fontWeight: "bold", width: "100px" }}
                            >
                              Status:
                            </Typography>
                            <Typography>{row.status}</Typography>
                          </Box> */}
                          <Box sx={{ display: "flex", mb: 1 }}>
                            <Typography
                              sx={{ fontWeight: "bold", width: "100px" }}
                            >
                              Contact:
                            </Typography>
                            <Typography>{row.cp_phone}</Typography>
                          </Box>
                          {row.isApplied == true ? (
                            <>
                              <Box
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                sx={{
                                  border: `1px solid ${Colors.seaGreen}`,
                                  color: Colors.seaGreen,
                                  p: 1,
                                  textAlign: "center",
                                  width: "100px",
                                  fontSize: "15px",
                                  cursor: "pointer",
                                  borderRadius: "15px",
                                }}
                              >
                                Applied
                              </Box>
                            </>
                          ) : (
                            <>
                              <Box
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedJob(row);
                                  setOpenDialog(true);
                                }}
                                sx={{
                                  border: `1px solid ${Colors.primary}`,
                                  color: Colors.primary,
                                  p: 1,
                                  textAlign: "center",
                                  width: "100px",
                                  fontSize: "15px",
                                  cursor: "pointer",
                                  borderRadius: "15px",
                                }}
                              >
                                Apply
                              </Box>
                            </>
                          )}
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
                {/* <Box
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
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="unassigned">Unassigned</MenuItem>
            </CustomSelect>
          </FormControl> */}
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
                        {/* <TableCell sx={{ textAlign: "center" }}>
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
                        </TableCell> */}
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
                            {row.isApplied == true ? (
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
                                  }}
                                >
                                  Applied
                                </Box>
                                {/* <Box
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSignClick(row);
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
                                  Sign
                                </Box> */}
                              </>
                            ) : (
                              <>
                                <Box
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedJob(row);
                                    setOpenDialog(true);
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
                                  Apply
                                </Box>
                                {/* <Box
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSignClick(row);
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
                                  Sign
                                </Box> */}
                              </>
                            )}
                          </Typography>
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
                  rowsPerPageOptions={[]} // Removes rows per page selector
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

      <SimpleDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        border={`4px solid ${Colors.primary}`}
        title="Are You Sure?"
      >
        <Box sx={{ textAlign: "center" }}>
          Are You Sure you want to apply on this
        </Box>
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Box sx={{ color: Colors.primary }}>Job#{selectedJob?.num_id}</Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center ",
            gap: "20px",
            mt: 5,
          }}
        >
          <Box
            onClick={() => {
              setOpenDialog(false);
            }}
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
            onClick={ApplyOnJob}
          >
            Yes, Confirm
          </Box>
        </Box>
      </SimpleDialog>

      <Dialog
        open={openSignDialog}
        onClose={() => setOpenSignDialog(false)}
        fullWidth
        maxWidth="sm"
        sx={{ ". MuiPaper-elevation": { borderRadius: "20px !important" } }}
      >
        <DialogTitle>Sign Job#{selectedJob?.num_id}</DialogTitle>
        <DialogContent>
          <SignaturePad
            ref={sigPadRef}
            canvasProps={{
              width: 550,
              height: 200,
              style: { border: "1px solid #000" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={clearSignature} color="secondary">
            Clear
          </Button>
          <Button onClick={submitSignature} color="primary">
            Submit Signature
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default App;
