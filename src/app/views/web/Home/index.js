"use client";

import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  InputLabel,
  Paper,
  Menu,
  MenuItem,
  InputBase,
  FormControl,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
  Close as CloseIcon,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
  Shield,
  CheckCircle,
  SquareFoot,
  ExpandMore,
} from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import CropSquareIcon from "@mui/icons-material/CropSquare";

import { Images } from "../../../assets/images";
import Loader from "../../../components/Loader";

import Colors from "../../../assets/styles";
import { useForm } from "react-hook-form";
import SimpleDialog from "../../../components/Dialog";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AuthServices from "../../../api/AuthServices/auth.index";
import { ErrorToaster, SuccessToaster } from "../../../components/Toaster";
import FileServices from "../../../api/FileServices/file.index";
import { useAuth } from "../../../context";
import PropertyServices from "../../../api/PropertyServices/property.index";
import Header from "../Header";
import { Send } from "@mui/icons-material";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openBookDialog, setOpenBookDialog] = useState(false);
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState([]);
  const [maxMin, setMaxMin] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [filters, setFilters] = useState({
    propertyType: "",
    location: "",
    bedrooms: "",
    priceRange: [0, 10000000],
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };
  const { WebUserLogin, webUser } = useAuth();
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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (filters.location) {
      params.append("location", filters.location);
    }

    if (filters.propertyType) {
      params.append("type", filters.propertyType);
    }

    if (filters.priceRange?.length === 2) {
      params.append("priceMin", filters.priceRange[0]);
      params.append("priceMax", filters.priceRange[1]);
    }
    if (selectedType) {
      params.append("purpose", selectedType.toLowerCase());
    }

    navigate(`/property-list?${params.toString()}`);
  };

  const mobileMenu = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          backgroundColor: "#fff",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "#4a5568" }}>
          Menu
        </Typography>
        <IconButton onClick={handleMobileMenuToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem button>
          <ListItemText primary="Sign Up / Sign In" />
        </ListItem>
      </List>
    </Drawer>
  );
  const getProperties = async (
    searchParam = "",
    idParam = "",
    pageParam = 1,
    limitParam = 4
  ) => {
    setLoading(true);
    try {
      const { data } = await PropertyServices.getProperty(
        searchParam,
        idParam,
        pageParam,
        limitParam,
        "",
        "",
        "",
        ""
      );
      setProperties(data?.properties);
      setMaxMin(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const features = [
    {
      icon: <DashboardIcon fontSize="large" color="primary" />,
      title: "Smart Dashboard",
      description: "Manage everything in one place with real-time updates.",
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: "Secure Platform",
      description: "Your data is encrypted and protected at every step.",
    },
    {
      icon: <SupportAgentIcon fontSize="large" color="primary" />,
      title: "24/7 Support",
      description: "Get round-the-clock assistance from our expert team.",
    },
  ];

  useEffect(() => {
    getProperties("", "", 1, 8, "", "", "", "");
  }, []);

  const handlePropertyClick = (propertyName) => {
    console.log(`Clicked on ${propertyName}`);
  };

  const socialLinks = [
    { icon: <Facebook />, name: "Facebook", url: "#" },
    { icon: <Twitter />, name: "Twitter", url: "#" },
    { icon: <Instagram />, name: "Instagram", url: "#" },
    { icon: <LinkedIn />, name: "LinkedIn", url: "#" },
  ];

  const onSubmit = async (data) => {
    setBookingLoading(true);
    const obj = {
      name: webUser?.name,
      email: webUser?.email,
      agent_id: webUser?._id,
      property_id: propertyData?._id,
      // doc: document,
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
      // setDocument(null);
    } catch (error) {
      ErrorToaster(error);
    } finally {
      setBookingLoading(false);
    }
  };

  const developers = [
    { name: "DAMAC", logo: Images.hero1 },
    { name: "EMAAR", logo: Images.hero2 },
    { name: "MERAAS", logo: Images.hero3 },
    { name: "SOBHA", logo: Images.hero4 },
    { name: "NAKHEEL", logo: Images.hero5 },
    { name: "Sobha", logo: Images.hero6 },
    { name: "Sobha", logo: Images.hero7 },
    { name: "Sobha", logo: Images.hero8 },
  ];
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />

      {/* Hero  */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "70vh", md: "80vh" },
          overflow: "hidden",
        }}
      >
        {/* Background Video */}
        <Box
          component="video"
          autoPlay
          loop
          muted
          playsInline
          src={Images.video}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />

        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 1,
          }}
        />

        {/* Foreground Content */}
        <Container sx={{ position: "relative", zIndex: 2, height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start", // 👈 left-align
              textAlign: "left",
              color: "white",
              height: "100vh",
              px: { xs: 2, md: 0 },
              maxWidth: "700px",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                lineHeight: 1.1,
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                fontSize: { md: "60px", sm: "50px", xs: "40px" },
              }}
            >
              Your Gateway to Smarter Property Selling
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                mb: 4,
                opacity: 0.95,
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              Connect with the right opportunities, close faster, and scale with
              confidence.
            </Typography>

            {/* Top Tabs (Buy, Rent, Off Plan) */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mb: 2,
              }}
            >
              {["Sell", "Rent", "Both"].map((label) => (
                <Button
                  key={label}
                  variant="outlined"
                  onClick={() => setSelectedType(label)}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    borderRadius: "8px",
                    px: 3,
                    textTransform: "none",
                    backgroundColor:
                      selectedType === label ? Colors.primary : "transparent",
                    "&:hover": {
                      backgroundColor:
                        selectedType === label
                          ? Colors.primary
                          : "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>

            {/* Search Bar with Fields */}
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                p: 1,
                display: { xs: "none", sm: "none", md: "flex" },
                alignItems: "center",
                flexWrap: "wrap",
                width: "100%",
                maxWidth: "700px",
                gap: 1,
              }}
            >
              {/* Location Input */}
              <InputBase
                fullWidth
                value={filters.location}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Area, project or community"
                startAdornment={<SearchIcon sx={{ color: "gray", mr: 1 }} />}
                sx={{
                  flex: 1,
                  px: 1,
                  fontSize: "0.95rem",
                  color: "black",
                }}
              />

              {/* Property Type */}
              <FormControl sx={{ minWidth: 120 }}>
                <Select
                  value={filters.propertyType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      propertyType: e.target.value,
                    }))
                  }
                  displayEmpty
                  size="small"
                  sx={{
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.875rem",
                    padding: "0 8px",
                    ".MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 0,
                      paddingBottom: 0,
                      justifyContent: "start",
                    },
                  }}
                >
                  <MenuItem value="">Select Type</MenuItem>
                  <MenuItem value="commercialOffice">Commercial Office</MenuItem>

                </Select>
              </FormControl>

              {/* Price Range */}
              <FormControl size="small" sx={{}}>
                <Button
                  onClick={handleClick}
                  variant="outlined"
                  endIcon={<ExpandMore />}
                  sx={{
                    height: 40,

                    justifyContent: "space-between",
                    color: "#555",
                    textTransform: "none",
                    borderColor: "#ccc",
                  }}
                  fullWidth
                >
                  {filters.priceRange[0] && filters.priceRange[1]
                    ? `${filters.priceRange[0]} - ${filters.priceRange[1]} AED`
                    : "Select Price Range"}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    sx: { width: 300, p: 2 },
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Price Range (AED)
                  </Typography>
                  <Slider
                    value={filters.priceRange}
                    onChange={(e, newValue) =>
                      setFilters({ ...filters, priceRange: newValue })
                    }
                    valueLabelDisplay="auto"
                    min={maxMin?.min_price || 0}
                    max={maxMin?.max_price || 10000000}
                    step={100000}
                    valueLabelFormat={(value) => `${value} AED`}
                    sx={{ color: Colors.primary }}
                  />
                </Menu>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  backgroundColor: Colors.primary,
                  px: 3,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: Colors.primary,
                    opacity: 0.8,
                  },
                }}
              >
                Search
              </Button>
            </Box>

            <Box
              onClick={() => setOpenFilterModal(true)}
              sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                p: 1,
                display: { md: "none", sm: "flex" },
                alignItems: "center",
                flexWrap: "wrap",
                width: "100%",
                maxWidth: "700px",
                gap: 1,
              }}
            >
              <InputBase
                fullWidth
                value={filters.location}
                placeholder="Area, project or community"
                startAdornment={<SearchIcon sx={{ color: "gray", mr: 1 }} />}
                sx={{
                  flex: 1,
                  px: 1,
                  fontSize: "0.95rem",
                  color: "black",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* <Box
        sx={{
          minHeight: { xs: "70vh", md: "80vh" },
          backgroundImage: `url(${Images.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              textAlign: "center",
              color: "white",
              px: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "2.5rem",
                  sm: "3.5rem",
                  md: "4.5rem",
                  lg: "5rem",
                },
                fontWeight: 700,
                mb: 2,
                lineHeight: 1.1,
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              Discover Your New Home
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                fontWeight: 400,
                mb: 4,
                opacity: 0.95,
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              Helping 100 Helping over 100 million renters find the perfect
              place to call home — with ease, confidence, and convenience.
              renters find their perfect fit.
            </Typography>

            <Box
              sx={{
                maxWidth: 600,
                mx: "auto",
                px: { xs: 2, sm: 0 },
              }}
            >
              <TextField
                fullWidth
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Enter city, state, or ZIP code"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSearch}
                        sx={{
                          backgroundColor: Colors.primary,
                          color: "white",
                          "&:hover": {
                            backgroundColor: Colors.primary,
                            opacity: 0.8,
                          },
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: "white",
                    borderRadius: "50px",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: `2px solid ${Colors.primary}`,
                    },
                  },
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    py: { xs: 1.5, sm: 2 },
                    px: 3,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  },
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box> */}

      <Box sx={{ bgcolor: "#f4f8fb", py: 6 }}>
        <Container>
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={2}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  color: "#1a1a1a",
                  textAlign: { xs: "center", md: "left" },
                  fontWeight: 500,
                }}
              >
                Partners with Dubai’s leading developers
              </Typography>
            </Grid>

            <Grid item xs={12} md={10}>
              <Box
                sx={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    animation: "scrollLeft 30s linear infinite",
                  }}
                >
                  {developers.concat(developers).map((dev, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        px: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        component="img"
                        src={dev.logo}
                        alt={dev.name}
                        sx={{
                          maxWidth: "100px",
                          height: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                {/* Keyframes for scrolling */}
                <style>
                  {`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}
                </style>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/*  Drawer */}

      <Box sx={{ py: { xs: 4, md: 6 }, backgroundColor: "#f8f9fa" }}>
        <Container sx={{ maxWidth: "1300px !important" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontSize: { xs: "20px", sm: "2.25rem", md: "2.75rem" },
                fontWeight: 600,
                color: "#2d3748",
              }}
            >
              Discover Properties
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/property-list")}
                sx={{
                  backgroundColor: Colors.primary,
                  color: "white",
                  px: { xs: 3, sm: 6 },
                  py: { xs: 1, sm: 2 },
                  fontSize: { xs: "12px", sm: "15px", md: "15px" },
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                  "&:hover": {
                    backgroundColor: Colors.primary,
                    boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)",
                    transform: "translateY(-2px)",
                    opacity: 0.8,
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                View More
              </Button>
            </Box>
          </Box>

          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{ mb: 4, justifyContent: "center" }}
          >
            {properties.map((property) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={3}
                sx={{ paddingLeft: "18px !important" }}
                key={property.id}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height={isMobile ? "200" : "250"}
                    image={property.images[0]}
                    alt={property.imageAlt}
                    sx={{ objectFit: "cover" }}
                  />

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      p: { xs: 2, sm: 2 },
                    }}
                  >
                    {/* Title */}
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "1.1rem", sm: "1.25rem" },
                        color: "#2d3748",
                        textAlign: "center",
                        mb: 1,
                      }}
                    >
                      {property.name}
                    </Typography>

                    {/* Address & Type */}
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#718096",
                          fontSize: "0.9rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {formatPrice(property.price)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#718096",
                          fontSize: "0.9rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {property.type == "commercialOffice"
                          ? "Commercial Office"
                          : ""}
                      </Typography>
                    </Box>

                    {/* Beds, Baths, Area */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        mb: 2,
                        color: "#4a5568",
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <LocalParkingIcon fontSize="small" />
                        <Typography variant="body2">
                          {property.parking_space}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={0.5}>
                        <SquareFoot fontSize="small" />
                        <Typography variant="body2">
                          {property.area} sqft
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                      }}
                    >
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: Colors.primary,
                          color: "white",
                          textTransform: "none",
                          fontWeight: 500,
                          "&:hover": {
                            backgroundColor: Colors.primary,
                            opacity: 0.8,
                          },
                        }}
                        onClick={() => {
                          if (webUser?.token) {
                            setPropertyData(property);
                            setOpenBookDialog(true);
                          } else {
                            navigate("/agent/login");
                            ErrorToaster("Please login to book a property");
                          }
                        }}
                      >
                        Book a visit
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "#3a84a6",
                          borderColor: "#3a84a6",
                          textTransform: "none",
                          fontWeight: 500,
                          "&:hover": {
                            borderColor: "#2f6e8b",
                            color: "#2f6e8b",
                          },
                        }}
                        onClick={() =>
                          navigate(`/property-detail/${property._id}`)
                        }
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider
            sx={{
              mt: 13,
              borderColor: "grey",
              borderBottomWidth: "2px",
            }}
          />
        </Container>
      </Box>

      {/* //rental listing  */}
      <Box sx={{ py: { xs: 2, md: 2 }, backgroundColor: "#f8f9fa" }}>
        <Container sx={{ maxWidth: "1300px !important" }}>
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 8 } }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                fontWeight: 600,
                color: "#2d3748",
                mb: 2,
              }}
            >
              The Perfect Place to Manage Your Property
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                color: "#718096",
                fontWeight: 400,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Work with the best suite of property management tools on the
              market.
            </Typography>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {/* Renting Made Simple */}
            <Grid item xs={12}>
              <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
                <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                  <Box sx={{ pr: { md: 2 } }}>
                    <Typography
                      variant="h4"
                      component="h3"
                      sx={{
                        fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                        fontWeight: 600,
                        color: "#2d3748",
                        mb: 2,
                      }}
                    >
                      Professional Agent Portal for Efficient Property
                      Management
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                        color: "#718096",
                        lineHeight: 1.6,
                        mb: 3,
                      }}
                    >
                      The agent portal provides seamless access to the latest
                      property listings. Agents can explore available units,
                      match them to client needs, and schedule viewings through
                      a centralized and intuitive platform. It is designed to
                      enhance productivity, improve coordination, and support
                      agents in delivering an exceptional client experience.{" "}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
                  <Box
                    component="img"
                    src={Images.section2}
                    alt="Person using laptop to browse rental listings"
                    sx={{
                      width: "100%",
                      height: { xs: "250px", md: "300px" },
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ mt: { xs: 2, md: 4 } }}>
              <Divider
                sx={{
                  borderColor: "grey",
                  borderBottomWidth: "2px",
                }}
              />
            </Grid>

            {/* why Cjoose   */}

            <Grid item xs={12} sx={{ mt: { xs: 2, md: 2 }, pb: 4 }}>
              <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                    fontWeight: 600,
                    color: "#2d3748",
                    mb: 2,
                  }}
                >
                  Why Choose RR Properties?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                    color: "#718096",
                    maxWidth: "600px",
                    mx: "auto",
                  }}
                >
                  Experience the future of property management with our
                  comprehensive suite of tools
                </Typography>
              </Box>

              <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
                {features.map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 4,
                        transition: "box-shadow 0.3s ease-in-out",
                        backgroundColor: "transparent",
                        "&:hover": {
                          boxShadow: 6,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 3,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        sx={{ color: "text.secondary", lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Property Management Section */}

            {/* Lease 100% Online */}
          </Grid>
        </Container>
      </Box>

      {/* //Contact Form// */}

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${Images.banner2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",

          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(245, 240, 220, 0.9)",
            zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            py: { xs: 4, md: 8 },
          }}
        >
          <Grid container spacing={4} alignItems="stretch">
            {/* Contact Information Section */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: "bold",
                    color: "#2c3e50",
                    mb: 3,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Contact Us
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    mb: 4,
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                  }}
                >
                  We’re always ready to help you whenever you need support.
                  Whether you’re exploring for the first time or coming back,
                  we’re here to make things easier.
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    mb: 2,
                    fontSize: "1.1rem",
                  }}
                >
                  If you have any questions or can’t find what you’re looking
                  for, feel free to reach out. Our team is friendly, responsive,
                  and happy to assist.
                </Typography>
              </Box>
            </Grid>

            {/* Contact Form Section */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  backgroundColor: "transparent",
                  height: "100%",
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubmit2}
                  sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#666",
                        mb: 1,
                        fontSize: "1rem",
                      }}
                    >
                      Your Name
                      <Typography
                        component="span"
                        sx={{ color: "#d32f2f", ml: 0.5 }}
                      >
                        *
                      </Typography>
                    </Typography>
                    <TextField
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "& fieldset": {
                            borderColor: "#ddd",
                          },
                          "&:hover fieldset": {
                            borderColor: "#bbb",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2c3e50",
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#666",
                        mb: 1,
                        fontSize: "1rem",
                      }}
                    >
                      Your Email
                    </Typography>
                    <TextField
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "& fieldset": {
                            borderColor: "#ddd",
                          },
                          "&:hover fieldset": {
                            borderColor: "#bbb",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2c3e50",
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#666",
                        mb: 1,
                        fontSize: "1rem",
                      }}
                    >
                      Your Message
                    </Typography>
                    <TextField
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      fullWidth
                      required
                      multiline
                      rows={6}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "& fieldset": {
                            borderColor: "#ddd",
                          },
                          "&:hover fieldset": {
                            borderColor: "#bbb",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2c3e50",
                          },
                        },
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<Send />}
                    sx={{
                      backgroundColor: Colors.primary,
                      color: "white",
                      py: 1.5,
                      px: 4,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: 1,
                      alignSelf: "flex-start",
                      "&:hover": {
                        backgroundColor: Colors.primary,
                        opacity: 0.8,
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Footer */}

      <Box
        component="footer"
        sx={{
          backgroundColor: Colors.primary,
          color: "white",

          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={2} alignItems="center">
            {/* Social Media Links */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: Colors.white,
                    mr: 2,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Follow Us:
                </Typography>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.name}
                    href={social.url}
                    sx={{
                      color: Colors.white,
                      "&:hover": {
                        color: "white",
                        backgroundColor: Colors.primary,
                      },
                      transition: "all 0.2s ease",
                    }}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Grid>

            {/* Copyright & Legal */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  textAlign: { xs: "center", md: "right" },
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "center", md: "flex-end" },
                  justifyContent: { md: "flex-end" },
                  gap: { xs: 1, sm: 2 },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: Colors.white,
                    fontSize: "0.875rem",
                  }}
                >
                  © {moment().format("YYYY")} All rights reserved.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Booking modal */}
      <SimpleDialog
        open={openBookDialog}
        onClose={() => {
          setOpenBookDialog(false);
          reset();
          setValue("timeSlot", "");
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
            {/* <Grid item xs={12} md={12}>
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
            </Grid> */}

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
                  <Loader width="20px" height="20px" color={Colors.white} />
                ) : (
                  "Book a visit"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </SimpleDialog>

      <Dialog
        open={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        fullWidth
      >
        <DialogTitle>Filter Properties</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {/* Location Input */}
          <InputBase
            fullWidth
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            placeholder="Area, project or community"
            startAdornment={<SearchIcon sx={{ color: "gray", mr: 1 }} />}
            sx={{
              px: 1,
              py: 1.5,
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />

          {/* Property Type */}
          <FormControl fullWidth>
            <Select
              value={filters.propertyType}
              onChange={(e) =>
                setFilters({ ...filters, propertyType: e.target.value })
              }
              displayEmpty
              size="small"
            >
              <MenuItem value="">Select Type</MenuItem>
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="villa">Villa</MenuItem>
              <MenuItem value="townhouse">Townhouse</MenuItem>
            </Select>
          </FormControl>

          <Accordion
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              "& .MuiAccordionSummary-root": {
                minHeight: "4px !important",
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Price Range</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                  Price Range (AED)
                </Typography>
                <Slider
                  value={filters.priceRange}
                  onChange={(e, newValue) =>
                    setFilters({ ...filters, priceRange: newValue })
                  }
                  valueLabelDisplay="auto"
                  min={maxMin?.min_price || 0}
                  max={maxMin?.max_price || 10000000}
                  step={100000}
                  valueLabelFormat={(value) => `${value}AED`}
                  sx={{
                    color: Colors.primary,
                  }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFilterModal(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenFilterModal(false);
              handleSearch();
            }}
            sx={{
              backgroundColor: Colors.primary,
              "&:hover": {
                backgroundColor: Colors.primary,
                opacity: 0.8,
              },
            }}
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
