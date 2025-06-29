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
  TextField,
  Grid,
  Tooltip,
  Stack,
  InputLabel
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import { styled } from "@mui/system";
import { useForm, Controller } from "react-hook-form";

import Colors from "../../../../assets/styles";
import { Svgs } from "../../../../assets/images";
import { useNavigate } from "react-router-dom";
import PropertyServices from "../../../../api/PropertyServices/property.index";
import { ErrorHandler } from "../../../../utils/ErrorHandler";
import SimpleDialog from "../../../../components/Dialog/index";
import Loader from "../../../../components/Loader";
import AuthServices from "../../../../api/AuthServices/auth.index";
import moment from "moment";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Chip } from "@mui/material";

const tableHead = [
  "SR No",
  "Agent Name",
  "Email",
  "Booking Date",
  "Booking Time",
  "Property Name",
  "Document",
//   "Status",
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

const BookingList = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const sleep = () => new Promise((r) => setTimeout(r, 1000));
  const { control, handleSubmit } = useForm();

  const getBookingList = async (
    searchParam = "",

    pageParam = 1,
    limitParam = 10,
    statusParam = "approved"
  ) => {
    setLoading(true);
    try {
      await sleep();
      const { data } = await AuthServices.getBooking(
        searchParam,
        pageParam,
        limitParam,
        statusParam
      );
      setData(data?.bookings);
      setCount(data.count);
    } catch (error) {
      ErrorHandler(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookingList(search, page + 1, limit ,"approved");
  }, [page, limit, search]);

  const deleteProperty = async () => {
    setDeleteLoading(true);
    try {
      const { responseCode } = await AuthServices.deleteBooking(
        selectedPropertyId
      );

      setOpenDialog(false);
      getBookingList(search, page + 1, limit ,"approved");
    } catch (error) {
      ErrorHandler(error);
      console.log(error?.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearch = () => {
    getBookingList(search, 1, limit,"approved");
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleReset = () => {
    setId("");
    setSearch("");
    getBookingList("", 1, limit,"approved");
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const onSubmit = (data) => {
    console.log("New status:", data.status);
   
  };
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
        Approved Bookings
        </Typography>
        {/* <Button
          onClick={() => navigate("/properties/create")}
          variant="contained"
          color="primary"
          sx={{ mx: 1, color: "white" }}
        >
          Add New
        </Button> */}
      </Box>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "20px",
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
                    textAlign:
                      column === "Management Company" ? "left" : "center",
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {loading ? (
            <TableRow>
              <TableCell colSpan={tableHead.length}>
                <Loader width="40px" height="40px" color={Colors.primary} />
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((row, index) => (
              <TableBody key={row._id}>
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>
                    {index + 1}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    {row?.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row?.email}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {moment(row?.date).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row?.time}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row?.property?.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row?.doc ? (
                      <Tooltip title="View Document">
                        <IconButton
                          component="a"
                          href={row.doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: "#1976d2" }}
                        >
                          <InsertDriveFileIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  {/* <TableCell sx={{ textAlign: "center" }}>
                    <Chip
                    onClick={()=>setOpenStatusDialog(true)}
                      label={row?.status || "Unknown"}
                     
                      size="small"
                      sx={{ textTransform: "capitalize",color:"white" ,background:"#de9525e0",cursor:"pointer" }}
                    />
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
                          setOpenDialog(true);
                          setSelectedPropertyId(row._id);
                        }}
                        dangerouslySetInnerHTML={{ __html: Svgs["delete"] }}
                      />
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))
          )}
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
              ".css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar .MuiTablePagination-actions":
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
        onClose={() => setOpenDialog(false)}
        border={`4px solid ${Colors.primary}`}
        title="Are You Sure you want to Delete?"
      >
        <Box
          sx={{ display: "flex", justifyContent: "center", gap: "16px", mt: 5 }}
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
              width: deleteLoading ? "80px" : "auto",
            }}
            onClick={deleteProperty}
          >
            {deleteLoading ? (
              <Loader width="20px" height="20px" color={Colors.white} />
            ) : (
              "Yes, Confirm"
            )}
          </Box>
        </Box>
      </SimpleDialog>


      <SimpleDialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        border={`4px solid ${Colors.primary}`}
        title="Are You Sure you Change Status?"
      >
         <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Status Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Status">
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  
                </Select>
              )}
            />
          </FormControl>

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Confirm
          </Button>
        </Stack>
      </form>
      </SimpleDialog>
    </Box>
  );
};

export default BookingList;
