import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Images } from "../../../assets/images/index";
import Colors from "../../../assets/styles";
import StatsServices from "../../../api/StatsServices/stats.index";
import { ErrorHandler } from "../../../utils/ErrorHandler";
import JobServices from "../../../api/JobServices/job.index";
import Loader from "../../../components/Loader";
import moment from "moment";
import AuthServices from "../../../api/AuthServices/auth.index";

const tableHead = ["Job Name", "Date-Time", "Person", "Status"];

function Dashboard() {
  const [data, setData] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [limit, setLimit] = useState(3);
  const [page, setPage] = useState("");
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState("");

  const getStatsData = async () => {
    try {
      const response = await AuthServices.stats();

      setData(response);
    } catch (error) {
      ErrorHandler(error);
      console.log(error);
    }
  };
  useEffect(() => {
    getStatsData();
  }, []);

  const cardData = [
    {
      title: "Total Agents",
      value: data?.totalAgents,
      icon: Images.userDashboard,
      trend:
        data?.employees?.growth >= 0 ? Images.trendingDowm : Images.trendingUp,

      trendPercent: data?.employees?.growth,
      color: "rgba(245, 117, 27, 1)",
    },
    {
      title: "Total Properties  ",
      value: data?.totalProperties,
      icon: Images.jobDashboard,
      trend: data?.jobs?.growth >= 0 ? Images.trendingDowm : Images.trendingUp,

      trendPercent: data?.jobs?.growth,

      color: "rgba(245, 117, 27, 1)",
    },
    {
      title: "Booking Approval",
      value: 0,

      icon: Images.companyDashboard,
      trend:
        data?.companies?.growth >= 0 ? Images.trendingDowm : Images.trendingUp,
      trendPercent: data?.companies?.growth,

      color: "rgba(245, 117, 27, 1)",
    },
    {
      title: "Booking Approved",
      value: 0,

      icon: Images.jobPendingDashboard,
      trend:
        data?.jobsPending?.growth >= 0
          ? Images.trendingDowm
          : Images.trendingUp,

      trendPercent: data?.jobsPending?.growth,

      color: "rgba(245, 117, 27, 1)",
    },
  ];
  return (
    <Box>
      <Grid container>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            mt: 13,
            pl: 2,
            pr: 2,
          }}
        >
          <Grid container rowGap={"18px"}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={2}>
                {cardData.map((item, ind) => (
                  <Grid item xs={12} sm={12} md={3} lg={3} key={ind}>
                    <Box
                      sx={{
                        background: Colors.backgroundColor,
                        borderRadius: "15px",
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                      }}
                    >
                      <Box
                        sx={{
                          px: 3,
                          py: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ width: "100%" }}>
                          <Typography
                            sx={{
                              color: Colors.black,
                              fontWeight: 600,
                              fontSize: "18px ",
                            }}
                          >
                            {item.title}
                          </Typography>
                          {/* <Typography
                            sx={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              mt: 2,
                              fontSize: "20px",
                            }}
                          >
                            {item.value}
                          </Typography> */}
                        </Box>
                        <Box>
                          <img width="50px" src={item.icon} />
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          mt: 2,
                          fontSize: "20px",
                          ml: 3,
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Box
                        sx={{
                          pl: 2,
                          py: 1,
                          display: "flex",
                          gap: "3px",
                          fontSize: "14px",
                          alignItems: "center",
                        }}
                      ></Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* <Box
        sx={{
          padding: "20px",
          background: Colors.backgroundColor,
          mt: 3,
          ml: 2,
          pl: 2,
          mr:2,
          borderRadius: "10px",
          boxShadow:" rgba(0, 0, 0, 0.24) 0px 3px 8px"
        }}
      >
        <Box sx={{ fontSize: "24px", fontWeight: "bold" }}>Job Details</Box>
        <TableContainer
          sx={{ mt: 2, boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ borderRadius: "20px" }}>
                {tableHead.map((column, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      borderBottom:"none !important",
                      borderRadius: index === 0 ? "10px 0 0 10px" : index === tableHead.length - 1 ? "0px 10px 10px 0" : 0,
                      fontWeight: "600",
                      color: Colors.black,
                      backgroundColor: "rgb(241 230 244)",
                      textAlign:"center"
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
                jobData.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {row.name}
                    </TableCell>
                    
                    <TableCell sx={{ textAlign: "center" }}>
                      {moment(row.created_at).format("DD-MM-YYYY HH:mm")}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                    {row?.assigned_employees?.length > 0
                      ? row.assigned_employees
                          .map((item) => `${item.first_name} ${item.last_name}`)
                          .join(" , ")
                      : "-"}
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
                          width:"100px",
                          margin:"0 auto",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {row.status}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box> */}
    </Box>
  );
}

export default Dashboard;
