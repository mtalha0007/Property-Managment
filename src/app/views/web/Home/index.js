"use client"

import { useEffect, useState } from "react"
import {
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
  InputLabel,
  Paper,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material"
import LocalParkingIcon from "@mui/icons-material/LocalParking"
import EmailIcon from "@mui/icons-material/Email"

import {
  Search as SearchIcon,
  Close as CloseIcon,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  SquareFoot,
  VisibilityOff,
  Visibility,
  Send,
} from "@mui/icons-material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import SecurityIcon from "@mui/icons-material/Security"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"

import { Images } from "../../../assets/images"
import Loader from "../../../components/Loader"

import Colors from "../../../assets/styles"
import { useForm } from "react-hook-form"
import SimpleDialog from "../../../components/Dialog"
import { useNavigate } from "react-router-dom"
import moment from "moment"
import AuthServices from "../../../api/AuthServices/auth.index"
import { ErrorToaster, SuccessToaster } from "../../../components/Toaster"
import FileServices from "../../../api/FileServices/file.index"
import { useAuth } from "../../../context"
import PropertyServices from "../../../api/PropertyServices/property.index"
import Header from "../Header"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

const Home = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [activeStep, setActiveStep] = useState(0)
  // const [selectedTime, setSelectedTime] = useState(null);

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openBookDialog, setOpenBookDialog] = useState(false)
  const [properties, setProperties] = useState([])
  const navigate = useNavigate()
  const [propertyData, setPropertyData] = useState([])
  const [maxMin, setMaxMin] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [openFilterModal, setOpenFilterModal] = useState(false)
  const [openBookRegisterDialog, setOpenBookRegisterDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [images, setImages] = useState(null)
  const [docLoading, setDocLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [preview, setPreview] = useState(null)
  const [docPreview, setDocPreview] = useState(null)
  const [document, setDocument] = useState(null)

  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const itemData = [
    {
      img: Images.itemData1,
      title: "The Face Clinic",
      author: "@bkristastucchio",
    },
    {
      img: Images.itemData2,
      title: "Confidential Project",
      author: "@rollelflex_graphy726",
    },
    {
      img: Images.itemData3,
      title: "Wanta Shipping",
      author: "@helloimnik",
    },
    {
      img: Images.itemData4,
      title: "IBV International Vaults",
      author: "@nolanissac",
    },
    {
      img: Images.itemData5,
      title: "Envision Energy",
      author: "@hjrc33",
    },

    {
      img: Images.itemData6,
      title: "Envision Energy",
      author: "@southside_customs",
    },
  ]
  const handleUpload = async (e) => {
    setImgLoading(true)
    const formData = new FormData()
    const selectedFiles = Array.from(e.target.files)

    selectedFiles.forEach((file) => {
      formData.append("images", file)
    })

    try {
      const response = await FileServices.uploadImage(formData)
      console.log(response)
      setImages(response?.urls[0])
      setPreview(response?.urls[0])
      SuccessToaster(response?.message)
    } catch (error) {
      ErrorToaster(error)
    } finally {
      setImgLoading(false)
    }
  }
  const handleUploadDoc = async (e) => {
    setDocLoading(true)
    const formData = new FormData()
    const selectedFiles = Array.from(e.target.files)

    selectedFiles.forEach((file) => {
      formData.append("file", file)
    })

    try {
      const response = await FileServices.uploadDocument(formData)
      console.log(response)
      setDocument(response?.url)
      setDocPreview(response?.url)
      SuccessToaster(response?.message)
    } catch (error) {
      ErrorToaster(error)
    } finally {
      setDocLoading(false)
    }
  }

  const steps = ["Agent Information", "Booking Details"]

  const handleNext = async () => {
    const isValid = await trigger(["name", "phone", "address", "rearaid", "email", "password"])

    if (isValid) {
      clearErrors() // ✅ Jaise hi valid ho jaaye, purane errors hata do
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    clearErrors() // ✅ Back karte hi bhi errors reset ho jaayein
    setActiveStep((prev) => prev - 1)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [filters, setFilters] = useState({
    propertyType: "",
    location: "",
    bedrooms: "",
    priceRange: [0, 10000000],
  })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit2 = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }
  const { WebUserLogin, webUser } = useAuth()
  const timeSlots = ["1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10", "10-11", "11-12", "12-1"]
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm()

  const selectedTime = watch("timeSlot")

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (filters.location) {
      params.append("location", filters.location)
    }

    if (filters.propertyType) {
      params.append("type", filters.propertyType)
    }

    // if (filters.priceRange?.length === 2) {
    //   params.append("priceMin", filters.priceRange[0]);
    //   params.append("priceMax", filters.priceRange[1]);
    // }
    if (selectedType) {
      params.append("purpose", selectedType.toLowerCase())
    }

    navigate(`/property-list?${params.toString()}`)
  }

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
  )
  const getProperties = async (searchParam = "", idParam = "", pageParam = 1, limitParam = 4) => {
    setLoading(true)
    try {
      const { data } = await PropertyServices.getProperty(searchParam, idParam, pageParam, limitParam, "", "", "", "")
      setProperties(data?.properties)
      setMaxMin(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
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
  ]
  const cardData = [
    {
      title: "Office Furniture",
      description:
        "With our global network of furniture suppliers and in-house joinery fit out, spanning 20,000 sqft, we offer our clients a complete furniture and ergonomic solutions, enhancing your workspace’s comfort.",
      image: Images.card11,
    },
    {
      title: "Design & Build",
      description:
        "As a top interior design and build company in the UAE, we specialise in creating workspaces that reflect your identity. Our expert in-house team ensures your design aligns with your values.",
      image: Images.card22,
    },
    {
      title: "Office Fit-Out",
      description:
        "Let our experienced team of fit-out contractors manage your office fit-out, and we’ll create the perfect, ergonomic environment that reflects your unique brand identity but also engages your employees.",
      image: Images.card33,
    },
    {
      title: "Office Refurbishment",
      description:
        "Refurbishing your office is an excellent chance to breathe new life into your workspace. This process allows you to reinvent and revitalize your work environment, enhancing both aesthetics and functionality.",
      image: Images.card44,
    },
  ]

  useEffect(() => {
    getProperties("", "", 1, 8, "", "", "", "")
  }, [])

  const handlePropertyClick = (propertyName) => {
    console.log(`Clicked on ${propertyName}`)
  }

  const socialLinks = [
    { icon: <Facebook />, name: "Facebook", url: "#" },
    { icon: <Twitter />, name: "Twitter", url: "#" },
    { icon: <Instagram />, name: "Instagram", url: "#" },
    { icon: <LinkedIn />, name: "LinkedIn", url: "#" },
  ]

  const onSubmit = async (data) => {
    setBookingLoading(true)
    const obj = {
      name: webUser?.name,
      email: webUser?.email,
      agent_id: webUser?._id,
      property_id: propertyData?._id,
      // doc: document,
      date: data?.date,
      time: data?.timeSlot,
      notes: data?.notes,
    }
    console.log(obj)
    try {
      const response = await AuthServices.createBooking(obj)

      SuccessToaster(response?.message)
      setOpenBookDialog(false)
      reset()
      setValue("timeSlot", "")
      // setDocument(null);
    } catch (error) {
      ErrorToaster(error)
    } finally {
      setBookingLoading(false)
    }
  }
  const onSubmit2 = async (data) => {
    setBookingLoading(true)
    const obj = {
      property_id: propertyData?._id,

      date: data?.date,
      time: data?.timeSlot,
      notes: data?.notes,

      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,
      image: images,
      rera_id: data.rearaid,
      rera_doc: document,
    }
    console.log(obj)
    try {
      const response = await AuthServices.registerBooking(obj)

      SuccessToaster(response?.message)
      setOpenBookRegisterDialog(false)
      reset()
      setValue("timeSlot", "")
      setImages(null)
      setDocument(null)
      setPreview(null)
      setActiveStep(0)
      // setDocument(null);
    } catch (error) {
      ErrorToaster(error)
    } finally {
      setBookingLoading(false)
    }
  }

  const developers = [
    { name: "DAMAC", logo: Images.hero1 },
    { name: "EMAAR", logo: Images.hero2 },
    { name: "MERAAS", logo: Images.hero3 },
    { name: "SOBHA", logo: Images.hero4 },
    { name: "NAKHEEL", logo: Images.hero5 },
    { name: "Sobha", logo: Images.hero6 },
    { name: "Sobha", logo: Images.hero7 },
    { name: "Sobha", logo: Images.hero8 },
  ]
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price)
  }

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
          component="img"
          autoPlay
          loop
          muted
          playsInline
          src={Images.banner4}
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
              Unlocking Value Elevating Markets.
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
              Connect with the right opportunities, close faster, and scale with confidence.
            </Typography>

            {/* Top Tabs (Buy, Rent, Off Plan) */}

            <Box
              sx={{
                display: { md: "flex", sm: "none", xs: "none" },
                gap: 1.5,
                mb: 2,
              }}
            >
              {["Sale", "Rent", "Both"].map((label) => (
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
                    backgroundColor: selectedType === label ? Colors.primary : "transparent",
                    "&:hover": {
                      backgroundColor: selectedType === label ? Colors.primary : "rgba(255,255,255,0.1)",
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
                onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
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
              {/* <FormControl sx={{ minWidth: 120 }}>
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
                    <MenuItem value="commercialOffice">
                      Commercial Office
                    </MenuItem>
                  </Select>
                </FormControl>

              
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
                </FormControl> */}

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

      {/* <Box sx={{ bgcolor: "#f4f8fb", py: 6 }}>
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
      </Box> */}
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

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: 4, justifyContent: "center" }}>
            {properties.map((property) => (
              <Grid item xs={12} sm={6} lg={3} sx={{ paddingLeft: "18px !important" }} key={property.id}>
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
                  onClick={(e) => {
                    e.stopPropagation()

                    if (webUser?.token) {
                      navigate(`/property-detail/${property._id}`)
                    } else {
                      navigate("/agent/login")
                      ErrorToaster("Please login to View Detail")
                    }
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
                          textTransform: "capitalize",
                        }}
                      >
                        {property.category}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#718096",
                          fontSize: "0.9rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {property.type == "commercialOffice" ? "Commercial Office" : ""}
                      </Typography>
                    </Box>

                    {/* Beds, Baths, Area */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        mb: 2,
                        color: "#4a5568",
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <LocalParkingIcon fontSize="small" />
                        <Typography variant="body2">{property.parking_space}</Typography>
                      </Box>

                      <Box display="flex" alignItems="center">
                        <SquareFoot fontSize="small" />
                        <Typography variant="body2">{property.area} sqft</Typography>
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
                        onClick={(e) => {
                          e.stopPropagation()
                          if (webUser?.token) {
                            e.stopPropagation()

                            setPropertyData(property)
                            setOpenBookDialog(true)
                          } else {
                            e.stopPropagation()
                            setPropertyData(property)
                            setOpenBookRegisterDialog(true)

                            // navigate("/agent/login");
                            ErrorToaster("Please Fill Form to book a property")
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
                        onClick={(e) => {
                          e.stopPropagation()

                          if (webUser?.token) {
                            navigate(`/property-detail/${property._id}`)
                          } else {
                            ErrorToaster("Please login to View Detail")
                            navigate("/agent/login")
                          }
                        }}
                        // onClick={() =>
                        //   navigate(`/property-detail/${property._id}`)
                        // }
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/property-list")}
              sx={{
                backgroundColor: Colors.primary,
                color: "white",
                px: { md: 6, sm: 5, xs: 4 },
                py: 2,
                fontSize: "15px",
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
              Browse All Properties
            </Button>
          </Box>
        </Container>
      </Box>

      {/* //rental listing  */}
      <Box sx={{ py: { xs: 4, md: 6 }, backgroundColor: "#f8f9fa" }}>
        <Container sx={{ maxWidth: "1300px !important" }}>
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
              Welcome to RR Properties LLC
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
              Your Trusted Partner in Dubai Real Estate Investment
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Image on Left */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={Images.section3} // replace with your image
                alt="Dubai Real Estate Investment"
                sx={{
                  width: "100%",
                  height: { xs: "250px", md: "680px" },
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            </Grid>

            {/* Text on Right */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1" sx={{ color: "#718096", lineHeight: 1.7, mb: 1 }}>
                At RR Properties , we specialize in creating strategic, high-yield investment opportunities in one of
                the world’s most dynamic real estate markets — Dubai. With a deep understanding of the local property
                landscape, our company connects investors with premium commercials and off-plan developments that
                deliver strong returns and long-term value.
              </Typography>
              <Typography variant="body1" sx={{ color: "#718096", lineHeight: 1.7, mb: 1 }}>
                Headquartered in the heart of JLT, Dubai, our team of industry experts is supported by Motif Interiors -
                a full in-house design and build powerhouse with over 800+ completed projects. As a fit-out investor, we
                not only deliver premium spaces but also invest directly in the design, build, and enhancement of
                commercial properties, ensuring they meet the highest standards to attract and retain corporate tenants.
                Our interiors are design-led, sustainably built, and crafted to maximize both functionality and
                aesthetic appeal.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  The RR Properties Advantage:
                </Typography>

                <List
                  sx={{
                    color: "#718096",
                    lineHeight: 1.8,
                    listStyleType: "disc",
                    pl: 3,
                  }}
                >
                  <ListItem sx={{ display: "list-item", p: 0 }}>High rental yields</ListItem>
                  <ListItem sx={{ display: "list-item", p: 0 }}>Investor-friendly, long-term contracts</ListItem>
                  <ListItem sx={{ display: "list-item", p: 0 }}>Reliable corporate tenants</ListItem>
                  <ListItem sx={{ display: "list-item", p: 0 }}>Stable income with lower vacancy risks</ListItem>
                  <ListItem sx={{ display: "list-item", p: 0 }}>
                    Added value through strategic fit-out investment
                  </ListItem>
                </List>
              </Box>
              <Typography variant="body1" sx={{ color: "#718096", lineHeight: 1.7, mb: 1 }}>
                Guided by transparency, innovation, and integrity, RR Properties LLC is dedicated to helping clients
                capitalize on Dubai’s ever-growing real estate potential - a global hub of economic growth, stability,
                and opportunity.
              </Typography>

              <Typography variant="body1" sx={{ color: "#2d3748", fontWeight: 600 }}>
                Invest smart. Invest in Dubai. Invest with RR Properties.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

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
              Work with the best suite of property management tools on the market.
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
                      Professional Agent Portal for Efficient Property Management
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
                      The agent portal provides seamless access to the latest property listings. Agents can explore
                      available units, match them to client needs, and schedule viewings through a centralized and
                      intuitive platform. It is designed to enhance productivity, improve coordination, and support
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

            {/* <Grid item xs={12} sx={{ mt: { xs: 2, md: 4 } }}>
              <Divider
                sx={{
                  borderColor: "grey",
                  borderBottomWidth: "2px",
                }}
              />
            </Grid> */}

            {/* why Cjoose   */}

            {/* <Grid item xs={12} sx={{ mt: { xs: 2, md: 2 }, pb: 4 }}>
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
            </Grid> */}
            <Grid item xs={12} sx={{ mt: { xs: 2, md: 4 } }}>
              <Divider
                sx={{
                  borderColor: "grey",
                  borderBottomWidth: "2px",
                }}
              />
            </Grid>

            {/* Property Management Section */}
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
                  Transforming Workspaces with Motiff Interiors Expertise
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                    color: "#718096",
                    maxWidth: "800px",
                    mx: "auto",
                  }}
                >
                  In partnership with Motiff Interiors, RR Properties offers complete workspace solutions — from custom
                  design and furniture to full fit-outs and refurbishments — helping clients build offices their teams
                  love.
                </Typography>
              </Box>

              <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
                {cardData.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#f5f5f5", // light grey background
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      {/* Image Section */}
                      <Box
                        component="img"
                        src={feature.image}
                        alt={feature.title}
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                      />

                      {/* Content Section */}
                      <Box sx={{ p: 3, flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            color: Colors.primary,
                            mb: 2,
                            fontSize: "20px",
                          }}
                        >
                          {feature.title}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
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
                  Properties We’ve Delivered
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                    color: "#718096",
                    maxWidth: "800px",
                    mx: "auto",
                  }}
                >
                  A track record of completed and handed-over properties.
                </Typography>
              </Box>

              <ImageList sx={{ width: "100%", height: 600 }}>
                <ImageListItem key="Subheader" cols={2}></ImageListItem>
                {itemData.map((item) => (
                  <ImageListItem key={item.img}>
                    <img
                      srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.img}?w=248&fit=crop&auto=format`}
                      alt={item.title}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      title={item.title}
                      // subtitle={item.author}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "white" }}>
        <Container sx={{ maxWidth: "1300px !important" }}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
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
              Our Services
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
              Comprehensive real estate solutions tailored to your investment goals
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {[
              {
                title: "Property Acquisition",
                description:
                  "Identifying undervalued opportunities in Dubai's dynamic real estate market with strategic location analysis and market intelligence.",
                icon: "🏢",
              },
              {
                title: "Renovation & Repositioning",
                description:
                  "Transforming assets into premium spaces through our in-house design and build expertise, maximizing property value and appeal.",
                icon: "🔨",
              },
              {
                title: "Leasing & Sales",
                description:
                  "Delivering top-value returns through strategic marketing, tenant placement, and sales optimization for maximum ROI.",
                icon: "📈",
              },
              {
                title: "Portfolio Management",
                description:
                  "Long-term growth strategies for investors with comprehensive property management and performance monitoring.",
                icon: "📊",
              },
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    height: "300px",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
                      borderColor: Colors.primary,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "3rem",
                      mb: 2,
                    }}
                  >
                    {service.icon}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#2d3748",
                      mb: 2,
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#718096",
                      lineHeight: 1.6,
                    }}
                  >
                    {service.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#f8f9fa" }}>
        <Container sx={{ maxWidth: "1300px !important" }}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
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
              Investment Opportunities
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                color: "#718096",
                fontWeight: 400,
                maxWidth: "700px",
                mx: "auto",
              }}
            >
              Partner with us for exceptional returns in Dubai's thriving real estate market
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 4, md: 6 }} >
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={Images.card2}
                alt="Investment Opportunities"
                sx={{
                  width: "100%",
                  height: { xs: "250px", md: "470px" },
                  objectFit: "cover",
                  borderRadius: 3,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "#2d3748",
                  mb: 3,
                }}
              >
                Why Invest with RR Properties?
              </Typography>

              <Box sx={{ mb: 4 }}>
                {[
                  {
                    title: "Market-Leading ROI",
                    description:
                      "Consistent returns above market average through strategic property selection and enhancement",
                    icon: "💰",
                  },
                  {
                    title: "Transparent Process",
                    description: "Complete visibility into investment performance with regular reporting and updates",
                    icon: "📋",
                  },
                  {
                    title: "Expert Management",
                    description: "Professional property management ensuring optimal tenant satisfaction and retention",
                    icon: "🎯",
                  },
                ].map((benefit, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography sx={{ fontSize: "2rem", mr: 2 }}>{benefit.icon}</Typography>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#2d3748", mb: 1 }}>
                        {benefit.title}
                      </Typography>
                      <Typography sx={{ color: "#718096", lineHeight: 1.6 }}>{benefit.description}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
<Box sx={{
  display:'flex',
  justifyContent:"flex-end"
}}>

              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: Colors.primary,
                  color: "white",
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: Colors.primary,
                    opacity: 0.9,
                  },
                }}
              >
                Partner With Us
              </Button>
</Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#f8f9fa" }}>
        <Container sx={{ maxWidth: "1300px !important" }}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
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
              Market Insights
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
              Stay informed with the latest trends and opportunities in Dubai real estate
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {[
              {
                title: "Dubai Real Estate Market Outlook 2024",
                date: "December 2024",
                excerpt:
                  "Analysis of emerging trends and investment opportunities in Dubai's commercial real estate sector...",
                category: "Market Analysis",
              },
              {
                title: "Commercial Office Demand Surge",
                date: "November 2024",
                excerpt:
                  "Growing demand for premium office spaces drives rental yields to new heights across key business districts...",
                category: "Investment Trends",
              },
              {
                title: "Sustainable Building Practices",
                date: "October 2024",
                excerpt:
                  "How green building certifications are becoming essential for attracting premium tenants and maximizing returns...",
                category: "Industry News",
              },
            ].map((insight, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    height: "200px",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      borderColor: Colors.primary,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: Colors.primary,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      mb: 1,
                    }}
                  >
                    {insight.category}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#2d3748",
                      mb: 2,
                      lineHeight: 1.3,
                    }}
                  >
                    {insight.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#718096",
                      lineHeight: 1.6,
                     
                    }}
                  >
                    {insight.excerpt}
                  </Typography>
                
                </Paper>
              </Grid>
            ))}
          </Grid>

          
        </Container>
      </Box>
      {/* //Contact Form// */}

      <Box
        sx={{
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
                    mb: 2,
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                  }}
                >
                  Let's Build Value Together
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#666",
                    mb: 2,
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                  }}
                >
                  At RR Properties, we believe every great partnership begins with a conversation. Whether you're an
                  investor seeking exceptional returns, a business looking for premium commercial space, or a partner
                  exploring collaboration, we'd love to hear from you.
                </Typography>

                <Box sx={{ my: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#2c3e50" }}>
                    📌 Why Reach Out to Us?
                  </Typography>

                  <List
                    sx={{
                      color: "#666",
                      lineHeight: 1.8,
                      listStyleType: "disc",
                      pl: 3,
                    }}
                  >
                    <ListItem sx={{ display: "list-item", p: 0 }}>
                      💼 Exclusive investment opportunities with proven ROI
                    </ListItem>
                    <ListItem sx={{ display: "list-item", p: 0 }}>
                      🏢 Premium office spaces tailored to modern business needs
                    </ListItem>
                    <ListItem sx={{ display: "list-item", p: 0 }}>
                      🤝 Trusted partner with a track record of market succes
                    </ListItem>
                  </List>
                </Box>
                <Button
                  component="a"
                  href="mailto:info@rrpropertiesdxb.com"
                  variant="contained"
                  size="large"
                  startIcon={<EmailIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 3,

                    py: 1.5,
                    backgroundColor: Colors.primary,
                    width: { xs: "100%", md: "300px" },
                    fontSize: { xs: "12px", md: "14px" },
                  }}
                >
                  Let's Discuss Your Next Investment
                </Button>
              </Box>
            </Grid>

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
                      <Typography component="span" sx={{ color: "#d32f2f", ml: 0.5 }}>
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

      
      {/* <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "white" }}>
        <Container sx={{ maxWidth: "1300px !important" }}>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
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
              Success Stories
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
              Real results from our investment partnerships
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {[
              {
                title: "JLT Office Complex",
                roi: "28% ROI",
                description:
                  "Transformed a dated office building into a premium workspace, achieving 100% occupancy within 3 months",
                image: "/placeholder.svg?height=200&width=300",
              },
              {
                title: "DIFC Commercial Tower",
                roi: "35% ROI",
                description:
                  "Strategic renovation and repositioning resulted in premium tenant acquisition and exceptional returns",
                image: "/placeholder.svg?height=200&width=300",
              },
              {
                title: "Business Bay Development",
                roi: "42% ROI",
                description:
                  "Complete fit-out investment delivering market-leading rental yields and long-term corporate contracts",
                image: "/placeholder.svg?height=200&width=300",
              },
            ].map((story, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    height: "100%",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={story.image}
                    alt={story.title}
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#2d3748" }}>
                        {story.title}
                      </Typography>
                      <Typography
                        sx={{
                          backgroundColor: Colors.primary,
                          color: "white",
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        {story.roi}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: "#718096", lineHeight: 1.6 }}>{story.description}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box> */}

      

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
                    display: { sm: "block" },
                  }}
                >
                  Contact Us at : info@rrpropertiesdxb.com
                </Typography>
                {/* {socialLinks.map((social) => (
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
                ))} */}
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
          setOpenBookDialog(false)
          reset()
          setValue("timeSlot", "")
        }}
        border={`4px solid ${Colors.primary}`}
        title={`Book This Property`}
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
                    onClick={() => setValue("timeSlot", slot, { shouldValidate: true })}
                  />
                ))}
              </Box>
              {errors.timeSlot && (
                <Typography color="error" variant="caption">
                  {errors.timeSlot.message}
                </Typography>
              )}
              {/* Hidden time slot input */}
              <input type="hidden" {...register("timeSlot", { required: "Time slot is required" })} />
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
              <Button type="submit" variant="contained" sx={{ color: Colors.white }} fullWidth>
                {bookingLoading ? <Loader width="20px" height="20px" color={Colors.white} /> : "Book a visit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </SimpleDialog>
      {/* Booking with register dialog */}
      <SimpleDialog
        open={openBookRegisterDialog}
        onClose={() => {
          setOpenBookRegisterDialog(false)
          reset()
          setValue("timeSlot", "")
          setImages(null)
          setDocument(null)
          setPreview(null)
          setDocPreview(null)
          setActiveStep(0)
        }}
        border={`4px solid ${Colors.primary}`}
        title={`Book This Property`}
      >
        <Box sx={{ width: "100%" }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit(onSubmit2)}>
            {activeStep === 0 && (
              <Grid container spacing={2}>
                {/* Agent Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" mb={1} textAlign="center">
                    Profile Picture
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px dashed #ccc",
                        bgcolor: "#f5f5f5",
                        "&:hover .overlay": {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        component="label"
                        htmlFor="profile-upload"
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        {imgLoading ? (
                          <Loader width="30px" height="30px" color={Colors.primary} />
                        ) : (
                          <Box
                            component="img"
                            src={preview || Images.default}
                            alt="Profile"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        )}

                        <Box
                          className="overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            bgcolor: "rgba(0, 0, 0, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            fontSize: "12px",
                            borderRadius: "50%",
                          }}
                        >
                          Change
                        </Box>
                      </Box>

                      {/* Delete Icon */}
                      {preview && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPreview(null)
                          }}
                          sx={{
                            position: "absolute",
                            top: 3,
                            right: 3,
                            backgroundColor: "red",
                            color: "#fff",
                            "&:hover": { backgroundColor: "darkred" },
                            zIndex: 2,
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>

                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      hidden
                      {...register("profilePic", {
                        onChange: (e) => handleUpload(e),
                      })}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" mb={1}>
                    RERA Document
                  </Typography>
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
                          {document ? `RERA Documnet Uploaded` : "Upload RERA Document"}
                        </Typography>
                      </>
                    )}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" hidden onChange={handleUploadDoc} />
                  </Box>
                </Grid>

                {/* Input Fields */}
                {[
                  { name: "name", label: "Full Name", md: 6 },
                  {
                    name: "phone",
                    label: "Phone Number",
                    md: 6,
                    props: {
                      inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
                      rules: {
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Only numbers are allowed",
                        },
                      },
                    },
                  },
                  { name: "address", label: "Address", md: 6 },
                  { name: "rearaid", label: "Rera Id", md: 6 },
                  {
                    name: "email",
                    label: "Email",
                    md: 6,
                    props: {
                      rules: {
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Enter a valid email",
                        },
                      },
                    },
                  },
                ].map(({ name, label, md, props = {} }) => (
                  <Grid key={name} item xs={12} md={md}>
                    <TextField
                      label={label}
                      fullWidth
                      {...register(name, {
                        required: `${label} is required`,
                        ...(props.rules || {}),
                      })}
                      error={!!errors[name]}
                      helperText={errors[name]?.message}
                      {...props}
                    />
                  </Grid>
                ))}

                {/* Password */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Password"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters required",
                      },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" size="small">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Next button */}
                <Grid item xs={12}>
                  <Button variant="contained" onClick={handleNext} sx={{ float: "right" }}>
                    Next
                  </Button>
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={2}>
                {/* Date Picker */}
                <Grid item xs={12}>
                  <InputLabel>Select Date</InputLabel>
                  <TextField
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    {...register("date", { required: "Date is required" })}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                  />
                </Grid>

                {/* Time Slot Chips */}
                <Grid item xs={12}>
                  <InputLabel>Select Time Slot</InputLabel>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {timeSlots.map((slot) => (
                      <Chip
                        key={slot}
                        label={slot}
                        clickable
                        color={selectedTime === slot ? "primary" : "default"}
                        onClick={() => {
                          // setSelectedTime(slot);
                          setValue("timeSlot", slot, { shouldValidate: true })
                        }}
                      />
                    ))}
                  </Box>
                  {errors.timeSlot && (
                    <Typography color="error" variant="caption">
                      {errors.timeSlot.message}
                    </Typography>
                  )}
                  <input
                    type="hidden"
                    {...register("timeSlot", {
                      required: "Time slot is required",
                    })}
                  />
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <InputLabel>Additional Notes</InputLabel>
                  <TextField fullWidth placeholder="Type Additional Notes here" {...register("notes")} />
                </Grid>

                {/* Buttons */}
                <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
                  <Button variant="outlined" onClick={handleBack} fullWidth>
                    Back
                  </Button>
                  <Button type="submit" variant="contained" sx={{ color: Colors.white }} fullWidth>
                    {bookingLoading ? <Loader width="20px" height="20px" color={Colors.white} /> : "Book a visit"}
                  </Button>
                </Grid>
              </Grid>
            )}
          </form>
        </Box>
      </SimpleDialog>

      <Dialog open={openFilterModal} onClose={() => setOpenFilterModal(false)} fullWidth sx={{ borderRadius: 2 }}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "18px" }}>Filter Properties</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mb: 2,
            }}
          >
            {["Sale", "Rent", "Both"].map((label) => (
              <Button
                key={label}
                variant="outlined"
                onClick={() => setSelectedType(label)}
                sx={{
                  color: selectedType === label ? Colors.white : Colors.primary,
                  borderColor: Colors.primary,
                  borderRadius: "8px",
                  px: 3,
                  textTransform: "none",
                  backgroundColor: selectedType === label ? Colors.primary : "transparent",
                  "&:hover": {
                    backgroundColor: selectedType === label ? Colors.primary : "rgba(255,255,255,0.1)",
                    opacity: 0.9,
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
          {/* Location Input */}
          <InputBase
            fullWidth
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
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
          {/* <FormControl fullWidth>
            <Select
              value={filters.propertyType}
              onChange={(e) =>
                setFilters({ ...filters, propertyType: e.target.value })
              }
              displayEmpty
              size="small"
            >
              <MenuItem value="">Select Type</MenuItem>
              <MenuItem value="commercialOffice">Commercial Office</MenuItem>
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
          </Accordion> */}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setOpenFilterModal(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpenFilterModal(false)
              handleSearch()
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
  )
}

export default Home
