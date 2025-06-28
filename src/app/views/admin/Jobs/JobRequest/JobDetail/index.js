import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Avatar,
  Button,
  Grid,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  IconButton,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Colors from "../../../../../assets/styles";
import { Images, Svgs } from "../../../../../assets/images";
import { useNavigate, useParams } from "react-router-dom";
import JobServices from "../../../../../api/JobServices/job.index";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { ErrorHandler } from "../../../../../utils/ErrorHandler";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useAuth } from "../../../../../context";

export default function JoDetails() {
  const [data, setData] = useState([]);
  const [groupedSkills, setGroupedSkills] = useState({});
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const {user} = useAuth()


  const paramId = useParams();
  const getJobRequestDetails = async () => {
    try {
      const { data } = await JobServices.getJobDetails(paramId.id);
      setData(data.details[0]);
      console.log(data.details[0]);

      const skillData = data.details.flatMap(
        (detail) => detail.skill_details || []
      );
      console.log(skillData);

      if (skillData.length > 0) {
        let skills = skillData.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item.skill);
          return acc;
        }, {});

        setGroupedSkills(skills);
      } else {
        setGroupedSkills({});
      }
    } catch (error) {
      ErrorHandler(error);
      console.log(error);
    }
  };

  useEffect(() => {
    getJobRequestDetails();
  }, []);

  const handleExportWithComponent = (pdfExportComponent) => {
    pdfExportComponent.current.save();
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 10,
          pl: 2,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            gap: "10px",
            alignItems: "center",
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
            Job Detail
          </Typography>
        </Box>
        {user?.role == "admin" && (
          <>
        {data?.assigned_to?.length == 0  ? (
          <>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Box
                onClick={() =>
                  navigate("/jobrequest/assignto", { state: data })
                }
                sx={{
                  border: `1px solid ${Colors.primary}`,
                  color: Colors.primary,
                  px: 3,
                  py: 0.6,
                  mr: 2,
                  fontSize: "15px",
                  cursor: "pointer",
                  borderRadius: "15px",
                }}
              >
                Assign To
              </Box>
              <Box
                sx={{
                  border: `2px solid ${Colors.red}`,
                  color: Colors.red,
                  px: 3,
                  py: 0.6,
                  mr: 2,
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => handleExportWithComponent(contentRef)}
              >
                Export PDF
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Box
                sx={{
                  border: `1px solid ${Colors.seaGreen}`,
                  color: Colors.seaGreen,
                  px: 3,
                  py: 0.6,
                  mr: 2,
                  fontSize: "15px",
                  cursor: "pointer",
                  borderRadius: "15px",
                }}
              >
                Assigned
              </Box>
              <Box
                sx={{
                  border: `2px solid ${Colors.red}`,
                  color: Colors.red,
                  px: 3,
                  py: 0.6,
                  mr: 2,
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onClick={() => handleExportWithComponent(contentRef)}
              >
                Export PDF
              </Box>
            </Box>
          </>
        )}
          </>
        )}
      </Box>
      <Card
        sx={{
          mt: 3,
          ml: 2,
          mr: 2,
          backgroundColor: Colors.backgroundColor,
          borderRadius: "10px",
          boxShadow: "0px 0px 100px 0px rgb(0,0,0,0.1)",
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <Box display="flex" gap="25px" justifyContent={"space-between"}>
                <Box display="flex" gap="25px">
                  <Avatar
                    alt="Maria Johnson"
                    sx={{ width: 100, height: 100 }}
                  />
                  <Box>
                    <Typography
                      sx={{ fontSize: "24px", color: Colors.primary }}
                    >
                      {data?.property?.name}
                    </Typography>
                    <Typography sx={{ fontSize: "12px" }}>
                    {data?.property?.map_address ?data?.property?.map_address :"-"}

                    </Typography>
                    {data?.assigned_employees?.length > 0 && (
                      <>
                        <Box sx={{ fontWeight: "500" }}>Assigned Employees</Box>
                        <Typography sx={{ fontSize: "16px" }}>
                          {data.assigned_employees.map((item, index) => (
                            <span style={{ fontSize: "14px" }} key={index}>
                              {item.first_name} {item.last_name}
                              {index < data.assigned_employees.length - 1 &&
                                ", "}
                            </span>
                          ))}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                {user?.role == "admin" && data?.assigned_to?.length == 0  && (
                  <>
                  
                <IconButton
                  sx={{
                    mt: -8,
                    ":hover": {
                      background: "none !important",
                    },
                  }}
                  onClick={() => navigate(`/jobrequest/update/${data._id}`)}
                >
                  <ModeEditIcon />
                </IconButton>
                </>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card
        sx={{
          mt: 3,
          ml: 2,
          mr: 2,

          backgroundColor: Colors.backgroundColor,
          borderRadius: "10px",
          boxShadow: "0px 0px 100px 0px rgb(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Job Name</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.name ? data?.name : "0"}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Phone Number</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.phone ? "+" + data?.phone : "0"}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Management Company </Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                {data?.company ? data.company.name : "-"}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Property </Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.property ? data?.property?.name : "-"}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Contact Person</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.cp_name ? data?.cp_name : "-"}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Contact Person Title</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.cp_title ? data?.cp_title : "-"}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Contact Person Phone</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.cp_phone ? "+" + data?.cp_phone : "0"}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Experience</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.experience ? data?.experience : "0"} Year
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Desired Position</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.position}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Skill</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.skill_type}
                </Box>
              </Box>
              {Object.keys(groupedSkills).map((category) => (
                <Box
                  sx={{ display: "flex", gap: "15px", pt: 0.8 }}
                  key={category}
                >
                  <Box sx={{ width: "300px" }}>{category}</Box>
                  <Box sx={{ fontWeight: 600, width: "250px" }}>
                    {groupedSkills[category].join(" , ")}
                  </Box>
                </Box>
              ))}

              {/* <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Area Town Preferred</Box>
                <Box sx={{ fontWeight: 600 , width:"250px" }}>{data?.area_town} </Box>
              </Box> */}

              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Hours Available</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.temporary_work?.hours_from +
                    " - " +
                    data?.temporary_work?.hours_to}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>
                  Work on same day assignment required?
                </Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.temporary_work?.same_day_assignment == false
                    ? "No"
                    : "Yes"}{" "}
                </Box>
              </Box>

              {/* <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Property Type</Box>
                <Box sx={{ fontWeight: 600 , width:"250px" }}>
                  {data?.property_types?.join(" , ")}{" "}
                </Box>
              </Box> */}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>On Call After Hours/Weekends?</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.temporary_work?.after_hours == false ? "No" : "Yes"}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Work on Weekends Required?</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.temporary_work?.work_weekends == false ? "No" : "Yes"}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Own Transport required?</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.transportation == false ? "No" : "Yes"}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Travelling Required?</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.travel == false ? "No" : "Yes"}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>
                  Working on Braunfels Required?
                </Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.new_branfels == false ? "No" : "Yes"}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Working on Boerne Required?</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.boerne == false ? "No" : "Yes"}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Salary Offered</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {"$" + data?.direct_hire?.desired_salary}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>On Call After Hours/Weekends?</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.direct_hire?.after_hours == false ? "No" : "Yes"}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Work on Weekends Required?</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.direct_hire?.work_weekends == false ? "No" : "Yes"}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Insurance Benefits Provided?</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.direct_hire?.insurance_mandatory == false
                    ? "No"
                    : "Yes"}{" "}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Required to Live on Site?</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.live_on_site == false ? "No" : "Yes"}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Relocation Required?</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.relocate == false ? "No" : "Yes"}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.8 }}>
                <Box sx={{ width: "300px" }}>Additional Notes</Box>
                <Box sx={{ fontWeight: 600, width: "250px" }}>
                  {data?.additional_notes || "-"}{" "}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 0.6 }}>
                  <Box sx={{ width: "300px" }}>Background Checks</Box>
                  <Box sx={{ fontWeight: 600,flex:1, width: "250px" }}>
                  <ul style={{listStyle:'none'}}>
    {data?.codes_details?.map((code, index) => (
        <li key={index}>
            {code?.code}: {code.value}
        </li>
    ))}
