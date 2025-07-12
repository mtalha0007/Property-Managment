import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  Divider,
  Button,
  Checkbox,
  FormControlLabel,
  Rating,
  FormHelperText,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormGroup,
} from "@mui/material";
import {
  Search,
  LocationOn,
  CalendarToday,
  AccessTime,
  Home,
  Bed,
  Bathtub,
  AspectRatio,
  AttachMoney,
  Person,
  Email,
  Description,
  Download,
} from "@mui/icons-material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { ErrorToaster, SuccessToaster } from "../../../components/Toaster";
import Header from "../Header";
import AuthServices from "../../../api/AuthServices/auth.index";
import { useAuth } from "../../../context";
import SimpleDialog from "../../../components/Dialog";
import Colors from "../../../assets/styles";
import { useForm, Controller } from "react-hook-form";
import Loader from "../../../components/Loader";

export default function MyBooking() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedBackLoading, setFeedBackLoading] = useState(false);
  const [openFeedBackDialog, setOpenFeedBackDialog] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { webUser } = useAuth();

  const reasons = ["Price", "Size", "Layout", "Condition", "Location"];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      interested: true,
      rating: 0,
      // comments: "",

      interestedOptions: [],
      notInterestedReasons: [],
        // helpInterested: " ",
        // helpNotInterested: " ",
      },
    mode: "onSubmit",
  });
  const ratingValue = watch("rating");
  const interested = watch("interested");

  
  const onSubmit = async (data) => {
    console.log(data);
    setFeedBackLoading(true); 
    const obj = {
      id: selectedBooking?._id,
      feedback: {
        interested: data?.interested,
        rating: data?.rating,
        comment: data?.comments,
        is_offer :data?.interested == true ? data?.interestedOptions : data?.notInterestedReasons,
        reason: data?.interested == true ? data?.helpInterested :data?.helpNotInterested
      },
    };
    console.log(obj);
    

    try {
      const response = await AuthServices.createFeedBack(obj);
      setOpenFeedBackDialog(false);
      SuccessToaster(response?.message);
      getBookingList(search, page + 1, limit, "", webUser?._id);
    } catch (error) {
      ErrorToaster(error);
    } finally {
      setFeedBackLoading(false);
    }
  };

  const getBookingList = async (
    searchParam = "",

    pageParam = 1,
    limitParam = 10,
    statusParam = "pending",
    agentId
  ) => {
    setLoading(true);
    try {
      const { data } = await AuthServices.getBooking(
        searchParam,
        pageParam,
        limitParam,
        statusParam,
        webUser?._id
      );
      setData(data?.bookings);
      setCount(data.count);
    } catch (error) {
      ErrorToaster(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookingList(search, page + 1, limit, "", webUser?._id);
  }, [page, limit, search]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Header />
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          My Bookings
        </Typography>

        {/* Loading State */}
        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Bookings Grid */}
        {!loading && (
          <Grid container spacing={3}>
            {data.map((booking) => (
              <Grid item xs={12} key={booking._id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    minHeight: 300,
                    boxShadow: 3,
                    borderRadius: 2,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-2px)",
                      transition: "all 0.3s ease-in-out",
                    },
                  }}
                >
                  {/* Property Image */}
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: "100%", md: 350 },
                      height: { xs: 250, md: "auto" },
                      objectFit: "cover",
                    }}
                    image={
                      booking.property?.images?.[0] ||
                      "/placeholder.svg?height=300&width=350"
                    }
                    alt={booking.property?.name}
                  />

                  {/* Content */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                  >
                    <CardContent sx={{ p: 3, flex: 1 }}>
                      {/* Header with Status */}
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        sx={{ flexWrap: "wrap" }}
                        mb={2}
                      >
                        <Typography
                          variant="h5"
                          component="h2"
                          fontWeight="bold"
                        >
                          {booking.property?.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            mt: { md: 0, sm: 0, xs: 1 },
                          }}
                        >
                          {booking.status == "approved" &&
                            !booking?.feedback?.rating && (
                              <Chip
                                label={"Give FeedBack"}
                                sx={{
                                  backgroundColor: "#5ac4bd",
                                  color: "white",
                                  cursor: "pointer",
                                }}
                                size="small"
                                onClick={() => {
                                  setOpenFeedBackDialog(true);
                                  setSelectedBooking(booking);
                                }}
                              />
                            )}
                          <Chip
                            label={booking.status.toUpperCase()}
                            color={getStatusColor(booking.status)}
                            size="small"
                          />
                        </Box>
                      </Box>

                      {/* Property Details */}
                      <Stack spacing={1} mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {booking.property?.address}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                          <AttachMoney fontSize="small" color="action" />
                          <Typography
                            variant="h6"
                            color="primary"
                            fontWeight="bold"
                          >
                            {formatPrice(booking.property?.price)}
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              ml={1}
                            >
                              / {booking.property?.payment_terms}
                            </Typography>
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Home fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {booking.property?.type}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Bed fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {booking.property?.beds} beds
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Bathtub fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {booking.property?.baths} baths
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <AspectRatio fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {booking.property?.area} sq ft
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      {/* Booking Details */}
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        Booking Details
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                          >
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Date:</strong> {formatDate(booking.date)}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Time:</strong> {booking.time}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {booking.notes && (
                        <Box sx={{ mt: 1 }}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                          >
                            <Description fontSize="small" color="action" />
                            <Typography variant="body2">
                              <strong>Notes:</strong> {booking.notes}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* Property Features */}
                      {booking.property?.features &&
                        booking.property?.features?.length > 0 && (
                          <Box mt={2}>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              mb={1}
                            >
                              Features:
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                              {booking.property.features.map(
                                (feature, index) => (
                                  <Chip
                                    key={index}
                                    label={feature}
                                    size="small"
                                    variant="outlined"
                                  />
                                )
                              )}
                            </Box>
                          </Box>
                        )}
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && data?.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No bookings found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {search
                ? "Try adjusting your search criteria"
                : "You haven't made any bookings yet"}
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {!loading && data?.length > 0 && Math.ceil(count / limit) > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil(count / limit)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Box>

      {/* Dialog */}

      <SimpleDialog
        open={openFeedBackDialog}
        onClose={() => {
          setOpenFeedBackDialog(false);
          reset();
        }}
        border={`4px solid ${Colors.primary}`}
        title="We value your feedback!"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            {/* Interested Checkbox */}
            <Box mb={3}>
              <FormControl>
                <FormLabel>
                  <Typography fontWeight={500} color="text.primary">
                    Is the client interested?
                  </Typography>
                </FormLabel>
                <RadioGroup
                  row
                  value={interested}
                  onChange={(e) => {
                    setValue("interested", e.target.value === "true");
                    trigger("interested");
                  }}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Interested"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Not Interested"
                  />
                </RadioGroup>
                {errors.interested && (
                  <FormHelperText error>
                    {errors.interested.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>

            {interested ? (
              <>
                <Box mb={2}>
                  <Typography fontWeight={500}>
                    Did they ask about making an offer or booking a second
                    visit? *
                  </Typography>
                  <FormGroup row>
                    {["Making Offer", "Booking Second Visit"].map((option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Controller
                            name="interestedOptions"
                            control={control}
                            rules={{
                              validate: (val) =>
                                val?.length > 0 || "Select at least one.",
                            }}
                            render={({ field }) => (
                              <Checkbox
                                checked={field?.value?.includes(option)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field?.value, option]
                                    : field?.value.filter(
                                        (val) => val !== option
                                      );
                                  field?.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                  {errors.interestedOptions && (
                    <FormHelperText error>
                      {errors.interestedOptions.message}
                    </FormHelperText>
                  )}
                </Box>

                <Box mb={3}>
                  <TextField
                    label="What would help convert this interest into a deal? *"
                    fullWidth
                    multiline
                    rows={3}
                    {...register("helpInterested", {
                      required: "This field is required.",
                    })}
                    error={!!errors.helpInterested}
                    helperText={errors.helpInterested?.message}
                    
                  />
                </Box>
              </>
            ) : (
              <>
                <Box mb={2}>
                  <Typography fontWeight={500}>
                    What was the main reason the client was not interested? *
                  </Typography>
                  <FormGroup row>
                    {reasons.map((reason) => (
                      <FormControlLabel
                        key={reason}
                        control={
                          <Controller
                            name="notInterestedReasons"
                            control={control}
                            rules={{
                              validate: (val) =>
                                val?.length > 0 ||
                                "Select at least one reason.",
                            }}
                            render={({ field }) => (
                              <Checkbox
                                checked={field?.value?.includes(reason)}
                                onChange={(e) => {
                                  const newValue = e?.target?.checked
                                    ? [...field?.value, reason]
                                    : field?.value.filter(
                                        (val) => val !== reason
                                      );
                                  field?.onChange(newValue);
                                }}
                              />
                            )}
                          />
                        }
                        label={reason}
                      />
                    ))}
                  </FormGroup>
                  {errors.notInterestedReasons && (
                    <FormHelperText error>
                      {errors.notInterestedReasons.message}
                    </FormHelperText>
                  )}
                </Box>

                <Box mb={3}>
                  <TextField
                    label="What would help convert this lead into potential customer? *"
                    fullWidth
                    multiline
                    rows={3}
                    {...register("helpNotInterested", {
                      required: "This field is required.",
                    })}
                    error={!!errors.helpNotInterested}
                    helperText={errors.helpNotInterested?.message}
                  />
                </Box>
              </>
            )}

          
            {/* Rating */}
            <Box>
        <Typography fontWeight={500} color="text.primary" gutterBottom>
          Rate Overall Experience
        </Typography>

        <Controller
          name="rating"
          control={control}
          rules={{
            validate: (value) =>
              value > 0 || "Please select at least 1 star",
          }}
          render={({ field }) => (
            <Rating
              {...field}
              value={field.value}
              onChange={(_, value) => field.onChange(value || 0)}
              sx={{ color: "primary.main", fontSize: "2.5rem" }}
            />
          )}
        />

        {errors.rating && (
          <FormHelperText error>
            {errors.rating.message}
          </FormHelperText>
        )}
      </Box>


           

            {/* Comments */}
            <Box>
              <TextField
                label="Additional Comments"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                placeholder="Tell us what we did well or could improve..."
                {...register("comments", {
                  required: "Comments are required",
                })}
                error={!!errors.comments}
                helperText={errors.comments?.message}
                
              />
             
            </Box>

            {/* Submit Button */}
            <Box textAlign="center" mt={1}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: Colors.primary,
                  px: 4,
                  py: 1,
                  borderRadius: "8px",
                  color: Colors.white,
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  ":hover": {
                    backgroundColor: Colors.primary,
                    opacity: 0.9,
                  },
                }}
              >
                {feedBackLoading ? (
                  <Loader width="25px" height="25px" color={Colors.white} />
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </SimpleDialog>
    </>
  );
}
