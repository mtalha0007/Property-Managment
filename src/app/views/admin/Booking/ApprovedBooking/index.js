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
  InputLabel,
  Divider,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Rating,
  FormLabel,
  RadioGroup,
  Radio,
  FormGroup,
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
  // "Document",
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
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const sleep = () => new Promise((r) => setTimeout(r, 1000));
  const { control, handleSubmit, register } = useForm();
  const reasons = ["Price", "Size", "Layout", "Condition", "Location"];

  const {
    register: register2,
    setValue: setValue2,
    trigger,
    watch,
    control: control2,
    formState: { errors },
  } = useForm();
  const ratingValue = watch("rating");
  const getBookingList = async (
    searchParam = "",

    pageParam = 1,
    limitParam = 10,
    statusParam = "approved",
    Agent = ""
  ) => {
    setLoading(true);
    try {
      await sleep();
      const { data } = await AuthServices.getBooking(
        searchParam,
        pageParam,
        limitParam,
        statusParam,
        ""
      );
      setData(data?.bookings);
      setCount(data.count);

      trigger();
    } catch (error) {
      ErrorHandler(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookingList(search, page + 1, limit, "approved", "");
  }, [page, limit, search]);

  const deleteProperty = async () => {
    setDeleteLoading(true);
    try {
      const { responseCode } = await AuthServices.deleteBooking(
        selectedPropertyId
      );

      setOpenDialog(false);
      getBookingList(search, page + 1, limit, "approved", "");
    } catch (error) {
      ErrorHandler(error);
      console.log(error?.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearch = () => {
    getBookingList(search, 1, limit, "approved", "");
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleReset = () => {
    setId("");
    setSearch("");
    getBookingList("", 1, limit, "approved", "");
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
                  {/* <TableCell sx={{ textAlign: "center" }}>
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
                  </TableCell> */}
                  {/* <TableCell sx={{ textAlign: "center" }}>
                    <Chip
                    onClick={()=>setOpenStatusDialog(true)}
                      label={row?.status || "Unknown"}
                     
                      size="small"
                      sx={{ textTransform: "capitalize",color:"white" ,background:"#de9525e0",cursor:"pointer" }}
                    />
                  </TableCell> */}

                  <TableCell sx={{ textAlign: "center" }}>
                    {row?.feedback && (
                      <Button
                        variant="outlined"
                        sx={{
                          background: Colors.primary,
                          color: Colors.white,
                          " :hover": {
                            background: Colors.primary,
                            opacity: 0.9,
                            color: Colors.white,
                          },
                        }}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(row?.feedback);
                          setSelectedPropertyId(row._id);
                          setOpenDetailDialog(true);
                          setValue2("interested", row?.feedback.interested);
                          setValue2("helpInterested", row?.feedback.reason);
                          setValue2("helpNotInterested", row?.feedback.reason);
                          setValue2(
                            "interestedOptions",
                            row?.feedback.is_offer
                          );
                          setValue2(
                            "notInterestedReasons",
                            row?.feedback.is_offer
                          );
                          setValue2("rating", row?.feedback.rating ?? 0);
                          setValue2("comment", row?.feedback.comment ?? "");
                        }}
                      >
                        View Feedback
                      </Button>
                    )}
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

      <SimpleDialog
        open={openDetailDialog}
        onClose={() => {
          setOpenDetailDialog(false);
        }}
        border={`4px solid ${Colors.primary}`}
        title="Agent FeedBack"
      >
        <Box display="flex" flexDirection="column" gap={2} p={2}>
          {/* Interested Checkbox */}
          <Box>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <Typography fontWeight={500} color="text.primary">
                  Is the client interested?
                </Typography>
              </FormLabel>

              <RadioGroup row value={watch("interested") ? "true" : "false"}>
                <FormControlLabel
                  value="true"
                  control={<Radio disabled />}
                  label="Interested"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio disabled />}
                  label="Not Interested"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          {watch("interested") == true ? (
            <>
              <Box mb={2}>
                <Typography fontWeight={500}>
                  Did they ask about making an offer or booking a second visit?
                  *
                </Typography>
                <FormGroup row>
                  {["Making Offer", "Booking Second Visit"].map((option) => (
                    <FormControlLabel
                      key={option}
                      label={option}
                      control={
                        <Controller
                          name="interestedOptions"
                          control={control2}
                          render={({ field }) => (
                            <Checkbox
                              disabled
                              checked={field.value?.includes(option)}
                              onChange={() => {}}
                            />
                          )}
                        />
                      }
                    />
                  ))}
                </FormGroup>
              </Box>

              <Box mb={3}>
                <TextField
                  label="What would help convert this interest into a deal? *"
                  fullWidth
                  multiline
                  disabled
                  rows={3}
                  {...register2("helpInterested", {
                    required: "This field is required.",
                  })}
                />
              </Box>
            </>
          ) : (
            <>
              <Box mb={2}>
                <Typography fontWeight={500}>
                  What was the main reason the client was not interested? *
                </Typography>
                <FormGroup row>
                  {reasons.map((reason) => (
                    <FormControlLabel
                      key={reason}
                      control={
                        <Controller
                          name="notInterestedReasons"
                          control={control2}
                          rules={{
                            validate: (val) =>
                              val?.length > 0 || "Select at least one reason.",
                          }}
                          render={({ field }) => (
                            <Checkbox
                              disabled
                              checked={field?.value?.includes(reason)}
                            />
                          )}
                        />
                      }
                      label={reason}
                    />
                  ))}
                </FormGroup>
              </Box>

              <Box mb={3}>
                <TextField
                  label="What would help convert this lead into potential customer? *"
                  fullWidth
                  multiline
                  disabled
                  rows={3}
                  {...register2("helpNotInterested", {
                    required: "This field is required.",
                  })}
                />
              </Box>
            </>
          )}

          {/* Rating */}
          <Box>
            <Typography fontWeight={500} color="text.primary" gutterBottom>
              Rate His Experience
            </Typography>
            <Rating
              name="rating"
              value={ratingValue || 0}
              readOnly
              sx={{ color: Colors.primary, fontSize: "2.5rem" }}
            />
            <Box mt={0.5}>
              {errors.rating && (
                <FormHelperText error>Please select a rating</FormHelperText>
              )}
            </Box>
          </Box>

          {/* Comments */}
          <Box>
            <TextField
              label="Additional Comments"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              disabled
              {...register2("comment")}
            />
          </Box>
        </Box>
      </SimpleDialog>
    </Box>
  );
};

export default BookingList;
