import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Avatar,
  Link,
  InputLabel,
  TextField,
  Stack,
} from "@mui/material";
import {
  LocationOn,
  PlayArrow,
  PhotoLibrary,
  Close,
  Favorite,
  Share,
  Email,
  Phone,
  WhatsApp,
  Bed,
  Bathtub,
  SquareFoot,
  CheckCircle,
} from "@mui/icons-material";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Header from "../Header";
import PropertyServices from "../../../api/PropertyServices/property.index";
import { ErrorToaster, SuccessToaster } from "../../../components/Toaster";
import { useNavigate, useParams } from "react-router-dom";
import SimpleDialog from "../../../components/Dialog";
import { useForm, Controller } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RoomIcon from "@mui/icons-material/Room";

// import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Colors from "../../../assets/styles";
import Loader from "../../../components/Loader";
import FileServices from "../../../api/FileServices/file.index";
import { useAuth } from "../../../context";
import AuthServices from "../../../api/AuthServices/auth.index";
import { AddressForm } from "../../../components/AdressMap";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

function PropertyDetail() {
  const param = useParams();
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [propertyImages, setPropertyImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openBookDialog, setOpenBookDialog] = useState(false);
  const [document, setDocument] = useState(null);
  const [docLoading, setDocLoading] = useState(false);
  const { webUser } = useAuth();
  const [openMapModal, setOpenMapModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: propertyData?.latitude || 25.276987,
    lng: propertyData?.longitude || 55.296249,
  };
  const timeSlots = [
    "1-2",
    "2-3",
    "3-4",
    "4-5",
    "5-6",
    "6-7",
    "7-8",
    "8-9",
    "9-10",
    "10-11",
    "11-12",
    "12-1",
  ];
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const selectedTime = watch("timeSlot");

  const handleUploadDoc = async (e) => {
    setDocLoading(true);
    const formData = new FormData();
    const selectedFiles = Array.from(e.target.files);

    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await FileServices.uploadDocument(formData);
      console.log(response);
      setDocument(response?.url);

      SuccessToaster(response?.message);
    } catch (error) {
      ErrorToaster(error);
    } finally {
      setDocLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setBookingLoading(true);
    const obj = {
      name: webUser?.name,
      email: webUser?.email,
      agent_id: webUser?._id,
      property_id: propertyData?._id,
      doc: document,
      date: data?.date,
      time: data?.timeSlot,
      notes: data?.notes,
    };
    console.log(obj);
    try {
      const response = await AuthServices.createBooking(obj);

      SuccessToaster(response?.message);
      setOpenBookDialog(false);
      reset();
      setValue("timeSlot", "");
      setDocument(null);
    } catch (error) {
      ErrorToaster(error);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  const getPropertiesByID = async () => {
    setLoading(true);
    try {
      const { data } = await PropertyServices.getPropertyById(param?.id);
      console.log(data);
      setPropertyData(data?.property);
      setPropertyImages(data?.property?.images);
    } catch (error) {
      ErrorToaster(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPropertiesByID();
  }, [navigate]);

  const getProperties = async (
    searchParam = "",
    idParam = "",
    pageParam = 1,
    limitParam = 10
  ) => {
    setLoading(true);
    try {
      const { data } = await PropertyServices.getProperty(
        searchParam,
        idParam,
        pageParam,
        limitParam
      );

      // Exclude the property with currentPropertyId
      const filteredProperties = data?.properties?.filter(
        (property) => property._id !== param?.id
      );

      setProperties(filteredProperties);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProperties("", "", 1, 4);
  }, [navigate]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCsT-b8-J4wnqKYUBFROMPQr_IEYdjNiSg", // Replace this
  });

  if (!isLoaded)
    return (
      <div style={{ display: "flex",justifyContent:"center", alignItems:"center" ,height:"100vh"}}>
        {" "}
        <Loader width="40px" height="40px" color={Colors.primary} />
      </div>
    );

  return (
    <>
      <Header />
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", mx: "auto" }}>
        <Grid container spacing={2}>
          {/* Main Image Section */}
          <Grid item xs={12} md={propertyImages?.length > 1 ? 8 : 12}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                height: { xs: "300px", md: "510px" },

                cursor: "pointer",
                "&:hover": {
                  "& .overlay": {
                    opacity: 1,
                  },
                },
              }}
              onClick={() => handleImageClick(0)}
            >
              <img
                src={propertyImages[0]}
                alt="Property Main View"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Hover Overlay */}
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <PhotoLibrary sx={{ fontSize: 48, color: "white" }} />
              </Box>
            </Box>
          </Grid>

          {/* Thumbnail Grid */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={1}>
              {propertyImages.slice(1, 3).map((image, index) => (
                <Grid item xs={12} key={index + 1}>
                  <Box
                    sx={{
                      position: "relative",
                      height: { xs: "300px", md: "250px" },

                      overflow: "hidden",
                      cursor: "pointer",
                      borderRadius: 2,

                      "&:hover": {
                        "& .thumbnail-overlay": {
                          opacity: 1,
                        },
                      },
                    }}
                    onClick={() => handleImageClick(index + 1)}
                  >
                    <img
                      src={image}
                      alt={`Property view ${index + 2}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    {/* Last thumbnail overlay with count */}
                    {index === 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                          +{propertyImages.length - 2}
                        </Typography>
                      </Box>
                    )}

                    {/* Hover overlay */}
                    <Box
                      className="thumbnail-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <PhotoLibrary sx={{ fontSize: 24, color: "white" }} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid item xs={12} lg={8}>
              {/* Price and Basic Info */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: "bold", color: "#2c3e50", mb: 1 }}
                    >
                      AED {propertyData?.price}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Typography variant="h6" sx={{ color: "#34495e", mb: 2 }}>
                        {propertyData?.address}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#34495e",
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => setOpenMapModal(true)}
                      >
                        <RoomIcon color="primary" />View Map Location
                      </Typography>
                    </Box>
                    <SimpleDialog
                      open={openMapModal}
                      onClose={() => setOpenMapModal(false)}
                      title={"Property Location"}
                    >
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={15}
                      >
                        <MarkerF position={center} />
                      </GoogleMap>
                    </SimpleDialog>
                    {/* Property Specs */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Bed sx={{ color: "#7f8c8d" }} />
                        <Typography variant="body1">
                          {propertyData?.beds} Beds
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Bathtub sx={{ color: "#7f8c8d" }} />
                        <Typography variant="body1">
                          {propertyData?.baths} Baths
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <SquareFoot sx={{ color: "#7f8c8d" }} />
                        <Typography variant="body1">
                          {propertyData?.area} sqft
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Property Description */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    {propertyData?.features?.join(" | ")}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
                    {propertyData?.description}
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Property Overview:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    • Location: {propertyData?.location}
                  </Typography>
                </CardContent>
              </Card>

              {/* Property Information Table */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                    Property Information
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Name
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            {propertyData?.name}
                          </TableCell>
                          {/* <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            TruCheck™ on
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              16 April 2025
                              <IconButton size="small">
                                <CheckCircle
                                  sx={{ fontSize: 16, color: "#27ae60" }}
                                />
                              </IconButton>
                            </Box>
                          </TableCell> */}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Type
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            {propertyData?.type}
                          </TableCell>
                          {/* <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            TruCheck™ on
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              16 April 2025
                              <IconButton size="small">
                                <CheckCircle
                                  sx={{ fontSize: 16, color: "#27ae60" }}
                                />
                              </IconButton>
                            </Box>
                          </TableCell> */}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Purpose
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            {propertyData?.purpose}
                          </TableCell>
                          {/* <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Added on
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            16 April 2025
                          </TableCell> */}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Reference no.
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            {propertyData?.refno}
                          </TableCell>
                          {/* <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Handover date
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            Q1 2028
                          </TableCell> */}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Payment Terms
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "none",
                              py: 1.5,
                              textTransform: "capitalize",
                            }}
                          >
                            {propertyData?.payment_terms}
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          ></TableCell>
                          <TableCell
                            sx={{ border: "none", py: 1.5 }}
                          ></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Category
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "none",
                              py: 1.5,
                              textTransform: "capitalize",
                            }}
                          >
                            {propertyData?.category}
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          ></TableCell>
                          <TableCell
                            sx={{ border: "none", py: 1.5 }}
                          ></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              {/* Validated Information */}
              {/* <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      Validated Information
                    </Typography>
                    <CheckCircle sx={{ color: "#27ae60" }} />
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Developer
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            EMAAR DUBAI SOUTH DWC LLC
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Built-up Area
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            4,036 sqft
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Ownership
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            Freehold
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Usage
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            Residential
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          >
                            Plot Area
                          </TableCell>
                          <TableCell sx={{ border: "none", py: 1.5 }}>
                            4,029 sqft
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: "bold", border: "none", py: 1.5 }}
                          ></TableCell>
                          <TableCell
                            sx={{ border: "none", py: 1.5 }}
                          ></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card> */}
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              {/* Agent Card */}
              {/* <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Avatar
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      sx={{ width: 60, height: 60 }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Mario Costa
                      </Typography>
                      <Chip
                        label="Responsive Broker"
                        size="small"
                        sx={{
                          backgroundColor: "#f8f9fa",
                          color: "#6c757d",
                          mt: 0.5,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Email />}
                      fullWidth
                      sx={{
                        borderColor: "#16a085",
                        color: "#16a085",
                        "&:hover": {
                          borderColor: "#138d75",
                          backgroundColor: "rgba(22, 160, 133, 0.04)",
                        },
                      }}
                    >
                      Email
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Phone />}
                      fullWidth
                      sx={{
                        borderColor: "#16a085",
                        color: "#16a085",
                        "&:hover": {
                          borderColor: "#138d75",
                          backgroundColor: "rgba(22, 160, 133, 0.04)",
                        },
                      }}
                    >
                      Call
                    </Button>
                    <IconButton
                      sx={{
                        border: "1px solid #25d366",
                        color: "#25d366",
                        "&:hover": {
                          backgroundColor: "rgba(37, 211, 102, 0.04)",
                        },
                      }}
                    >
                      <WhatsApp />
                    </IconButton>
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      D V R C Real Estate
                    </Typography>
                    <Link
                      href="#"
                      sx={{
                        color: "#16a085",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                      }}
                    >
                      View all properties →
                    </Link>
                  </Box>
                </CardContent>
              </Card> */}

              {/* Community Card */}
              <Typography sx={{ fontSize: "20px", fontWeight: "bold", mb: 1 }}>
                Related Properties
              </Typography>
              {properties.map((property, index) => (
                <Card
                  key={index}
                  onClick={() => navigate(`/property-detail/${property._id}`)}
                  sx={{ mb: 3, cursor: "pointer" }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <img
                        src={property?.images?.[0]}
                        alt={property?.name}
                        style={{
                          width: 80,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          {property?.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#6c757d", mb: 1 }}
                        >
                          {property?.description}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "green" }}>
                          Price: AED {property?.price?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              {/* Promotional Card */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6c757d", mb: 1 }}>
                    Starting from AED {propertyData?.price}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {propertyData?.description?.substring(0, 100)}...
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <img
                      src={propertyData?.images?.[0]}
                      alt="Venice Logo"
                      style={{ width: 40, height: 30, objectFit: "contain" }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {propertyData?.name}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#16a085",
                      color: Colors.white,
                      "&:hover": { backgroundColor: "#138d75" },
                    }}
                    onClick={() => setOpenBookDialog(true)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        {/* Lightbox Modal */}
        {lightboxOpen && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={handleCloseLightbox}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <Close />
            </IconButton>

            <Box sx={{ width: "90%", height: "90%", maxWidth: "1200px" }}>
              <ImageGallery
                items={propertyImages}
                startIndex={currentImageIndex}
                showThumbnails={!isMobile}
                showPlayButton={false}
                showFullscreenButton={true}
                showNav={true}
                autoPlay={false}
                slideDuration={300}
                slideInterval={3000}
                thumbnailPosition={isMobile ? "bottom" : "bottom"}
                renderItem={(item) => (
                  <div style={{ height: isMobile ? "60vh" : "70vh" }}>
                    <img
                      src={item}
                      alt={item.description}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Dialog for booking */}

      <SimpleDialog
        open={openBookDialog}
        onClose={() => {
          setOpenBookDialog(false);
          reset();
          setValue("timeSlot", "");
          setDocument(null);
        }}
        border={`4px solid ${Colors.primary}`}
        title={`Book This ${propertyData?.type}`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Date Picker */}

            <Grid item xs={12} md={12}>
              <InputLabel>Select Date</InputLabel>

              <TextField
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.date}
                helperText={errors.date?.message}
                {...register("date", { required: "Date is required" })}
              />
            </Grid>

            {/* Time Slot Chips */}
            <Grid item xs={12} md={12}>
              <InputLabel>Select Time Slot</InputLabel>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {timeSlots.map((slot) => (
                  <Chip
                    key={slot}
                    label={slot}
                    clickable
                    color={selectedTime === slot ? "primary" : "default"}
                    onClick={() =>
                      setValue("timeSlot", slot, { shouldValidate: true })
                    }
                  />
                ))}
              </Box>
              {errors.timeSlot && (
                <Typography color="error" variant="caption">
                  {errors.timeSlot.message}
                </Typography>
              )}
              {/* Hidden time slot input */}
              <input
                type="hidden"
                {...register("timeSlot", { required: "Time slot is required" })}
              />
            </Grid>

            {/* Document Upload */}
            <Grid item xs={12} md={12}>
              <InputLabel>Upload Document</InputLabel>
              <Box
                component="label"
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  bgcolor: "#f9f9f9",
                  gap: 1,
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                {docLoading ? (
                  <Loader width="30px" height="30px" color={Colors.primary} />
                ) : (
                  <>
                    <CloudUploadIcon sx={{ fontSize: 28, color: "#999" }} />
                    <Typography variant="caption">
                      {document ? `Document Uploaded` : "Upload RERA Document"}
                    </Typography>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  hidden
                  {...register("document", {
                    required: "Document is required",
                  })}
                  onChange={handleUploadDoc}
                />
              </Box>
              {errors.document && (
                <Typography color="error" variant="caption">
                  {errors.document.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={12}>
              <InputLabel>Additional Notes </InputLabel>

              <TextField
                type="text"
                fullWidth
                placeholder="Type Additional Notes here"
                InputLabelProps={{
                  shrink: true,
                }}
                {...register("notes")}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ color: Colors.white }}
                fullWidth
              >
                {bookingLoading ? (
                  <Loader width="20px" height="20px" color={Colors.primary} />
                ) : (
                  "Book Now"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </SimpleDialog>
    </>
  );
}

export default PropertyDetail;
