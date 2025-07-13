"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Button,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import {
  Search,
  FilterList,
  Favorite,
  FavoriteBorder,
  Email,
  Phone,
  WhatsApp,
  Bed,
  Bathtub,
  SquareFoot,
  LocationOn,
  CheckCircle,
  ArrowBackIos,
  ArrowForwardIos,
  ExpandMore,
  ViewList,
  ViewModule,
  Info,
} from "@mui/icons-material";
import LocalParkingIcon from "@mui/icons-material/LocalParking";

import PropertyServices from "../../../api/PropertyServices/property.index";
import Header from "../Header";
import { Images } from "../../../assets/images";
import { useNavigate, useParams } from "react-router-dom";
import Colors from "../../../assets/styles";
import { useLocation } from "react-router-dom";
import Loader from "../../../components/Loader";
import SimpleDialog from "../../../components/Dialog";
import moment from "moment";
import { useAuth } from "../../../context";
import { ErrorToaster, SuccessToaster } from "../../../components/Toaster";
import { useForm } from "react-hook-form";
import AuthServices from "../../../api/AuthServices/auth.index";

const ProfessionalPropertyListing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [viewMode, setViewMode] = useState("grid");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const intervalRef = useRef({});
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [maxMin, setMaxMin] = useState(null);
  const [openStatus, setOpenStatus] = useState(false);
  const { WebUserLogin, webUser } = useAuth();
  const [openBookDialog, setOpenBookDialog] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

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

  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  console.log(query, "query");
  const location = query.get("location");
  const type = query.get("type") || "";
  const priceMin = query.get("priceMin");
  const priceMax = query.get("priceMax");
  const purpose = query.get("purpose") || "";

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  useEffect(() => {
    setSearch(location ? location : "");

    setFilters((prev) => ({
      ...prev,
      propertyType: filters?.propertyType ? filters?.propertyType : type,
      purpose: filters?.purpose ? filters?.purpose : purpose,
      priceRange: [
        priceMin !== null && !isNaN(priceMin) ? priceMin : prev.priceRange[0],
        priceMax !== null && !isNaN(priceMax) ? priceMax : prev.priceRange[1],
      ],
    }));
  }, [priceMin, priceMax, location, type, purpose]);

  const handleMouseEnter = (property) => {
    const total = property.images.length;
    const id = property._id;

    if (intervalRef.current[id]) return;

    intervalRef.current[id] = setInterval(() => {
      setCurrentImageIndexes((prev) => {
        const current = prev[id] ?? 0;
        return {
          ...prev,
          [id]: (current + 1) % total,
        };
      });
    }, 2000);
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleMouseLeave = (propertyId) => {
    clearInterval(intervalRef.current[propertyId]);
    delete intervalRef.current[propertyId];
  };
  useEffect(() => {
    return () => {
      Object.values(intervalRef.current).forEach(clearInterval);
    };
  }, []);

  const getProperties = async (
    searchParam = "",
    idParam = "",
    pageParam = 1,
    limitParam = 10,
    append = false
  ) => {
    setLoading(true);
    try {
      const { data } = await PropertyServices.getProperty(
        searchParam ? searchParam : location ? location : "",
        idParam,
        pageParam,
        limitParam,
        filters?.priceRange[0]
          ? filters?.priceRange[0]
          : priceMin
          ? priceMin
          : 0,
        filters?.priceRange[1]
          ? filters?.priceRange[1]
          : priceMax
          ? priceMax
          : "",
        filters?.propertyType === ""
          ? ""
          : filters?.propertyType
          ? filters.propertyType
          : type,
        filters?.purpose === "" ? "" : filters?.purpose ? filters.purpose : type
      );
      setMaxMin(data);
      setProperties((prev) =>
        append ? [...prev, ...data?.properties] : data?.properties
      );
      setCount(data.count);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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

  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: [maxMin?.min_price, 250000000],
    bedrooms: "",
    bathrooms: "",
    area: [0, 10000],
    purpose: "",
  });
  console.log(filters);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setPage(0);

      getProperties(
        search,
        id,
        1,
        limit,
        false,
        filters?.priceRange[0],
        filters?.priceRange[1],
        filters?.propertyType == ""
          ? ""
          : filters?.propertyType
          ? filters.propertyType
          : type,
        filters?.purpose == "" ? "" : filters?.purpose ? filters.purpose : type
      );
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [
    search,
    id,
    filters?.priceRange[0],
    filters?.priceRange[1],
    filters?.propertyType,
    filters?.purpose,
  ]);

  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getProperties(
      search,
      id,
      nextPage + 1,
      limit,
      true,
      filters?.priceRange[0],
      filters?.priceRange[1],
      filters?.propertyType === ""
        ? ""
        : filters?.propertyType
        ? filters.propertyType
        : type,
      "",
      filters?.purpose === ""
        ? ""
        : filters?.purpose
        ? filters.purpose
        : purpose,
      ""
    );
  };

  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
