import {
  Box,
  Grid,
  Typography,
  InputLabel,
  Avatar,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
  FormHelperText,
  FormControl,
  Chip,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Colors from "../../../../assets/styles";
import { Controller, useForm } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import PropertyServices from "../../../../api/PropertyServices/property.index";
import { useNavigate } from "react-router-dom";
import { ErrorToaster, SuccessToaster } from "../../../../components/Toaster";
import { ErrorHandler } from "../../../../utils/ErrorHandler";
import CompanyServices from "../../../../api/CompanyServices/company.index";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { AddressForm } from "../../../../components/AdressMap";
import SelectAddressDialog from "../../../../components/AdressMap/SelectAddressDialo";
import FileServices from "../../../../api/FileServices/file.index";
import Loader from "../../../../components/Loader";

export default function CreateProperty() {
  const containerRef = useRef(null);

  const [managmentCompany, setManagmentCompany] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [purpose, setPurpose] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [featureList, setFeatureList] = useState([]);
  const [area, setArea] = useState("");
  const [managmentCompanyData, setManagmentCompanyData] = useState([]);
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pages, setPages] = useState("");
  const [limit, setLimit] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [addressFormDialog, setAddressFormDialog] = useState(false);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState({});
  const [addressLists, setAddressLists] = useState("");
  const [mapAddress, setMapAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [brochureLoading, setBrochureLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [brochureDocumment, setBrochureDocumment] = useState(null);
  const [buildingLayout, setBuildingLayout] = useState(null);
  const [buildingLayoutLoading, setBuildingLayoutLoading] = useState(false);
  const [rentedVacant, setRentedVacant] = useState("");
  const [brochureError, setBrochureError] = useState("");
  const [buildingLayoutError, setBuildingLayoutError] = useState("");

  const [selectAddressDialog, setSelectAddressDialog] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const itemPerPage = 30;
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term === "") {
      setCitiesData(allCities.slice(0, itemPerPage));
    } else {
      const filteredFonts = allCities.filter((font) =>
        font.toLowerCase().includes(term.toLowerCase())
      );
      setCitiesData(filteredFonts);
    }
  };
  const MAX_FILE_SIZE = 10 * 1024 * 1024; 

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const obj = { country: "United States" };
  //     const response = await axios.post(
  //       "https://countriesnow.space/api/v0.1/countries/cities",
  //       obj
  //     );
  //     setCitiesData(response?.data?.data?.slice(0, itemPerPage));
  //     setAllCities(response?.data?.data); // Adjust based on your API response structure
  //   } catch (error) {
  //     console.error("Error fetching data: ", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const phoneNumberValidation = (value, country) => {
  //   const usPhonePattern = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{5})$/;
  //   const mxPhonePattern = /^(\+52)?\d{12}$/;

  //   if (country === "us") {
  //     return usPhonePattern.test(value) || "Please enter a valid US phone number";
  //   } else if (country === "mx") {
  //     return mxPhonePattern.test(value) || "Please enter a valid Mexican phone number";
  //   }
  //   return true;
  // };

  // const loadMoreFonts = useCallback(() => {
  //   console.log("sdaasdasd");
  //   const itemsPerPage = 30;
  //   const startIndex = (page - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   const newCities = allCities.slice(startIndex, endIndex);
  //   const newFonts = newCities;
  //   setCitiesData((prevFonts) => [...prevFonts, ...newFonts]);
  //   // console.log(newFonts, "teste=");
  //   // setCitiesData(newFonts);
  //   setLoading(false);
  // }, [page, loading, citiesData]);

  // const handleScroll = () => {
  //   if (!containerRef.current) return;
  //   const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

  //   if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
  //     setPage((prevPage) => prevPage + 1);
  //     console.log(page);
  //   }
  // };
  // useEffect(() => {
  //   loadMoreFonts();
  // }, [page]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors },
    clearErrors
  } = useForm();
  const handleUploadDoc = async (e) => {
    setBrochureError(""); // reset
    const file = e.target.files[0];
    if (file?.size > MAX_FILE_SIZE) {
      setBrochureError("File size must be less than 10MB.");
      e.target.value = "";
      return;
    }
  
    setBrochureLoading(true);
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await FileServices.uploadDocument(formData);
      setBrochureDocumment(response?.url);
      SuccessToaster(response?.message);
    } catch (error) {
      ErrorToaster(error);
    } finally {
      setBrochureLoading(false);
    }
  };
  
  const handleUploadDoc2 = async (e) => {
    setBuildingLayoutError(""); // reset
    const file = e.target.files[0];
    if (file?.size > MAX_FILE_SIZE) {
      setBuildingLayoutError("File size must be less than 10MB.");
      e.target.value = "";
      return;
    }
  
    setBuildingLayoutLoading(true);
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await FileServices.uploadDocument(formData);
      setBuildingLayout(response?.url);
      SuccessToaster(response?.message);
    } catch (error) {
      ErrorToaster(error);
    } finally {
      setBuildingLayoutLoading(false);
    }
  };
  

  const navigate = useNavigate();

  const createProperty = async (data) => {
    const obj = {
      name: data.propertName,
      price: data.price,
      unit_number: data.unit_number,
      selling_price_sqft: data?.selling_price_sqft,

      type: "commercialOffice",
      rental_price: data?.rental_price,
      area: data.area,
      rental_price_per_sqft: data?.rental_price_per_sqft,
      address: data.address,
      // annual_rent: data?.annual_rent,
      features: data.features,
      service_charges:data?.service_charges,
      rented_vacant:rentedVacant,
      parking_space:data?.parking_space,
      category: category,
      comments:data?.comments,
      purpose: data.purpose,
      description: data.description,
      images: images.map((img) => img.url),
      brochureDocumment:brochureDocumment,
      buildingLayout:buildingLayout,
      tenure_years:data?.tenure_years,
      contract_value:data?.contract_value,
      lease_start_date:data?.lease_start_date,
      lease_end_date:data?.lease_end_date


      // company_id: managmentCompany,
      // location: mapAddress,
      // latitude: lat,
      // longitude: lng,
      // refno: data.refno,
      // beds: data.beds,
      // baths: data.baths,
     
      // payment_terms: paymentTerms,
    };
    console.log(obj)
    
    setIsSubmitting(true);
    try {
      const data = await PropertyServices.createProperty(obj);
      console.log(data);
      SuccessToaster(data?.message);
      navigate("/properties");
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error);
      console.log(error?.message);
    } finally {
      setIsSubmitting(false);
    }
    console.log(obj);
  };
  const saveAddress = async (data) => {
    console.log(data);
    setValue("location", data.address);
    setValue("company_lat", data.latitude);
    setValue("company_lng", data.longitude);

    setMapAddress(data.address);
    setLat(data.latitude);
    setLng(data.longitude);
  };

  useEffect(() => {
    register("features", {
      required: "At least one feature is required",
      validate: (value) =>
        (Array.isArray(value) && value.length > 0) ||
        "At least one feature is required",
    });
  }, [register]);

  const handleUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const formData = new FormData();
  
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });
  
    try {
      const response = await FileServices.uploadImage(formData);
  
      const uploadedImages =
        response?.urls?.map((url) => ({
          url,
        })) || [];
  
      setImages((prev) => {
        const updated = [...prev, ...uploadedImages];
        if (updated.length > 0) {
          clearErrors("images"); // ✅ clear error when at least one image is present
        }
        return updated;
      });
  
      SuccessToaster(response?.message);
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "10px",
          alignItems: "center",
          mt: 9.5,
          pl: 2,
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
          Add New
        </Typography>
      </Box>
      <Box
        component={"form"}
        sx={{
          marginTop: "14px",
          marginLeft: "16px",
          marginRight: "16px",
          padding: "20px",
          backgroundColor: Colors.backgroundColor,
          boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
        onSubmit={handleSubmit(createProperty)}
      >
        <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
          Property Details
        </Typography>
        <Box sx={{ mt: 1.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Building Name
              </InputLabel>
              <TextField
                fullWidth
                {...register("propertName", {
                  required: "Building Name is required",
                  validate: (value) =>
                    value.trim() !== "" || "Building Name is required",
                })}
                error={errors.propertName && true}
                helperText={errors?.propertName?.message}
              />
            </Grid>

            {/* <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Total Selling Price
              </InputLabel>
              <TextField
                fullWidth
                {...register("price", {
                  required: "Total Selling Price is required",
                  validate: (value) =>
                    value.trim() !== "" || "Total Selling Price is required",
                })}
                error={!!errors.price}
                helperText={errors?.price?.message}
              />
            </Grid> */}
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Unit Number
              </InputLabel>
              <TextField
                fullWidth
                {...register("unit_number", {
                  required: "Unit Number is required",
                  validate: (value) =>
                    value.trim() !== "" || "Unit Number is required",
                })}
                error={!!errors.unit_number}
                helperText={errors?.unit_number?.message}
              />
            </Grid>
            {/* <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Selling price per (sqft)
              </InputLabel>
              <TextField
                fullWidth
                {...register("selling_price_sqft", {
                  required: "Selling price per (sqft) is required",
                  validate: (value) =>
                    value.trim() !== "" ||
                    "Selling price per (sqft) is required",
                })}
                error={!!errors.selling_price_sqft}
                helperText={errors?.selling_price_sqft?.message}
              />
            </Grid> */}
            {/* <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Type
              </InputLabel>
              <TextField
                fullWidth
                select
                {...register("type", {
                  required: type == "" ? "Type is required" : false,
                  onChange: (e) => {
                    setValue("type", e.target.value);
                    setType(e.target.value);
                  },
                })}
                error={errors.type && true}
                helperText={errors?.type?.message}
                value={type}
                // onChange={(e) => setBillingPreference(e.target.value)}
              >
                <MenuItem value="commercialOffice">Commercial Ofice</MenuItem>
              </TextField>
            </Grid> */}
            {/* <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
               Annual Rental Price
              </InputLabel>
              <TextField
                fullWidth
                {...register("rental_price", {
                  required: "Rental Price is required",
                  validate: (value) =>
                    value.trim() !== "" || "Rental Price is required",
                })}
                error={!!errors.rental_price}
                helperText={errors?.rental_price?.message}
              />
            </Grid> */}
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Size (sqft)
              </InputLabel>
              <TextField
                fullWidth
                {...register("area", {
                  required: "Size is required",
                  validate: (value) =>
                    value.trim() !== "" || "Size is required",
                })}
                error={!!errors.area}
                helperText={errors?.area?.message}
              />
            </Grid>
            {/* <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Rental Price per (sqft)
              </InputLabel>
              <TextField
                fullWidth
                {...register("rental_price_per_sqft", {
                  required: "Rental Price per (sqft) is required",
                  validate: (value) =>
                    value.trim() !== "" ||
                    "Rental Price per (sqft) is required",
                })}
                error={!!errors.rental_price_per_sqft}
                helperText={errors?.rental_price_per_sqft?.message}
              />
            </Grid> */}
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Address
              </InputLabel>
              <TextField
                fullWidth
                {...register("address", {
                  required: "Address is required",
                  validate: (value) =>
                    value.trim() !== "" || "Address is required",
                })}
                error={!!errors.address}
                helperText={errors?.address?.message}
              />
            </Grid>
            {/* <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Annual Rent
              </InputLabel>
              <TextField
                fullWidth
                {...register("annual_rent", {
                  required: "Annual Rent is required",
                  validate: (value) =>
                    value.trim() !== "" || "Annual Rent is required",
                })}
                error={!!errors.annual_rent}
                helperText={errors?.annual_rent?.message}
              />
            </Grid> */}
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Features
              </InputLabel>
              <TextField
                fullWidth
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && featureInput.trim()) {
                    e.preventDefault();
                    if (!featureList.includes(featureInput.trim())) {
                      const newList = [...featureList, featureInput.trim()];
                      setFeatureList(newList);
                      setFeatureInput("");
                      setValue("features", newList);
                    }
                  }
                }}
                placeholder="Type a feature and press Enter"
                error={!!errors.features}
                helperText={errors?.features?.message}
              />

              {/* Chips Display */}
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {featureList.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    onDelete={() => {
                      const newList = featureList.filter((_, i) => i !== index);
                      setFeatureList(newList);
                      setValue("features", newList); // sync with react-hook-form
                    }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
              Service Charges

              </InputLabel>
              <TextField
                fullWidth
                {...register("service_charges", {
                  required: "Service Charges is required",
                  validate: (value) =>
                    value.trim() !== "" || "Service Charges is required",
                })}
                error={!!errors.service_charges}
                helperText={errors?.service_charges?.message}
              />
            </Grid>
            {/* Rented */}
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Status
              </InputLabel>
              <TextField
                fullWidth
                select
                {...register("rented_vacant", {
                  required: rentedVacant == "" ? "Rented/Vacant is required" : false,
                  onChange: (e) => {
                    setValue("rented_vacant", e.target.value);
                    setRentedVacant(e.target.value);
                  },
                })}
                error={errors.rented_vacant && true}
                helperText={errors?.rented_vacant?.message}
                value={rentedVacant}
                // onChange={(e) => setBillingPreference(e.target.value)}
              >
                <MenuItem value="rented">Rented</MenuItem>
                <MenuItem value="vacant">Vacant</MenuItem>
              </TextField>
            </Grid>
            {rentedVacant === "rented" && (
  <>
    <Grid item xs={12} md={5}>
      <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
        Tenure / Years
      </InputLabel>
      <TextField
        fullWidth
        {...register("tenure_years"
        //   , {
        //   required: "Tenure is required",
        // }
      )}
        error={!!errors.tenure_years}
        helperText={errors?.tenure_years?.message}
      />
    </Grid>

    <Grid item xs={12} md={5}>
      <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
        Contract Value
      </InputLabel>
      <TextField
        fullWidth
        {...register("contract_value"
        //   , {
        //   required: "Contract value is required",
        // }
      )}
        error={!!errors.contract_value}
        helperText={errors?.contract_value?.message}
      />
    </Grid>

    <Grid item xs={12} md={5}>
      <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
        Lease Start Date
      </InputLabel>
      <TextField
        type="date"
        fullWidth
        {...register("lease_start_date", {
          required: "Start date is required",
        })}
        error={!!errors.lease_start_date}
        helperText={errors?.lease_start_date?.message}
        InputLabelProps={{ shrink: true }}
      />
    </Grid>

    <Grid item xs={12} md={5}>
      <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
        Lease End Date
      </InputLabel>
      <TextField
        type="date"
        fullWidth
        {...register("lease_end_date", {
          required: "End date is required",
        })}
        error={!!errors.lease_end_date}
        helperText={errors?.lease_end_date?.message}
        InputLabelProps={{ shrink: true }}
      />
    </Grid>
  </>
)}
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
              Parking Spaces

              </InputLabel>
              <TextField
                fullWidth
                {...register("parking_space", {
                  required: "Parking Spaces is required",
                  validate: (value) =>
                    value.trim() !== "" || "Parking Spaces is required",
                })}
                error={!!errors.parking_space}
                helperText={errors?.parking_space?.message}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Category
              </InputLabel>
              <TextField
                fullWidth
                select
                {...register("category", {
                  required: category == "" ? "Category is required" : false,
                  onChange: (e) => {
                    setValue("category", e.target.value);
                    setCategory(e.target.value);
                  },
                })}
                error={errors.category && true}
                helperText={errors?.category?.message}
                value={category}
                // onChange={(e) => setBillingPreference(e.target.value)}
              >
                <MenuItem value="fitted">Fitted</MenuItem>
                <MenuItem value="not_fitted">Not Fitted</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
              Fit Out Completion & Comments
              </InputLabel>
              <TextField
                fullWidth
                {...register("comments", {
                  required: "Fit Out Completion & Comments is required",
                  validate: (value) =>
                    value.trim() !== "" || "Fit Out Completion & Comments is required",
                })}
                error={!!errors.comments}
                helperText={errors?.comments?.message}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Purpose
              </InputLabel>
              <TextField
                fullWidth
                select
                {...register("purpose", {
                  required: purpose == "" ? "Purpose is required" : false,
                  onChange: (e) => {
                    setValue("purpose", e.target.value);
                    setPurpose(e.target.value);
                  },
                })}
                error={errors.purpose && true}
                helperText={errors?.purpose?.message}
                value={purpose}
                // onChange={(e) => setBillingPreference(e.target.value)}
              >
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="rent">Rent</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Description
              </InputLabel>
              <TextField
                fullWidth
                {...register("description", {
                  required: "Description is required",
                  validate: (value) =>
                    value.trim() !== "" || "Description is required",
                })}
                error={!!errors.description}
                helperText={errors?.description?.message}
              />
            </Grid>
            {/* <Grid item xs={12} sm={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: "black" }}>
                Area (sqft)
              </InputLabel>
              <div>
                <div>
                  <div className="dropdown-container">
                    <input
                      type="text"
                      id="dropdown-font"
                      className="dropdown-toggle"
                      placeholder="Select Area"
                      style={{ fontFamily: searchTerm }}
                      value={searchTerm}
                      onClick={toggleDropdown}
                      onChange={handleSearch}
                    />
                    {isDropdownOpen && (
                      <div className="dropdown-content">
                        <div
                          ref={containerRef}
                          onScroll={handleScroll}
                          className="dropdown-list"
                        >
                          {citiesData.map((font) => {
                            return (
                              <div
                                key={font.family}
                                style={{
                                  fontFamily: font.family,
                                  cursor: "pointer",
                                  padding: "10px",
                                }}
                                onClick={(e) => {
                                  setSearchTerm(font);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                {font}
                              </div>
                            );
                          })}
                          {loading && <div>Loading more Areas...</div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Grid> */}
            {/* <Grid item xs={12} sm={12} md={5}>
            <InputLabel sx={{ fontWeight: "bold", color: "black" }}>
               Select Location
              </InputLabel>
              <TextField
                fullWidth
                value={getValues("location") || ""}
                defaultValue={selectedDeliveryAddress?.address}
                inputProps={{ readOnly: true }}
               
                onClick={() => {
                  setSelectAddressDialog(false);
                  setAddressFormDialog(true);
                }}
                // onClick={() => setSelectAddressDialog(true)}
                // placeholder="Enter Address"
                variant="outlined"
                {...register("location", {
                  required: "Location is required",
                })}
                helperText={errors.location?.message}
                error={!!errors.location}
              />
              <SelectAddressDialog
                open={selectAddressDialog}
                onClose={(data) => {
                  setSelectAddressDialog(false);
                  setSelectedDeliveryAddress(data);
                  setAddressFormDialog(false);
                }}
                addressLists={addressLists || []}
                addNewAddress={() => {
                  setSelectAddressDialog(false);
                  setAddressFormDialog(true);
                }}
                selectedAddress={selectedDeliveryAddress}
              />
              <AddressForm
                open={addressFormDialog}
                onClose={() => setAddressFormDialog(false)}
                save={(data) => saveAddress(data)}
              />
            </Grid> */}
            {/* Phone number */}
            {/* <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Phone Number
              </InputLabel>
              <FormControl
                sx={{
                  ".form-control": {
                    height: "56px !important",
                    background: "transparent !important",
                  },
                }}
                error={!!errors.phoneNumber}
                fullWidth
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    validate: (value, formValues) => {
                      // Get the selected country code from the PhoneInput value
                      const selectedCountry = value.slice(0, 2) === "52" ? "mx" : "us";
                      return phoneNumberValidation(value, selectedCountry);
                    },
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      country={"us"}
                      onlyCountries={["us", "mx"]}
                      countryCodeEditable={false}

                      value={field.value}
                      onChange={field.onChange}
                      inputStyle={{ width: "100%" }}
                      
                     
                    />
                  )}
                />
                <FormHelperText>
                  {errors.phoneNumber ? errors?.phoneNumber?.message : ""}
                </FormHelperText>
              </FormControl>
            </Grid> */}
            {/* <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Ref No
              </InputLabel>
              <TextField
                fullWidth
                {...register("refno", {
                  required: "Ref No is required",
                  validate: (value) =>
                    value.trim() !== "" || "Ref No is required",
                })}
                error={!!errors.refno}
                helperText={errors?.refno?.message}
              />
            </Grid> */}

            {/* <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Beds
              </InputLabel>
              <TextField
                fullWidth
                {...register("beds", {
                  required: "Beds is required",
                  validate: (value) =>
                    value.trim() !== "" || "Beds is required",
                })}
                error={!!errors.beds}
                helperText={errors?.beds?.message}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Baths
              </InputLabel>
              <TextField
                fullWidth
                {...register("baths", {
                  required: "Baths is required",
                  validate: (value) =>
                    value.trim() !== "" || "Baths is required",
                })}
                error={!!errors.baths}
                helperText={errors?.baths?.message}
              />
            </Grid> */}
            
            <Grid item xs={12} md={5}>
  <InputLabel sx={{ fontWeight: "bold", color: Colors.black, mb: 1 }}>
    Upload Building Images
  </InputLabel>

  <FormControl fullWidth>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        padding: "4px 14px",
        cursor: "pointer",
        backgroundColor: "#fff",
        minHeight: "45px",
        "&:hover": {
          borderColor: "black",
        },
      }}
      component="label"
    >
      <Typography color="textSecondary">
        {images.length > 0
          ? `${images.length} image(s) selected`
          : "Upload Images"}
      </Typography>
      <input
        type="file"
        accept="image/*"
        hidden
        multiple
        onChange={(e) => {
          handleUpload(e);
        }}
      />
    </Box>
  </FormControl>

  {/* 👇 Hidden input to trigger validation */}
  <input
    type="hidden"
    {...register("images", {
      validate: () =>
        images.length > 0 || "At least one image is required",
    })}
  />

  {/* Show error message if any */}
  {errors.images && (
    <Typography variant="caption" color="error" mt={0.5}>
      {errors.images.message}
    </Typography>
  )}

  {/* Preview Selected Images */}
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
    {images.map((imgObj, index) => (
      <Box key={index} sx={{ position: "relative" }}>
        <img
          src={imgObj.url}
          alt={`preview-${index}`}
          style={{
            width: 100,
            height: 100,
            objectFit: "cover",
            borderRadius: 4,
          }}
        />
        <Button
          size="small"
          onClick={() => {
            setImages((prev) => prev.filter((_, i) => i !== index));
          }}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            minWidth: "25px",
            padding: "2px",
            color: "white",
            backgroundColor: "red",
            fontSize: "12px",
            ":hover": {
              backgroundColor: "darkred",
            },
          }}
        >
          ✕
        </Button>
      </Box>
    ))}
  </Box>