</ul>

                  </Box>
                </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box>
        <PDFExport
          ref={contentRef}
          landscape={false}
          paperSize="A4"
          margin={0}
          fileName="Job Detail"
          pageTemplate={({ pageNumber, totalPages }) => (
            <>
              {/* Header */}
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  width: "100%",
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                <img
                  src={Images.Header}
                  style={{ width: "100%" }}
                  alt="Header"
                />
              </Box>

              {/* Footer */}
              <Box
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                <img
                  src={Images.Footer}
                  style={{ width: "100%" }}
                  alt="Footer"
                />
              </Box>
            </>
          )}
        >
           <Box
            id="pdf-sec"
            style={{
              padding: "20px",
              paddingTop: "120px",
              paddingBottom: "60px",
            }}
          >
          <Box
            id="pdf-sec"
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: Colors.primary,
              textAlign: "center",
              margin: "0",
              marginBottom: "20px",
              // paddingTop: "120px",
            }}
          >
            JOB DETAIL
          </Box>
          <Grid id="pdf-sec" container spacing={2} sx={{ pl:4}}>
            <Grid item xs={12} md={12}>
              <Grid container>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Property Name
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.property?.name}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Address
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {" "}
                    {data?.property?.map_address ?data?.property?.map_address :"-"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Assigned Employees
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.assigned_employees?.length > 0 && (
                      <>
                        <Typography sx={{ fontSize: "12px" }}>
                          {data.assigned_employees.map((item, index) => (
                            <span style={{ fontSize: "12px" }} key={index}>
                              {item.first_name} {item.last_name}
                              {index < data.assigned_employees.length - 1 &&
                                ", "}
                            </span>
                          ))}
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12}>
              <Grid container>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Job Name
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.name ? data?.name : "0"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Phone Number
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.phone ?"+" + data?.phone : "0"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Management Company
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.company ? data?.company?.name : "-"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Property
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.property ? data?.property?.name : "-"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Contact Person
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.cp_name ? data?.cp_name : "-"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Contact Person Title
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.cp_title ? data?.cp_title : "-"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Contact Person Phone
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.cp_phone ? "+" + data?.cp_phone : "0"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Experience
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.experience ? data?.experience : "0"} Year
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Desired Position
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.position}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Skill
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.skill_type}
                  </Grid>
                </Grid>
                {Object.keys(groupedSkills).map((category) => (
                  <Grid item xs={12} container key={category}>
                    <Grid item xs={6} sx={{ fontWeight: 500 }}>
                      {category}
                    </Grid>
                    <Grid item xs={6} sx={{ fontWeight: 500 }}>
                      {groupedSkills[category].join(" , ")}
                    </Grid>
                  </Grid>
                ))}
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Hours Available
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.temporary_work?.hours_from +
                      " - " +
                      data?.temporary_work?.hours_to}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Work on same day assignment required?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.temporary_work?.same_day_assignment === false
                      ? "No"
                      : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Work on Weekends Required?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.temporary_work?.work_weekends === false
                      ? "No"
                      : "Yes"}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={12}>
              <Grid container>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    On Call After Hours/Weekends?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.temporary_work?.after_hours === false ? "No" : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Work on Weekends Required?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.temporary_work?.work_weekends === false
                      ? "No"
                      : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Own Transport required?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.transportation === false ? "No" : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Travelling Required?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.travel === false ? "No" : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Working on Braunfels Required?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.new_branfels === false ? "No" : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Working on Boerne Required?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.boerne === false ? "No" : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Salary Offered
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {"$" + data?.direct_hire?.desired_salary}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    On Call After Hours/Weekends?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.direct_hire?.after_hours === false ? "No" : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Work on Weekends Required?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.direct_hire?.work_weekends === false ? "No" : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Insurance Benefits Provided?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.direct_hire?.insurance_mandatory === false
                      ? "No"
                      : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Required to Live on Site?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.live_on_site === false ? "No" : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Relocation Required?
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.relocate === false ? "No" : "Yes"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Additional Notes
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    {data?.additional_notes || "-"}
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                    Background Checks
                  </Grid>
                  <Grid item xs={6} sx={{ fontWeight: 500 }}>
                  <ul style={{listStyle:'none'}}>
    {data?.codes_details?.map((code, index) => (
        <li key={index}>
            {code?.code}: {code.value}
        </li>
    ))}
</ul>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          </Box>
        </PDFExport>
      </Box>
    </>
  );
}