const [selectedProperty , setSelectedProperty] = useState(null)
  const PropertyCard = ({ property }) => {
    const currentImageIndex = currentImageIndexes[property.id] || 0;

    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
          mb: 3,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          },
          cursor: "pointer",
        }}
      
      >
        <Grid container>
          {/* Image Section */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{ position: "relative", height: { xs: 250, md: 420 } }}
              onMouseEnter={() => handleMouseEnter(property)}
              onMouseLeave={() => handleMouseLeave(property._id)}
            >
              <Box
                component="img"
                src={property.images[currentImageIndexes[property._id] ?? 0]}
                alt={`${property.type} ${property._id}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Dots */}
              {property.images.length > 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 0.5,
                  }}
                >
                  {property.images.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() =>
                        setCurrentImageIndexes((prev) => ({
                          ...prev,
                          [property._id]: index,
                        }))
                      }
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor:
                          index === (currentImageIndexes[property._id] ?? 0)
                            ? "white"
                            : "rgba(255, 255, 255, 0.5)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Content Section */}
          <Grid item xs={12} md={7}>
            <Box sx={{ p: { xs: 2, md: 3 }, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Price */}
                <Grid container alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
  {/* Buttons - shown first on xs */}
  <Grid
    item
    xs={12}
    sm={6}
    md={6}
    sx={{ order: { xs: 1, sm: 2 } }}
  >
    <Box display="flex" justifyContent={{ xs: "center", sm: "flex-end", md: "flex-end" }} gap={2}>
      <Button
        variant="contained"
        color="primary"
        sx={{ textTransform: "none", fontWeight: 600 }}
        onClick={() => {
          if (webUser?.token) {
            setPropertyData(property);
            setOpenBookDialog(true);
          } else {
            const currentPath = window.location.pathname;
            navigate(`/agent/login?redirect=${encodeURIComponent(currentPath)}`);
            ErrorToaster("Please login to book a property");
          }
        }}
      >
        Book a Visit
      </Button>
      <Button
        variant="outlined"
        color="primary"
        sx={{ textTransform: "none", fontWeight: 600 }}
        onClick={() => {
          navigate(`/property-detail/${property._id}`);
        }}
      >
        View Details
      </Button>
     
    </Box>
  </Grid>

  {/* Property Name - shown second on xs */}
  <Grid
    item
    xs={12}
    sm={6}
    md={6}
    sx={{ order: { xs: 2, sm: 1 } }}
  >
    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
        color: "#2d3748",
        fontSize: { xs: "1.5rem", md: "2rem" },
      }}
    >
      {property.name}
    </Typography>
  </Grid>
</Grid>



                {/* Property Details */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    mb: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#2d3748",
                      textTransform: "capitalize",
                    }}
                  >
                    {property.type == "commercialOffice"
                      ? "Commercial Office"
                      : ""}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <LocalParkingIcon sx={{ fontSize: 18, color: "#666" }} />
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "#2d3748" }}
                      >
                        {property?.parking_space}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "#2d3748" }}
                      >
                        Area: {property.area} sqft
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Title */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "#3182ce",
                    mb: 2,
                    fontWeight: 500,
                    fontSize: "1rem",
                    textTransform: "capitalize ",
                  }}
                >
                  {property.features?.join(" | ")}
                </Typography>

                {/* Location */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <LocationOn sx={{ fontSize: 18, color: "#666", mt: 0.2 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#666",
                      lineHeight: 1.5,
                    }}
                  >
                    {property.address}
                  </Typography>
                </Box>

                {/* Handover and Payment Plan */}
                <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                    Total Selling Price
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "#2d3748" }}
                    >
                      {formatPrice(property.price)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                      Selling price per (sqft)
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "#2d3748",
                          textTransform: "capitalize",
                        }}
                      >
                        {formatPrice(property?.selling_price_sqft)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 4, mb: 3 ,alignItems:"center"}}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                     Annual Rental Price  
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "#2d3748" }}
                    >
                      {formatPrice(property.rental_price)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                      Rental price per (sqft)
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "#2d3748",
                          textTransform: "capitalize",
                        }}
                      >
                        {formatPrice(property?.rental_price_per_sqft)}
                      </Typography>
                    </Box>
                  </Box>
                  {property?.rented_vacant === "rented" && (
                    <>
  <Box>
    <Typography
      variant="caption"
      sx={{
        color: "#666",
        textTransform: "uppercase",
        fontWeight: 600,
        fontSize: "0.75rem",
      }}
    >
      Status
    </Typography>

    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
      <Typography
        variant="body2"
        sx={{ textTransform: "capitalize", fontWeight: 600 }}
      >
        {property?.rented_vacant}
      </Typography>

   
    </Box>
  </Box>

  <Box>
       <Button
        size="small"
        variant="outlined"
        sx={{fontWeight:"bold",height:"44px"}}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedProperty(property);
          setOpenStatus(true);
        }}
      >
        View Rent Details
      </Button>
  </Box>
                    </>
)}

                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    );
  };

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <Box
          sx={{
            // minHeight: "100vh",
            backgroundImage: `url(${Images.banner3})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            pt: 4,
            pb: 8,
          }}
        >
          <Container sx={{ py: 4, maxWidth: "1300px !important" }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: "2rem", md: "3rem" },
                  color: "white",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                Premium Properties
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  fontWeight: 400,
                }}
              >
                Discover luxury homes and investment opportunities
              </Typography>
            </Box>

            {/* Filters Section */}
            <Paper
  elevation={0}
  sx={{
    p: 1.5, // tighter padding
    mb: 2, // smaller margin
    borderRadius: 2,
    border: "1px solid #e2e8f0",
    backgroundColor: "white",
  }}
