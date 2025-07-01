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
Chip,useTheme

} from "@mui/material";
import {
  Map as MapIcon,
  CalendarToday,
  Home,
  AttachMoney,
  Bed,
  Bathtub,
} from "@mui/icons-material"
import React, { useEffect, useRef, useState, usedata } from "react";
import Colors from "../../../../assets/styles";
import { Images, Svgs } from "../../../../assets/images";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment/moment";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { PDFExport } from "@progress/kendo-react-pdf";
import PropertyServices from "../../../../api/PropertyServices/property.index";
import { ErrorToaster } from "../../../../components/Toaster";

const InfoRow = ({ label, value }) => (
  <Box display="flex" py={1}>
    <Box flex={2} color="text.secondary" fontWeight={500}>
      {label}
    </Box>
    <Box flex={3}>{value || "-"}</Box>
  </Box>
)

export default function PropertyDetails() {
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(false);
const theme = useTheme();
  const param = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  console.log(baseUrl);
  
 
  const getProperties = async () => {
    setLoading(true);
    try {
      const { data } = await PropertyServices.getPropertyById(param?.id);
      console.log(data)
      setPropertyData(data?.property)
    } catch (error) {
      ErrorToaster(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProperties();
  }, []);
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
            Properties /
          </Typography>

          <Typography
            sx={{ fontSize: "22px", color: Colors.primary, fontWeight: "600" }}
          >
            Property Detail
          </Typography>
        </Box>
        {/* <Box
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
        </Box> */}
      </Box>
      <Box maxWidth="lg" mx="auto" p={2}>
      <Card elevation={3} sx={{ borderRadius: 2, mb: 3 ,padding:"20px 6px 20px 6px"}}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                src=""
                sx={{ width: 96, height: 96, fontSize: 32, bgcolor: theme.palette.primary.main }}
              >
                {propertyData?.name?.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {propertyData?.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                <MapIcon fontSize="small" />
                <Typography variant="body2">{propertyData?.address}</Typography>
              </Box>
              <Box mt={1} display="flex" gap={1}>
                <Chip label={propertyData?.type} color="primary" variant="outlined" />
                <Chip label={propertyData?.status} variant="outlined" />
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="h4" color="success.main" fontWeight={700}>
                AED {  propertyData?.price}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="right">
                {propertyData?.payment_terms}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {/* Basic Info */}
        <Grid item xs={12} md={6}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Home color="primary" />
                <Typography variant="h6">Basic Information</Typography>
              </Box>
              {[
                ["Reference No", propertyData?.refno],
                ["Property Type", propertyData?.type],
                ["Purpose", propertyData?.purpose],
                ["Date Added", moment(propertyData?.createdAt).format("DD-MM-YYYY")],
                ["Location", propertyData?.location],
                ["Description", propertyData?.description],
              ].map(([label, value]) => (
                <InfoRow key={label} label={label} value={value} />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Property Details */}
        <Grid item xs={12} md={6}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <AttachMoney color="primary" />
                <Typography variant="h6">Property Details</Typography>
              </Box>
              {[
                ["Area", `${propertyData?.area} sq ft`],
                ["Bedrooms", (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Bed fontSize="small" /> {propertyData?.beds}
                  </Box>
                )],
                ["Bathrooms", (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Bathtub fontSize="small" /> {propertyData?.baths}
                  </Box>
                )],
                ["Category", propertyData?.category],
                ["Availability", propertyData?.timing],
                ["Features", (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {propertyData?.features?.map((feature, i) => (
                      <Chip key={i} label={feature} variant="outlined" size="small" />
                    ))}
                  </Box>
                )],
              ].map(([label, value]) => (
                <InfoRow key={label} label={label} value={value} />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Booked Dates */}
        {/* {propertyData?.bookedDates?.length > 0 && (
          <Grid item xs={12}>
            <Card elevation={1} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <CalendarToday color="primary" />
                  <Typography variant="h6">Booked Dates</Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {propertyData.bookedDates.map((date, i) => (
                    <Chip key={i} label={moment(date).format("DD-MM-YYYY")} color="secondary" size="small" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )} */}
      </Grid>
    </Box>
  

    
    </>
  );
}
