import React, { useEffect, useState, Fragment } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Button,
  InputLabel,
  Tooltip,
  IconButton,
  Modal,
  Autocomplete,
  TextField,
} from "@mui/material";
import Colors from "../../../assets/styles";
import { useParams } from "react-router-dom";
import JobTimeServices from "../../../api/JobTimeServices";
import { ErrorHandler } from "../../../utils/ErrorHandler";
import SimpleDialog from "../../../components/Dialog";
import { ErrorToaster, SuccessToaster } from "../../../components/Toaster";
import { useForm } from "react-hook-form";
import moment from "moment/moment";
import RoomIcon from "@mui/icons-material/Room";
import MapComponent from "../../../components/MapComponent";
import JobServices from "../../../api/JobServices/job.index";

export default function JobsReport() {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [report, setReport] = useState([]);
  const id = useParams();
  const [time, setTime] = useState(new Date());
  const [currentStatus, setCurrentStatus] = useState(null);
  const [openMapModal, setOpenMapModal] = useState(false); // State for Map Modal
  const [mapData, setMapData] = useState(null);
  const [data, setData] = useState([]);
  const [jobId, setJobId] = useState("");

  const [userID, setUserId] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(currentStatus);
    const obj = {
      _id: userID?._id,
      [currentStatus === "checkIn" ? "checkin" : "checkout"]:
        moment(date).format("YYYY-MM-DD") +
        "T" +
        moment(data.time, "HH:mm").format("HH:mm:ss"),
    };
    console.log(obj);

    try {
      const { message } = await JobTimeServices.updateTimeSheet(obj);
      SuccessToaster(message);
      getJobsReport();
      setOpenDialog(false);
    } catch (error) {
      ErrorToaster(error?.message || "Error during check-in/out");
    }
  };

  const transformData = (data) => {
    console.log(data);
    const dateGroupedData = {};

    data.forEach((entry) => {
      const date = moment(entry.checkin ? entry.checkin : entry?.date).format(
        "YYYY-MM-DD"
      );

      if (!dateGroupedData[date]) {
        dateGroupedData[date] = { date, employees: [] };
      }
      const checkInTime = entry.checkin
        ? moment.utc(entry.checkin).format("hh:mm:ss A")
        : "";
      const checkOutTime = entry.checkout
        ? moment.utc(entry.checkout).format("hh:mm:ss A")
        : "";

      const employee = entry.employee_info[0];
      dateGroupedData[date].employees.push({
        name: `${employee.first_name} ${employee.last_name}`,
        clockIn: checkInTime,
        clockOut: checkOutTime,
        _id: entry?._id,
        checkinDistance: entry?.checkinDistance ? entry?.checkinDistance : "",
        checkoutDistance: entry?.checkoutDistance
          ? entry?.checkoutDistance
          : "",

        propertyLat: entry?.property?.latitude ? entry?.property?.latitude : "",
        propertyLng: entry?.property?.longitude
          ? entry?.property?.longitude
          : "",
        clockinLat: entry?.checkinLatitude ? entry?.checkinLatitude : "",
        clockinLng: entry?.checkinLongitude ? entry?.checkinLongitude : "",
        clockOutLat: entry?.checkoutLatitude ? entry?.checkoutLatitude : "",
        clockOutLng: entry?.checkoutLongitude ? entry?.checkoutLongitude : "",
      });
    });

    console.log(dateGroupedData);
    return Object.values(dateGroupedData);
  };

  const getJobsReport = async () => {
    setLoading(true);
    try {
      const { data } = await JobTimeServices.getTimeSheet(jobId);
      const transformedData = transformData(data.list);
      setReport(transformedData);
    } catch (error) {
      ErrorHandler(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Map code
  const handleMapClick = (propertyCoordinates, clockCoordinates) => {
    console.log(propertyCoordinates, clockCoordinates);
    setMapData({ propertyCoordinates, clockCoordinates });
    setOpenMapModal(true);
  };

  const closeModal = () => {
    setOpenMapModal(false);
    setMapData(null);
  };

  const handleGetJob = async (

  ) => {
    try {
      const { data, responseCode, message } = await JobServices.getAllJobs(
      
      );
      const filteredData = data.list.filter(
        (job) => job.status != "unassigned"
      );
      console.log(filteredData);
      setData(filteredData);
      console.log(data);
    } catch (error) {
      console.error("Error while fetching users:", error);
    }
  };
  useEffect(() => {
    handleGetJob();
  }, []);
  const handleUserChange = (event, value) => {
    setJobId(value?._id);
  };
  return (
    <>
      <Box sx={{ mt: 10, ml: 2, mr: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "10px",
            alignItems: "center",
            ml: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "26px",
              fontWeight: "600",
              color: Colors.primary,
            }}
          >
            My Job Report
          </Typography>
        </Box>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          sx={{ mt: 4 }}
        >
          {/* Search by Name */}
          <Grid item md={6} sm={12} xs={12} sx={{ width: "100%" }}>
            <InputLabel sx={{ fontWeight: "bold" }}>Search By Job</InputLabel>

            {/* Autocomplete for name search */}
            <Autocomplete
            className="jobautocomplete"
              options={data}
              getOptionLabel={(option) => option.name || ""}
              // This function will filter the options based on the input value
              filterOptions={(options, { inputValue }) =>
                options.filter(
                  (option) =>
                    option.name.toLowerCase().includes(inputValue.toLowerCase()) // Matches based on input
                )
              }
              value={data.find((name) => name._id === jobId) || null}
              onChange={(event, newValue) => handleUserChange(event, newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Select or type a name"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: <>{params.InputProps.endAdornment}</>,
                  }}
                />
              )}
            />
          </Grid>

          <Grid
            item
            md={6}
            sm={12}
            xs={12}
            sx={{
              justifyContent: "end",
              display: "flex",
              marginTop: { md: " 23px", sm: "10px", xs: "10px" },
            }}
          >
            <Button
              onClick={getJobsReport}
              variant="contained"
              sx={{
                textTransform: "capitalize",
                minWidth: "100px",
                boxShadow:
                  "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
                color: Colors.white,
                background: Colors.primary,
                "&:hover": {
                  background: Colors.primary,
                },
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {report.length > 0 ? (
          <TableContainer
            sx={{
              mt: 2,
              borderRadius: "10px",
              background: Colors.dashboardBgColor,
            }}
            component={Paper}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: "10%",
                      fontWeight: "bold",
                      borderRight: "1px solid #e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    Date
                  </TableCell>
                  {report.length > 0 &&
                    report[0].employees.map((employee, index) => (
                      <React.Fragment key={index}>
                        <TableCell
                          align="center"
                          colSpan={2}
                          sx={{
                            width: "20%",
                            fontWeight: "bold",
                            borderRight:
                              index === report[0].employees.length - 1
                                ? "none"
                                : "1px solid #e0e0e0",
                          }}
                        >
                          {employee.name}
                        </TableCell>
                      </React.Fragment>
                    ))}
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ width: "10%", borderRight: "1px solid #e0e0e0" }}
                  ></TableCell>
                  {report.length > 0 &&
                    report[0].employees.map((employee, index) => (
                      <React.Fragment key={employee.name}>
                        <TableCell
                          align="center"
                          sx={{
                            width: "10%",
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          Clock In
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            width: "10%",
                            borderRight:
                              index === report[0].employees.length - 1
                                ? "none"
                                : "1px solid #e0e0e0",
                          }}
                        >
                          Clock Out
                        </TableCell>
                      </React.Fragment>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {report.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ width: "10%", borderRight: "1px solid #e0e0e0" }}
                    >
                      <Typography
                        sx={{ textAlign: "center", fontSize: "14px" }}
                      >
                        {moment(row.date).format("DD-MM-YYYY")}
                      </Typography>
                    </TableCell>
                    {row.employees.map((employee, index) => (
                      <React.Fragment key={employee.name}>
                        {employee.clockIn ? (
                          <TableCell
                            align="center"
                            sx={{
                              width: "10%",
                              borderRight: "1px solid #e0e0e0",
                            }}
                            onClick={() => {
                              console.log(employee?._id);

                              // setOpenDialog(true);
                              setUserId(employee);
                              setDate(row?.date);
                              setCurrentStatus("checkIn");
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Tooltip
                                title={`The Distance is ${employee?.checkinDistance} km`}
                              >
                                {employee.clockIn}
                              </Tooltip>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMapClick(
                                    {
                                      lat: employee.propertyLat,
                                      lng: employee.propertyLng,
                                    },
                                    {
                                      lat: employee.clockinLat,
                                      lng: employee.clockinLng,
                                    }
                                  );
                                }}
                              >
                                <RoomIcon sx={{ color: Colors.black }} />
                              </IconButton>
                            </Box>
                          </TableCell>
                        ) : (
                          <TableCell
                            align="center"
                            sx={{
                              width: "10%",
                              borderRight: "1px solid #e0e0e0",
                            }}
                            onClick={() => {
                              console.log(employee?._id);

                              // setOpenDialog(true);
                              setUserId(employee);
                              setDate(row?.date);
                              setCurrentStatus("checkIn");
                            }}
                          >
                            -
                          </TableCell>
                        )}

                        {employee.clockOut ? (
                          <TableCell
                            align="center"
                            sx={{
                              width: "10%",
                              borderRight: "1px solid #e0e0e0",
                            }}
                            onClick={() => {
                              console.log(employee);
                              setDate(row?.date);

                              // setOpenDialog(true);
                              setUserId(employee);
                              setCurrentStatus("checkOut");
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Tooltip
                                title={`The Distance is ${employee?.checkoutDistance} km`}
                              >
                                {employee.clockOut}
                              </Tooltip>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMapClick(
                                    {
                                      lat: employee.propertyLat,
                                      lng: employee.propertyLng,
                                    },
                                    {
                                      lat: employee.clockOutLat,
                                      lng: employee.clockOutLng,
                                    }
                                  );
                                }}
                              >
                                <RoomIcon sx={{ color: Colors.black }} />
                              </IconButton>
                            </Box>
                          </TableCell>
                        ) : (
                          <TableCell
                            align="center"
                            sx={{
                              width: "10%",
                              borderRight: "1px solid #e0e0e0",
                            }}
                            onClick={() => {
                              console.log(employee);
                              setDate(row?.date);

                              // setOpenDialog(true);
                              setUserId(employee);
                              setCurrentStatus("checkOut");
                            }}
                          >
                            -
                          </TableCell>
                        )}
                      </React.Fragment>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box>
            <Typography
              variant="h5"
              align="center"
              marginBottom="10px"
              sx={{ color: Colors.black, fontFamily: "Poppins" ,display:"flex",justifyContent:"center",alignItems:"center",height:'200px '}}
            >
              No Data Available
            </Typography>
          </Box>
        )}
      </Box>

      <SimpleDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        border={`4px solid ${Colors.primary}`}
      >
        <Grid
          container
          alignItems="center"
          sx={{ width: { xs: "87%", sm: "100%" }, margin: "0 auto" }}
        >
          <Grid item md={12} sm={12} xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Box
                sx={{
                  width: { xs: "300px", sm: "80%" },
                  borderRadius: "20px",
                  boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
                  p: 3,
                  position: "relative",
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  marginBottom="10px"
                  sx={{ color: Colors.primary, fontFamily: "Poppins" }}
                >
                  {time.toLocaleString()}
                </Typography>

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mt={6}
                  mb={2}
                >
                  <svg
                    width="200"
                    height="200"
                    viewBox="0 0 100 100"
                    className="clock-face"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      stroke="#e0e0e0"
                      strokeWidth="2"
                      fill="none"
                    />
                    <line
                      x1="50"
                      y1="50"
                      x2="50"
                      y2="30"
                      stroke="black"
                      strokeWidth="3"
                      strokeLinecap="round"
                      transform={`rotate(${
                        time.getHours() * 30 + time.getMinutes() / 2
                      } 50 50)`}
                    />
                    <line
                      x1="50"
                      y1="50"
                      x2="50"
                      y2="20"
                      stroke="#424242"
                      strokeWidth="2"
                      strokeLinecap="round"
                      transform={`rotate(${time.getMinutes() * 6} 50 50)`}
                    />
                    <line
                      x1="50"
                      y1="50"
                      x2="50"
                      y2="15"
                      stroke="#e91e63"
                      strokeWidth="1"
                      strokeLinecap="round"
                      transform={`rotate(${time.getSeconds() * 6} 50 50)`}
                    />
                  </svg>
                </Box>
                <Box component="form" onSubmit={handleFormSubmit(onSubmit)}>
                  <Box>
                    <InputLabel>Select Time</InputLabel>
                    <input
                      style={{
                        width: "100%",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                      type="time"
                      {...register("time", { required: "Time is required" })}
                    />
                    {errors.time && (
                      <span style={{ color: "red" }}>
                        {errors.time.message}
                      </span>
                    )}
                  </Box>

                  {currentStatus === "checkOut" ? (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: Colors.primary,
                        ":hover": {
                          backgroundColor: Colors.primary,
                          boxShadow: "none",
                        },
                        color: Colors.white,
                        boxShadow: "none",
                        fontFamily: "Poppins",
                        display: "flex",
                        margin: "8px auto",
                      }}
                    >
                      Clock Out
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: Colors.primary,
                        ":hover": {
                          backgroundColor: Colors.primary,
                          boxShadow: "none",
                        },
                        color: Colors.white,
                        boxShadow: "none",
                        fontFamily: "Poppins",
                        display: "flex",
                        margin: "8px auto",
                      }}
                    >
                      Clock In
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </SimpleDialog>

      {/* Map modal */}
      <Modal
        open={openMapModal}
        onClose={closeModal}
        aria-labelledby="map-modal-title"
        aria-describedby="map-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <MapComponent
            propertyCoordinates={mapData?.propertyCoordinates}
            clockCoordinates={mapData?.clockCoordinates}
          />
        </Box>
      </Modal>
    </>
  );
}
