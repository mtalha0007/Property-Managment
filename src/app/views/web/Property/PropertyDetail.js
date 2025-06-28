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
import { ErrorToaster } from "../../../components/Toaster";
import { useParams } from "react-router-dom";

// Sample images data - replace with your actual images
// const propertyImages = [
//   {
//     original:
//       "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
//     thumbnail:
//       "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
//     description: "Elegant Dining Area",
//   },
//   {
//     original:
//       "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
//     thumbnail:
//       "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
//     description: "Elegant Dining Area",
//   },
//   {
//     original:
//       "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80",
//     thumbnail:
//       "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
//     description: "Luxurious Bedroom",
//   },
//   {
//     original:
//       "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
//     thumbnail:
//       "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
//     description: "Modern Living Room",
//   },
//   {
//     original:
//       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
//     thumbnail:
//       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
//     description: "Spacious Kitchen",
//   },
//   {
//     original:
//       "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
//     thumbnail:
//       "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
//     description: "Master Bathroom",
//   },
// ];

function PropertyDetail() {
  const param = useParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [propertyImages, setPropertyImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  const getProperties = async () => {
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
    getProperties();
  }, []);

  return (
    <>
      <Header />
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1400px", mx: "auto" }}>
        <Grid container spacing={2}>
          {/* Main Image Section */}
          <Grid item xs={12} md={propertyImages?.length > 1 ? 8 :12}>
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
            <Grid item xs={12} lg={ 8}>
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
                    <Typography variant="h6" sx={{ color: "#34495e", mb: 2 }}>
                    {propertyData?.address}
                    </Typography>

                    {/* Property Specs */}
                    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Bed sx={{ color: "#7f8c8d" }} />
                        <Typography variant="body1">{propertyData?.beds} Beds</Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Bathtub sx={{ color: "#7f8c8d" }} />
                        <Typography variant="body1">{propertyData?.baths} Baths</Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <SquareFoot sx={{ color: "#7f8c8d" }} />
                        <Typography variant="body1">{propertyData?.area} sqft</Typography>
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
                          <TableCell sx={{ border: "none", py: 1.5 ,textTransform:"capitalize"}}>
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
                          <TableCell sx={{ border: "none", py: 1.5 ,textTransform:"capitalize"}}>
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
              <Card sx={{ mb: 3 }}>
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
              </Card>

              {/* Community Card */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <img
                      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      alt="Fairway Villas 3"
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
                        Fairway Villas 3
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#6c757d" }}>
                        See the community attractions and lifestyle
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Promotional Card */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "#6c757d", mb: 1 }}>
                    Starting from AED 655k
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Experience luxury waterfront living at Azizi Venice
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
                      src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80"
                      alt="Venice Logo"
                      style={{ width: 40, height: 30, objectFit: "contain" }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      VENICE
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#16a085",
                      "&:hover": { backgroundColor: "#138d75" },
                    }}
                  >
                    Register Now
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
    </>
  );
}

export default PropertyDetail;
