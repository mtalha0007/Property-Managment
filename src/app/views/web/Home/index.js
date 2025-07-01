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
} from "@mui/material";
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
} from "@mui/icons-material";

import { Images } from "../../../assets/images";
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

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [preview, setPreview] = useState(null);
  const [images, setImages] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const { WebUserLogin, webUser } = useAuth();
  console.log(webUser);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchValue);
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
      <List onClick={() => setOpen(true)}>
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
        limitParam
      );
      setProperties(data?.properties);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProperties("", "", 1, 4);
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

  return (
    <Box sx={{ flexGrow: 1 }}>
    
      <Header />

      {/* Hero  */}
      <Box
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
              Helping 100 Helping over 100 million renters find the perfect place to call home — with ease, confidence, and convenience. renters find their perfect fit.
            </Typography>

            {/* <Box
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
            </Box> */}
          </Box>
        </Container>
      </Box>

      {/*  Drawer */}

      {/* Property Card */}
      {webUser?.token && (
        <>
        <Box sx={{ py: { xs: 4, md: 6 }, backgroundColor: "#f8f9fa" }}>
        <Container sx={{ maxWidth: "1300px !important" }}>
       
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: "center",
              mb: { xs: 3, md: 5 },
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
              fontWeight: 600,
              color: "#2d3748",
            }}
          >
            Explore Rentals
          </Typography>

        
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{ mb: 4, justifyContent: "center" }}
          >
            {properties.map((property) => (
              <Grid item xs={12} sm={6} lg={3} key={property.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                  onClick={() => navigate(`/property-detail/${property._id}`)}
                >
                  <CardMedia
                    component="img"
                    height={isMobile ? "200" : "250"}
                    image={property.images[0]}
                    alt={property.imageAlt}
                    sx={{
                      objectFit: "cover",
                    }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      p: { xs: 2, sm: 3 },
                    }}
                  >
                  
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        fontSize: { xs: "1.1rem", sm: "1.25rem" },
                        color: "#2d3748",
                        textAlign: "center",
                      }}
                    >
                      {property.name}
                    </Typography>

                   
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#718096",
                          fontSize: "0.9rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {property.address}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#718096",
                          fontSize: "0.9rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {property.type}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4a5568",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        textAlign: "center",
                        mt: "auto",
                      }}
                    >
                      AED {property.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/property-list")}
              sx={{
                backgroundColor: Colors.primary,
                color: "white",
                px: { xs: 4, sm: 6 },
                py: { xs: 1.5, sm: 2 },
                fontSize: { xs: "1rem", sm: "1.1rem" },
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
          
          <Divider
            sx={{
              mt: 13,
              borderColor: "grey",
              borderBottomWidth: "2px",
            }}
          />
       
        </Container>
      </Box>
        </>
      )}
      

      {/* //rental listing  */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: "#f8f9fa" }}>
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
              The Most Rental Listings
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
              Choose from over 1 million apartments, houses, condos, and
              townhomes for rent.
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
                      Accept Applications Online
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
                      Simplify tenant onboarding with digital applications. Let
                      prospects apply anytime, anywhere, with secure ID and
                      background verification built in. Review, approve, and
                      communicate—all from your dashboard. It’s faster, more
                      professional, and hassle-free for both property managers
                      and renters.
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
                  my: { xs: 4, md: 6 },
                  borderColor: "grey",
                  borderBottomWidth: "2px",
                }}
              />
            </Grid>

            {/* Property Management Section */}
            <Grid item xs={12} sx={{ mt: { xs: 2, md: 4 } }}>
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
                  The Perfect Place to Manage Your Property
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
                  Work with the best suite of property management tools on the
                  market.
                </Typography>
              </Box>

              <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={{ pr: { md: 2 } }}>
                    <Typography
                      variant="h5"
                      component="h4"
                      sx={{
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        fontWeight: 600,
                        color: "#2d3748",
                        mb: 2,
                      }}
                    >
                      Process Rent Payments Digitally
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
                      Collect rent on time every time with built-in online
                      payments. Tenants can pay via credit card, bank transfer,
                      or auto-debit—no chasing, no delays. Track transactions in
                      real-time and enjoy automated receipts and reporting. Say
                      goodbye to cash hassles for good.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={Images.section3}
                    alt="Apartment building exterior for rental advertising"
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

            {/* Lease 100% Online */}
            <Grid item xs={12} sx={{ mt: { xs: 2, md: 4 } }}>
              <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={Images.section4}
                    alt="Happy couple with keys - new renters"
                    sx={{
                      width: "100%",
                      height: { xs: "250px", md: "300px" },
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ pl: { md: 2 } }}>
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
                      Lease 100% Online
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
                      Manage your entire leasing process from anywhere. From
                      listing properties to signing digital leases, our platform
                      streamlines everything online—saving you time, effort, and
                      paperwork. No more manual contracts or office visits—just
                      seamless, secure, and efficient leasing in a few clicks.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}

      <Box
        component="footer"
        sx={{
          backgroundColor: "#2d3748",
          color: "white",

          pb: 2,
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
                    color: "#a0aec0",
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
                      color: "#a0aec0",
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
                    color: "#a0aec0",
                    fontSize: "0.875rem",
                  }}
                >
                  © {moment().format("YYYY")}  All rights
                  reserved.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* login signup modal */}
    </Box>
  );
};

export default Home;
