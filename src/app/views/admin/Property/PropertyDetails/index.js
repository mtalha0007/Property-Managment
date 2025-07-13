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
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import DescriptionIcon from "@mui/icons-material/Description";


const InfoRow = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between" mb={1}>
    <Typography fontWeight="bold">{label}:</Typography>
    <Typography sx={{textTransform:'capitalize'}}>{value}</Typography>
  </Box>
);


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
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
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
                src={propertyData?.images?.[0]}
                sx={{ width: 96, height: 96, fontSize: 32 }}
              >
                
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
                <Chip label={propertyData?.type == "commercialOffice" ? "Commercial Office" :""} color="primary" variant="outlined" />
                <Chip label={propertyData?.status} variant="outlined" />
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="h4" color="success.main" fontWeight={700}>
                 { formatPrice(propertyData?.price)}
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
          ["Unit Number", propertyData?.unit_number],
          ["Selling Price/sqft", formatPrice(propertyData?.selling_price_sqft)],
          ["Annual Rental Price", formatPrice(propertyData?.rental_price)],
          ["Rental Price/sqft", formatPrice(propertyData?.rental_price_per_sqft)],
          ["Service Charges", formatPrice(propertyData?.service_charges)],
          ["Status", propertyData?.rented_vacant],
          ["Purpose", propertyData?.purpose  == "both" ? "Sale-Rent (Both)" :propertyData?.purpose],
         
          
          ["Description", propertyData?.description],
          propertyData?.images?.length > 0
    ? [
        "Images",
        <Box display="flex" flexWrap="wrap" gap={2}>
          {propertyData.images.map((img, index) => (
            <Box
              key={index}
              sx={{
                width: 100,
                height: 80,
                overflow: "hidden",
                borderRadius: 2,
                cursor: "pointer",
                boxShadow: 1,
              }}
              onClick={() => window.open(img, "_blank")}
            >
              <img
                src={img}
                alt={`Property ${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>,
      ]
    : null,


        ].filter(Boolean).map(([label, value]) => (
          <InfoRow key={label} label={label} value={value || "—"} />
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
        
          ["Category", propertyData?.category == "furnished" ? "Fully Furnished" : propertyData?.category],
          ["Availability ?", propertyData?.comments],
          ["Parking Spaces", propertyData?.parking_space],
          
          // Inside Property Details Card


// Add below map
propertyData?.brochureDocumment && [
  "Brochure Document",
  <Button
    variant="outlined"
    size="small"
    onClick={() => window.open(propertyData.brochureDocumment, "_blank")}
    startIcon={<DescriptionIcon />}
  >
    View Brochure
  </Button>,
],
propertyData?.buildingLayout && [
  "Building Layout",
  <Button
    variant="outlined"
    size="small"
    onClick={() => window.open(propertyData.buildingLayout, "_blank")}
    startIcon={<DescriptionIcon />}
  >
    View Layout
  </Button>,
],

          [
            "Features",
            <Box display="flex" flexWrap="wrap" gap={1}>
              {propertyData?.features?.map((feature, i) => (
                <Chip key={i} label={feature} variant="outlined" size="small" />
              ))}
            </Box>,
          ],
          propertyData?.rented_vacant === "rented" && ["Tenure (Years)", propertyData?.tenure_years],
          propertyData?.rented_vacant === "rented" && [
            "Lease Start Date",
            propertyData?.lease_start_date
              ? moment(propertyData.lease_start_date).format("DD-MM-YYYY")
              : "—",
          ],
          propertyData?.rented_vacant === "rented" && [
            "Lease End Date",
            propertyData?.lease_end_date
              ? moment(propertyData.lease_end_date).format("DD-MM-YYYY")
              : "—",
          ],
          propertyData?.rented_vacant === "rented" && [
            "Contract Value",
            propertyData?.contract_value ? formatPrice(propertyData.contract_value) : "—",
          ],
        ]
          .filter(Boolean) // remove false/null rows
          .map(([label, value]) => (
            <InfoRow key={label} label={label} value={value || "—"} />
          ))}
      </CardContent>
    </Card>
  </Grid>
</Grid>

    </Box>
  

    
    </>
  );
}
