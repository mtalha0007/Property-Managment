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
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import { styled } from "@mui/system";
import EmployeeServices from "../../../../../api/EmployeeServices/employee.index";
import Colors from "../../../../../assets/styles";
import { Svgs } from "../../../../../assets/images";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ErrorHandler } from "../../../../../utils/ErrorHandler";
import moment from "moment/moment";
import Loader from "../../../../../components/Loader";
import SimpleDialog from "../../../../../components/Dialog";
import {
  SuccessToaster,
  ErrorToaster,
} from "../../../../../components/Toaster/index";
import JobServices from "../../../../../api/JobServices/job.index";

const tableHead = [
  "ID",
  "Name",
  "Email",
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
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { state } = useLocation();
  console.log(state);
  // const jobID = state?._id;

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(false);
  const [skillType, setSkillType] = useState("");

  const getEmployees = async (
    idParam = "",
    pageParam = 1,
    limitParam = 10,
    status,
    skillType = "",
    searchParam = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await EmployeeServices.getEmployee(
        idParam,
        pageParam,
        limitParam,
        status,
        skillType,
        searchParam
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
    getEmployees(id, page + 1, limit, "Available", "", search);
  }, [page, limit,search]);

  const navigate = useNavigate();

  const handleReset = () => {
    setId("");
    setSearch("")
    getEmployees("", page, limit,"Available", "", search);
  };

  const handleSearch = () => {
    getEmployees(id, 1, limit,"Available" , "", search);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const filteredData = data.filter((item) =>
    item.first_name.toLowerCase().includes(item.first_name?.toLowerCase())
  );

  const AssignJob = async () => {
    const obj = {
      job_id: state?._id,
      employee_id: [selectedEmployeeId?._id],
    };
    console.log(obj);
    try {
      const { data, message } = await JobServices.assignJob(obj);
      SuccessToaster(message);
      setOpenDialog(false);
      getEmployees(id, page + 1, limit, search);
      navigate("/jobrequest");
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
          justifyContent: "flex-start",
          gap: "10px",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography
          sx={{
            fontSize: "26px",
            color: "rgb(148 149 153)",
            fontWeight: "600",
          }}
        >
          Job Request /
        </Typography>
        <Typography
          sx={{ fontSize: "22px", color: Colors.primary, fontWeight: "600" }}
        >
          Assign To
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
        {/* <Grid item>
          <TextField
            sx={{ mt: "22px" }}
            placeholder="Search By Name"
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
              setSearch(e.target.value);
            }}
          />
        </Grid> */}
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
                  <Loader width="40px" height="40px" color={Colors.primary} />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {filteredData.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => navigate(`/employees/details/${row._id}`)}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    {row?.num_id}
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
                      {row.first_name + " " + row.last_name}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.email}
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
                        textTransform: "capitalize ",
                      }}
                    >
                      {row.status}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {moment(row.created_at).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        border: `1px solid ${Colors.primary}`,
                        color: Colors.primary,
                        px: 1,
                        py: 0.5,
                        fontSize: "15px",
                        cursor: "pointer",
                        borderRadius: "15px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDialog(true);
                        setSelectedEmployeeId(row);
                      }}
                    >
                      Assign
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <SimpleDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        border={`4px solid ${Colors.primary}`}
        title="Are You Sure?"
      >
        <Box sx={{ textAlign: "center" }}>Are You Sure you want to assign</Box>
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Box sx={{ color: Colors.primary }}>Job#{state?.num_id}</Box>
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
            onClick={AssignJob}
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
