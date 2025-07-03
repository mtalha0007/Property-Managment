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
import PropertyServices from "../../../api/PropertyServices/property.index";
import Header from "../Header";
import { Images } from "../../../assets/images";
import { useNavigate, useParams } from "react-router-dom";
import Colors from "../../../assets/styles";
import { useLocation } from "react-router-dom";
import Loader from "../../../components/Loader";

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
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  console.log(query, "query");
  const location = query.get("location");
  const type = query.get("type");
  const priceMin = query.get("priceMin");
  const priceMax = query.get("priceMax");

  console.log(type, "type");

  const debounceRef = useRef(null);

  const handleSearchChange = useCallback((value) => {
   
      setSearch(value);
  
  }, []);

  useEffect(() => {
  
    setSearch( location ? location : "");
    setFilters((prev) => ({
      ...prev,
      priceRange: [
        priceMin !== null && !isNaN(priceMin) ? priceMin : prev.priceRange[0],
        priceMax !== null && !isNaN(priceMax) ? priceMax : prev.priceRange[1],
      ],
    }));
  }, [priceMin, priceMax,location]);

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
      currency: "USD",
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
        searchParam ? searchParam :location ? location :"",
        idParam,
        pageParam,
        limitParam,
        filters?.priceRange[0] ? filters?.priceRange[0] :  priceMin ?priceMin :0,
        filters?.priceRange[1] ? filters?.priceRange[1] :  priceMax ? priceMax :"",
      
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

  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: [0, 5000000],
    bedrooms: "",
    bathrooms: "",
    area: [0, 10000],
    sortBy: "price-low",
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
        filters?.priceRange[1]
      );
    }, 1000); 
  
    return () => clearTimeout(debounceTimeout); 
  }, [search, id, filters?.priceRange[0], filters?.priceRange[1]]);
  

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
      filters?.priceRange[1]
    );
  };

  const [currentImageIndexes, setCurrentImageIndexes] = useState({});

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
        onClick={() => {
          navigate(`/property-detail/${property._id}`);
        }}
      >
        <Grid container>
          {/* Image Section */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{ position: "relative", height: { xs: 250, md: 320 } }}
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
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#2d3748",
                    mb: 2,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  {property.name}
                </Typography>

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
                    {property.type}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Bed sx={{ fontSize: 18, color: "#666" }} />
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "#2d3748" }}
                      >
                        {property.beds}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Bathtub sx={{ fontSize: 18, color: "#666" }} />
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "#2d3748" }}
                      >
                        {property.baths}
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
                    {property.location}
                  </Typography>
                </Box>

                {/* Validation Note */}
                {property.validationDate && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 16, color: "#3182ce" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#3182ce", fontSize: "0.9rem" }}
                    >
                      Property authenticity was validated on{" "}
                      {property.validationDate}
                    </Typography>
                  </Box>
                )}

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
                      Price
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: "#2d3748" }}
                    >
                      AED {formatPrice(property.price)}
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
                      Payment Plan
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
                        {property.payment_terms}
                      </Typography>
                      <Info sx={{ fontSize: 14, color: "#666" }} />
                    </Box>
                  </Box>
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
                  fontSize: { xs: "2rem", md: "2.5rem" },
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
                p: 3,
                mb: 4,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                backgroundColor: "white",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <FilterList sx={{ color: "#4a5568" }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#2d3748" }}
                >
                  Search Filters
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* Search Location */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search by Name"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    // onChange={(e) =>
                    //   setFilters({ ...filters, location: e.target.value })
                    // }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: "#718096" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                {/* Property Type */}
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Property Type</InputLabel>
                    <Select
                      value={filters.propertyType}
                      label="Property Type"
                      onChange={(e) =>
                        setFilters({ ...filters, propertyType: e.target.value })
                      }
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="villa">Villa</MenuItem>
                      <MenuItem value="apartment">Apartment</MenuItem>
                      <MenuItem value="townhouse">Townhouse</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Advanced Filters */}
                <Grid item xs={12} md={4}>
                  {/* <Accordion
                    elevation={0}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 2,
                      "& .MuiAccordionSummary-root": {
                        minHeight: "54px !important",
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="body2">Advanced Filters</Typography>
                    </AccordionSummary>
                    <AccordionDetails> */}
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
                  {/* <Box>
                        <Typography
                          variant="body2"
                          sx={{ mb: 2, fontWeight: 600 }}
                        >
                          Area (sqft)
                        </Typography>
                        <Slider
                          value={filters.area}
                          onChange={(e, newValue) =>
                            setFilters({ ...filters, area: newValue })
                          }
                          valueLabelDisplay="auto"
                          min={0}
                          max={10000}
                          step={100}
                        />
                      </Box> */}
                  {/* </AccordionDetails>
                  </Accordion> */}
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
    </>
  );
};

export default ProfessionalPropertyListing;
