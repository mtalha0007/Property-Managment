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
  Avatar,
  InputLabel,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import { styled } from "@mui/system";
import EmployeeServices from "../../../../../api/EmployeeServices/employee.index";
import Colors from "../../../../../assets/styles";
import { Svgs } from "../../../../../assets/images";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorHandler } from "../../../../../utils/ErrorHandler";
import moment from "moment/moment";
import Loader from "../../../../../components/Loader";
import SimpleDialog from "../../../../../components/Dialog";
import MessageIcon from "@mui/icons-material/Message";
import {
  SuccessToaster,
  ErrorToaster,
} from "../../../../../components/Toaster/index";
import { useForm } from "react-hook-form";
import JobServices from "../../../../../api/JobServices/job.index";

const tableHead = [
  "ID",
  "Name",
  "Email",
  "Skill Type",
  "Phone",
  "Status",
  "Date Joined",
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
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [id, setId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [skillType, setSkillType] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [search, setSearch] = useState("");
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const jobId = useParams()?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control: control1,
    reset,
  } = useForm();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const getEmployees = async (
    idParam = "",
    pageParam = 1,
    limitParam = 10,
    status = "",
    skillType = "",
    searchParam = "",
    jobId
  ) => {
    setLoading(true);
    try {
      const { data } = await EmployeeServices.getApplicantEmployee(
        idParam,
        pageParam,
        limitParam,
        status,
        skillType,
        searchParam,
        jobId
      );
      setData(data.list);
      setCount(data.count);
      setLoading(false);
    } catch (error) {
      ErrorHandler(error);
      console.log(error?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees(id, page + 1, limit, "", skillType, search, jobId);
  }, [page, limit, search]);

  const DeleteEmployee = async () => {
    try {
      const { data, responseCode, message } =
        await EmployeeServices.deleteEmployee(selectedEmployeeId);
      if (responseCode === 200) {
        setOpenDialog(false);
        SuccessToaster(message);
        getEmployees(id, page + 1, limit, search, jobId);
      }
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error);
      console.log(error?.message);
    }
  };

  const navigate = useNavigate();

  const handleReset = () => {
    setId("");
    setPage(0);
    setSkillType("");
    setSearch("");
    getEmployees("", 1, limit, "", "", search, jobId);
  };

  const handleSearch = () => {
    setPage(0);
    getEmployees(id, 1, limit, "", skillType, search, jobId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const sendMessage = async (FormData) => {
    const obj = {
      phone: phoneNum,
      message: FormData?.message,
    };
    try {
      const response = await EmployeeServices.SendMessage(obj);
      SuccessToaster(response.message);
      setOpenMessageDialog(false);
      reset();
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error);
    }
    console.log(obj);
  };

  const AssignJob = async () => {
    const obj = {
      job_id: jobId,
      employee_id: selectedEmployeeId?._id,
      //   employee_id: [selectedEmployeeId?._id],
    };
    console.log(obj);
    try {
      const { data, message } = await JobServices.approveJob(obj);
      SuccessToaster(message);
      setOpenAssignDialog(false);
      getEmployees(id, page + 1, limit, "", skillType, search, jobId);
      // navigate("/jobrequest");
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error);
      console.log(error);
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
          }}
        >
          <Typography
            sx={{ fontSize: "26px", color: Colors.primary, fontWeight: "600" }}
          >
            Applicant List
          </Typography>
          <Button
            onClick={() => navigate("/employees/create")}
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
              {/* <CustomSelect
              displayEmpty
              value={id}
              onChange={(e) => setId(e.target.value)}
              renderValue={(selected) => (selected ? selected : "ID")}
            >
              <MenuItem value="">ID</MenuItem>
              {data.map((item) => (
                <MenuItem key={item.num_id} value={item.num_id}>
                  {item.num_id}
                </MenuItem>
              ))}
            </CustomSelect> */}

              <TextField
                type="number"
                sx={{
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  "& .MuiOutlinedInput-root": {
                    padding: "0px",
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
                value={skillType}
                onChange={(e) => setSkillType(e.target.value)}
                renderValue={(selected) => (selected ? selected : "Skill Type")}
              >
                <MenuItem value="">Skill Type</MenuItem>
                <MenuItem key="Leasing Consultant" value="Leasing Consultant">
                  Leasing Consultant
                </MenuItem>
                <MenuItem
                  key="Lead Maintenance/Asst Maint"
                  value="Lead Maintenance/Asst Maint"
                >
                  Lead Maintenance/Asst Maint
                </MenuItem>
                <MenuItem
                  key="Grounds/Housekeeping"
                  value="Grounds/Housekeeping"
                >
                  Grounds/Housekeeping
                </MenuItem>

                <MenuItem key="Manager/Assistant" value="Manager/Assistant">
                  Manager/Assistant
                </MenuItem>
                <MenuItem
                  key="Asst Maintanance/Make ready"
                  value="Asst Maintanance/Make ready"
                >
                  Asst Maintanance/Make ready
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
                {data.length > 0 ? (
                  data.map((row) => (
                    <TableRow
                      key={row.id}
                      onClick={() => navigate(`/employees/details/${row._id}`)}
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
                          <Avatar src={baseUrl + row.picture} />
                          {`${row.first_name} ${row.last_name}`}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row.email}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {row.skill_type}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {"+" + row.phone}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          sx={{
                            backgroundColor:
                              row.status === "Available"
                                ? Colors.seaGreen
                                : Colors.yellow,
                            borderRadius: "20px",
                            textAlign: "center",
                            px: 2,
                            py: 0.5,
                            color: Colors.white,
                            fontSize: "12px",
                            textTransform: "capitalize",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (row.status === "On Job" && row.job_id) {
                              navigate(`/jobrequest/details/${row.job_id}`);
                            }
                          }}
                        >
                          {row.status}
                        </Typography>
                      </TableCell>
                      {/* <TableCell sx={{ textAlign: "center" }}>
                    {row.job || "-"}
                  </TableCell> */}
                      <TableCell sx={{ textAlign: "center" }}>
                        {moment(row.created_at).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Typography
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          {/* <Box
                        dangerouslySetInnerHTML={{ __html: Svgs["edit"] }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/employees/update/${row._id}`);
                        }}
                      /> */}
                          {/* <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMessageDialog(true);
                          setPhoneNum(row.phone);
                        }}
                      >
                        <MessageIcon />
                      </Box> */}
                          {row?.isApproved == false ? (
                            <>
                              <Box
                                sx={{
                                  border: `1px solid ${Colors.primary}`,
                                  color: Colors.white,
                                  px: 2,
                                  background: Colors.primary,
                                  fontSize: "15px",
                                  cursor: "pointer",
                                  borderRadius: "15px",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenAssignDialog(true)
                                  setSelectedEmployeeId(row);
                                }}
                              >
                                Approve
                              </Box>
                            </>
                          ) : (
                            <>
                              <Box
                                sx={{
                                  border: `1px solid ${Colors.primary}`,
                                  color: Colors.primary,
                                  px: 2,

                                  fontSize: "15px",
                                  cursor: "pointer",
                                  borderRadius: "15px",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // setOpenAssignDialog(true);
                                  // setSelectedEmployeeId(row);
                                  navigate(
                                    `/job-applicant/view-doc/${row?.job_id}`,
                                    { state: row?._id }
                                  );
                                }}
                              >
                                View
                              </Box>
                            </>
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={tableHead?.length}
                      sx={{ textAlign: "center" }}
                    >
                      No Data Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <SimpleDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          border={`4px solid ${Colors.primary}`}
          title="Are You Sure you want to Delete?"
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
              onClick={DeleteEmployee}
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
            {`Showing ${page * limit + 1}-${Math.min(
              (page + 1) * limit,
              count ? count : 0
            )} of ${count != undefined ? count : 0}`}
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
      {openMessageDialog && (
        <>
          <SimpleDialog
            open={openMessageDialog}
            onClose={() => setOpenMessageDialog(false)}
            border={`4px solid ${Colors.primary}`}
            title="Send A Message"
          >
            <form onSubmit={handleSubmit(sendMessage)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                    Message
                  </InputLabel>
                  <TextField
                    multiline
                    minRows={4}
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message here..."
                    {...register("message", {
                      required: "Message is required",
                    })}
                    error={!!errors.message}
                    helperText={errors.message ? errors.message.message : ""}
                    sx={{ mt: 1 }}
                  />
                </Grid>

                {/* Buttons */}
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                >
                  <Button
                    sx={{
                      color: Colors.black,
                      mr: 2,
                      border: "1px solid black",
                      px: 4,
                    }}
                    onClick={() => setOpenMessageDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    sx={{ px: 5 }}
                    variant="contained"
                    color="primary"
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </form>
          </SimpleDialog>
        </>
      )}

      <SimpleDialog
        open={openAssignDialog}
        onClose={() => {
          setOpenAssignDialog(false);
        }}
        border={`4px solid ${Colors.primary}`}
        title="Are You Sure?"
      >
        <Box sx={{ textAlign: "center" }}>Are You Sure you want to approve</Box>
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Box sx={{ color: Colors.primary }}>
            Job#{selectedEmployeeId?.num_id}
          </Box>
          <Box>to</Box>
          <Box sx={{ color: Colors.primary }}>
            {selectedEmployeeId?.first_name +
              " " +
              selectedEmployeeId?.last_name}
          </Box>
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
              setOpenAssignDialog(false);
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
            onClick={AssignJob}
          >
            Yes, Confirm
          </Box>
        </Box>
      </SimpleDialog>
    </>
  );
};

export default App;
