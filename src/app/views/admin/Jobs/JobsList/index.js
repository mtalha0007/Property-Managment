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
  Grid,
  TextField,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import { styled } from "@mui/system";

import Colors from "../../../../assets/styles";
import { Svgs } from "../../../../assets/images";
import { useNavigate } from "react-router-dom";
import JobServices from "../../../../api/JobServices/job.index";
import { ErrorHandler } from "../../../../utils/ErrorHandler";
import Loader from "../../../../components/Loader";
import moment from "moment/moment";
import SimpleDialog from "../../../../components/Dialog";
import { DateField } from "../../../../components/DateField/index";
import { ErrorToaster, SuccessToaster } from "../../../../components/Toaster";
import BadgeIcon from "@mui/icons-material/Badge";
import { useForm } from "react-hook-form";

const tableHead = [
  "Job ID",
  "Job Name",
  "Property",
  "Skill Type",
  "Status",
  "Assigned To",
  "Start Date",
  "End Date",
  // "Action",
];
const today = moment().format("YYYY-MM-DD");
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
  const [loading, setLoading] = useState("");
  const [count, setCount] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [jobId, setJobId] = useState("");
  const [notes, setNotes] = useState("");

  let sleep = () => new Promise((r) => setTimeout(r, 1000));

  const [dateJoined, setDateJoined] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate("");
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleReset = () => {
    setStatus("");
    setSearch("");
    setId("");
    getJobs(1, limit, "", "", "assigned");
  };

  const getJobs = async (
    pageParam = 1,
    limitParam = 10,
    idParam = "",
    searchParam = "",
    status = ""
  ) => {
    setLoading(true);
    try {
      await sleep();
      const { data } = await JobServices.getJobs(
        pageParam,
        limitParam,
        idParam,
        searchParam,
        status
      );
      // Filter out jobs with status "unassigned"
      const filteredData = data.list.filter(
        (job) => job.status != "unassigned"
      );
      console.log(filteredData);
      setData(filteredData);
      // setCount(filteredData.count)
      // setData(data.list);
      setCount(data.count);
      setLoading(false);
    } catch (error) {
      ErrorHandler(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  console.log(moment(endDate).format("DD-MM-YYYY"));
  useEffect(() => {
    getJobs(page + 1, 10, id, search, "assigned");
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
  const UpdateStatus = async (data) => {
    const obj = {
      _id: jobId,
      end_date: data?.end_date,
      status: "completed",
      additional_notes: data?.notes,
    };
    try {
      const { data, responseCode, message } = await JobServices.updateJob(obj);
      if (responseCode === 200) {
        setOpenDialog(false);
        SuccessToaster(message);
        getJobs(page + 1, limit, id, search, status);
        setEndDate(null);
        reset()
      }
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error);
      console.log(error);
    }
  };
  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 8,
          // pl: 2,
        }}
      >
        <Typography
          sx={{ fontSize: "26px", color: Colors.primary, fontWeight: "600" }}
        >
          Jobs
        </Typography>
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
          boxShadow="0xp 0px 100px 0xp rgba(0,0,0,0.1)"
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
              placeholder="ID"
              value={id}
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
              placeholder="Status"
              onChange={(e) => {
                // setIdFilter(e.target.value);
                setStatus(e.target.value);
              }}
            >
              <MenuItem value="">Status</MenuItem>

              <MenuItem key="inprogress" value="inprogress">
                In Progress
              </MenuItem>

              <MenuItem key="completed" value="completed">
                Completed
              </MenuItem>
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
            onChange={(e) => {
              // setFilter(e.target.value);
              setSearch(e.target.value);
            }}
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
                    width: "100px",
                  }}
                >
                  {column}
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
                    <Typography
                      sx={{
                        backgroundColor:
                          row.status === "pending" ||
                          row.status === "inprogress"
                            ? Colors.yellow
                            : Colors.seaGreen,
                        borderRadius: "20px",
                        textAlign: "center",
                        px: 2,
                        width: "100px",
                        py: 0.5,
                        color: Colors.white,
                        fontSize: "12px",
                        textTransform: "capitalize ",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (row?.status != "completed") {
                          setOpenDialog(true);
                        }
                        setJobId(row?._id);
                      }}
                    >
                      {row.status === "pending" || row.status === "inprogress"
                        ? "In progress"
                        : row.status}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      textDecoration:
                        row.status === "inprogress" ? "underline" : "",
                      fontWeight: row.status === "inprogress" ? "bold" : "",
                      color: row.status === "inprogress" ? Colors.seaGreen : "",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (row.status === "inprogress") {
                        navigate("/jobrequest/assign-employee", { state: row });
                      }
                    }}
                  >
                    {row?.assigned_employees
                      ? row.assigned_employees
                          .map((item) => `${item.first_name} ${item.last_name}`)
                          .join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {moment(row.created_at).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.end_date
                      ? moment(row.end_date).format("DD-MM-YYYY")
                      : "-"}
                  </TableCell>
                  {/* <TableCell sx={{ textAlign: "center" }}>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/report/${row?._id}`)
                      }}
                    >
                      <BadgeIcon />
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

      <SimpleDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          reset()
        }}
        border={`4px solid ${Colors.primary}`}
        title="Are You Sure?"
      >
        <Box sx={{ textAlign: "center" }}>
          Are You Sure you want to complete this job?
        </Box>
        {/* <Box
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Box sx={{ color: Colors.primary }}>Job#4291</Box>
          <Box>assigned to</Box>
          <Box sx={{ color: Colors.primary }}>"John Mac"</Box>
        </Box> */}
        <Box component={"form"} onSubmit={handleSubmit(UpdateStatus)}>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <TextField
                placeholder="Select End Date"
                value={endDate}
                {...register("end_date", { required: "End Date is required" })}
                error={errors.end_date && true}
                helperText={errors?.end_date?.message}
                inputProps={{ min: today }}
                fullWidth
                type="date"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                multiline
                placeholder="Additonal Notes"
                // rows={4}
                margin="normal"
                {...register("notes")}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              gap: "8px",
              mt: 5,
            }}
          >
            <Box
              onClick={() => {
                setOpenDialog(false);
                setEndDate(null);
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
              No,Cancel
            </Box>
            <Button
              type="submit"
              sx={{
                color: Colors.black,
                background: Colors.primary,
                borderRadius: "10px",
                px: 5,
                py: 2,
                fontWeight: "bold",
                cursor: "pointer",
                ":hover":{
                  background: Colors.primary,
                }
              }}
              // onClick={UpdateStatus}
            >
              Yes,Confirm
            </Button>
          </Box>
        </Box>
      </SimpleDialog>
    </Box>
  );
};

export default App;