</Grid>

<Grid item xs={12} md={5}>
  <InputLabel sx={{ fontWeight: "bold", color: Colors.black, mb: 1 }}>
    Upload Building Brochure
  </InputLabel>

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
      bgcolor: "white",
      flexDirection: "column",
      textAlign: "center",
      height: "20px",
    }}
  >
    {brochureLoading ? (
      <Loader width="30px" height="30px" color={Colors.primary} />
    ) : (
      <>
        <CloudUploadIcon sx={{ fontSize: 28, color: "#999" }} />
        <Typography variant="caption">
          {brochureDocumment ? "Brochure Document Uploaded" : "Upload Brochure Document"}
        </Typography>
      </>
    )}
    <input
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      hidden
      onChange={handleUploadDoc}
    />
  </Box>
  {brochureError && (
  <Typography variant="caption" color="error" mt={0.5}>
    {brochureError}
  </Typography>
)}

  {brochureDocumment && (
    <Box mt={1} display="flex" alignItems="center" gap={1}>
      <PictureAsPdfIcon sx={{ color: Colors.primary ,fontSize:"20px" }} />
      <Typography variant="caption" sx={{ flexGrow: 1 }}>
        Brochure Uploaded
      </Typography>
      <IconButton
        size="small"
        onClick={() => setBrochureDocumment(null)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )}
</Grid>

{/* --- Building Layout --- */}

<Grid item xs={12} md={5}>
  <InputLabel sx={{ fontWeight: "bold", color: Colors.black, mb: 1 }}>
    Upload Building Layout
  </InputLabel>

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
      bgcolor: "white",
      flexDirection: "column",
      textAlign: "center",
      height: "20px",
    }}
  >
    {buildingLayoutLoading ? (
      <Loader width="30px" height="30px" color={Colors.primary} />
    ) : (
      <>
        <CloudUploadIcon sx={{ fontSize: 28, color: "#999" }} />
        <Typography variant="caption">
          {buildingLayout ? "Building Layout Uploaded" : "Upload Building Layout"}
        </Typography>
      </>
    )}
    <input
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      hidden
      onChange={handleUploadDoc2}
    />
  </Box>
  {buildingLayoutError && (
  <Typography variant="caption" color="error" mt={0.5}>
    {buildingLayoutError}
  </Typography>
)}

  {buildingLayout && (
    <Box mt={1} display="flex" alignItems="center" gap={1}>
      <PictureAsPdfIcon sx={{ color: Colors.primary,fontSize:"20px" }} />
      <Typography variant="caption" sx={{ flexGrow: 1 }}>
        Layout Uploaded
      </Typography>
      <IconButton
        size="small"
        onClick={() => setBuildingLayout(null)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )}
</Grid>

          
            {/* <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Payment Terms
              </InputLabel>
              <TextField
                fullWidth
                select
                {...register("paymentTerms", {
                  required:
                    paymentTerms == "" ? "Payment Terms is required" : false,
                  onChange: (e) => {
                    setValue("paymentTerms", e.target.value);
                    setPaymentTerms(e.target.value);
                  },
                })}
                error={errors.paymentTerms && true}
                helperText={errors?.paymentTerms?.message}
                value={paymentTerms}
                // onChange={(e) => setBillingPreference(e.target.value)}
              >
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </TextField>
            </Grid> */}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mx: 1, color: Colors.white }}
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