>
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
    <FilterList sx={{ color: "#4a5568", fontSize: 18 }} />
    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#2d3748" }}>
      Search Filters
    </Typography>
  </Box>

  <Grid container spacing={1.5}>
    <Grid item xs={12} md={3}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by Name"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "#718096", fontSize: 18 }} />
            </InputAdornment>
          ),
        }}
      />
    </Grid>

    <Grid item xs={12} md={3}>
      <FormControl fullWidth size="small">
        <InputLabel>Property Type</InputLabel>
        <Select
          value={filters.propertyType}
          label="Property Type"
          onChange={(e) =>
            setFilters({ ...filters, propertyType: e.target.value })
          }
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="commercialOffice">Commercial Office</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} md={3}>
      <FormControl fullWidth size="small">
        <InputLabel>Select Purpose</InputLabel>
        <Select
          value={filters.purpose}
          label="Purpose"
          onChange={(e) =>
            setFilters({ ...filters, purpose: e.target.value })
          }
        >
          <MenuItem value="">Both</MenuItem>
          <MenuItem value="sell">Sell</MenuItem>
          <MenuItem value="rent">Rent</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} md={3}>
  <Typography
    variant="caption"
    sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
  >
    Price Range (AED)
  </Typography>
  <Box sx={{ width: {md:"90%",sm:"98%",xs:"95%" },marginTop:"-10px" ,marginLeft:"10px"}}>
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
      sx={{
        color: Colors.primary,
        height: 4,
        padding: '0 !important',
      }}
    />
  </Box>
</Grid>

  </Grid>
</Paper>



          </Container>
        </Box>
        <Container sx={{ py: 4, maxWidth: "1300px !important" }}>
          {/* Results Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ color: "#4a5568" }}>
              {properties.length} Properties Found
            </Typography>
          </Box>
          {console.log(properties)}
          {/* Properties Grid */}
          <Grid container spacing={3}>
            {loading ? (
              <Grid item xs={12} display="flex" justifyContent="center" py={5}>
                <Loader width="40px" height="40px" color={Colors.primary} />
              </Grid>
            ) : properties.length === 0 ? (
              <Grid item xs={12} display="flex" justifyContent="center" py={5}>
                <Typography>No properties found</Typography>
              </Grid>
            ) : (
              properties.map((property) => (
                <Grid item xs={12} sm={12} lg={12} key={property._id}>
                  <PropertyCard property={property} />
                </Grid>
              ))
            )}
          </Grid>

          {properties.length < count && (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleShowMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Show More"}
              </Button>
            </Box>
          )}
        </Container>
      </Box>


      <SimpleDialog
  open={openStatus}
  onClose={() => setOpenStatus(false)}
  border={`4px solid ${Colors.primary}`}
  title="Rent Details"
>
<Grid container spacing={4} mt={1}>
  <Grid item xs={12} md={6}>
    <Typography variant="subtitle2" fontWeight={600} sx={{textAlign:"center"}}>
      Tenure (Years):
    </Typography>
    <Typography variant="body2" sx={{textAlign:"center"}}>
      {selectedProperty?.tenure_years || "—"}
    </Typography>
  </Grid>

  <Grid item xs={12} md={6}>
    <Typography variant="subtitle2" fontWeight={600} sx={{textAlign:"center"}}>
      Contract Value:
    </Typography>
    <Typography variant="body2" sx={{textAlign:"center"}}>
      {selectedProperty?.contract_value
        ? formatPrice(selectedProperty.contract_value)
        : "—"}
    </Typography>
  </Grid>

  <Grid item xs={12} md={6}>
    <Typography variant="subtitle2" fontWeight={600} sx={{textAlign:"center"}}>
      Lease Start Date:
    </Typography>
    <Typography variant="body2" sx={{textAlign:"center"}}>
      {selectedProperty?.lease_start_date
        ? moment(selectedProperty.lease_start_date).format("DD-MM-YYYY")
        : "—"}
    </Typography>
  </Grid>

  <Grid item xs={12} md={6}>
    <Typography variant="subtitle2" fontWeight={600} sx={{textAlign:"center"}}>
      Lease End Date:
    </Typography>
    <Typography variant="body2" sx={{textAlign:"center"}}>
      {selectedProperty?.lease_end_date
        ? moment(selectedProperty.lease_end_date).format("DD-MM-YYYY")
        : "—"}
    </Typography>
  </Grid>
</Grid>

</SimpleDialog>


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
    </>
  );
};

export default ProfessionalPropertyListing;
