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
import Colors from "../../../../assets/styles";
import { Images, Svgs } from "../../../../assets/images";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import PropertyServices from "../../../../api/PropertyServices/property.index";
import { ErrorHandler } from "../../../../utils/ErrorHandler";
import Loader from "../../../../components/Loader";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { PDFExport } from "@progress/kendo-react-pdf";

const tableHead = [
  "Num ID",
  "Property Name",
  "Management Company",
  "Address",
  "Contact Name",
  "Contact No",
];
export default function CompanyDetails() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [count, setCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0); // Adjusted to 0-based index
  const [dateJoined, setDateJoined] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [value, setValue] = useState(0);

  const rowsPerPage = 6;
  const { state } = useLocation();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let sleep = () => new Promise((r) => setTimeout(r, 1000));
  console.log(state);
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const getProperties = async (
    searchParam = "",
    idParam = "",
    pageParam = 1,
    limitParam = 10,
    companyId
  ) => {
    setLoading(true);
    try {
      await sleep();
      const { data } = await PropertyServices.getProperty(
        searchParam,
        idParam,
        pageParam,
        limitParam,
        companyId
      );
      console.log(data.list);
      setData(data.list);
      setCount(data.count);
      setLoading(false);
    } catch (error) {
      ErrorHandler(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProperties(search, id, page + 1, limit, state._id);
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    console.log("Base URL:", baseUrl);
    console.log("Logo Path:", state?.logo);
    console.log("Full Logo URL:", baseUrl + state?.logo);
  }, [baseUrl, state?.logo]);

  // const tableHead = [
  //   "Property Name",
  //   "Management Company",
  //   "Address",
  //   "Location",
  //   "Contact Name",
  //   "Contact No   ",

  // ];
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(item.name.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const handleExportWithComponent = (pdfExportComponent) => {
    pdfExportComponent.current.save();
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          alignItems: "center",
          mt: 10,
          pl: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
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
            Companies /
          </Typography>

          <Typography
            sx={{ fontSize: "22px", color: Colors.primary, fontWeight: "600" }}
          >
            Company Detail
          </Typography>
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
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <Avatar
                    alt="Maria Johnson"
                    src={baseUrl + state?.logo}
                    sx={{ width: 100, height: 100 }}
                  />
                  <Box>
                    <Typography
                      sx={{ fontSize: "24px", color: Colors.primary }}
                    >
                      {state?.name}
                    </Typography>
                  </Box>
                </Box>

                <IconButton
                  sx={{
                    mt: -8,
                    ":hover": {
                      background: "none !important",
                    },
                  }}
                  onClick={() =>
                    navigate("/companies/update", { state: state })
                  }
                >
                  <ModeEditIcon />
                </IconButton>
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
        <CardContent>
          <Box display="flex" gap="25px" justifyContent={"space-between"}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ fontWeight: "bold", fontSize: "18px" }}>
                  Basic Information
                </Box>
                {/* <IconButton
                  sx={{
                    ":hover": {
                      background: "none !important",
                    },
                  }}
                  onClick={() =>
                    navigate("/companies/update", { state: state })
                  }
                >
                  <ModeEditIcon />
                </IconButton> */}
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 1 }}>
                <Box sx={{ width: "150px" }}>Phone</Box>
                <Box sx={{ color: Colors.primary }}>{"+" + state?.phone}</Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 1 }}>
                <Box sx={{ width: "150px" }}>Email</Box>
                <Box sx={{ color: Colors.primary }}>{state?.email}</Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 1 }}>
                <Box sx={{ width: "150px" }}>Date Added</Box>
                <Box sx={{ color: Colors.primary }}>
                  {moment(state?.created_at).format("DD-MM-YYYY")}
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: "15px", pt: 1 }}>
                <Box sx={{ width: "150px" }}> Additional Notes</Box>
                <Box sx={{ color: Colors.primary, width: "80%" }}>
                  {state.notes ? state?.notes : "-"}
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <TableContainer
        sx={{
          mt: 2,
          width: "97%",
          ml: 2,
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
                      column == "Management Company" ? "left" : "center",
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
            <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow
                  key={row._id}
                  onClick={() => navigate("/properties/details", { state: row })}
                >
                  <TableCell sx={{ textAlign: "center" }}>{row.num_id}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.name}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Avatar src={baseUrl + row.company.logo} />
                      {row.company.name}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.map_address}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.cp_name}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{"+" + row.cp_phone}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          
          )}
        </Table>
      </TableContainer>

      <Box>
        <PDFExport
          ref={contentRef}
          landscape={false}
          paperSize="A4"
          margin={0}
          fileName="Company Detail"
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
            className="pdf-sec"
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: Colors.primary,
              textAlign: "center",
              margin: "0",
              paddingTop: "120px",
            }}
          >
            COMPANY DETAIL
          </Box>
          <Grid
            className="pdf-sec"
            container
            spacing={2}
            sx={{ mt: 3, ml: 4, mr: 2 }}
          >
            {/* <Grid item xs={12} display="flex" justifyContent="space-between">
              <Box display="flex" gap="10px">
                <Box>
                  <Typography sx={{ fontSize: "12px" }}>
                    Company Name:
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "12px" }}>
                    {state?.name}
                  </Typography>
                </Box>
              </Box>
            </Grid> */}

            <Grid item xs={12}>
              
              <Grid container spacing={1} sx={{ pt: 1 }}>
              <Grid item xs={4} >
              Company Name:
                </Grid>
                <Grid item xs={8}>
                {state?.name}
                </Grid>
                <Grid item xs={4}>
                  Phone
                </Grid>
                <Grid item xs={8} >
                  {"+" + state?.phone}
                </Grid>
                <Grid item xs={4}>
                  Email
                </Grid>
                <Grid item xs={8} >
                  {state?.email}
                </Grid>
                <Grid item xs={4}>
                  Date Added
                </Grid>
                <Grid item xs={8} >
                  {moment(state?.created_at).format("DD-MM-YYYY")}
                </Grid>
                <Grid item xs={4}>
                  Additional Notes
                </Grid>
                <Grid item xs={8} >
                  {state?.notes ? state?.notes : "-"}
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ pt: 1, pl: 2 }}>
              {/* Property Names */}
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ flex: 1, fontWeight: 500 }}>Property Names:</Box>
                <Box
                  sx={{
                    flex: 2,
                  
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {filteredData.map((row) => row?.name).join(", ")}
                </Box>
              </Grid>

              <Grid container spacing={1} sx={{ pt: 1, pl: 1 }}>
                {/* Property Address */}
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box sx={{ flex: 1, fontWeight: 500 }}>Property Address:</Box>
                  <Box sx={{ flex: 2 }}>
                    {filteredData.map((row) => row?.address).join(", ")}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </PDFExport>
      </Box>
    </>
  );
}
