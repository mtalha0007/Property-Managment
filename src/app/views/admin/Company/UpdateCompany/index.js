import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Avatar,
  IconButton,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Controller, useForm } from "react-hook-form";
import Colors from "../../../../assets/styles";
import FileServices from "../../../../api/FileServices/file.index";
import { ErrorHandler } from "../../../../utils/ErrorHandler";
import { ErrorToaster, SuccessToaster } from "../../../../components/Toaster";
import CompanyServices from "../../../../api/CompanyServices/company.index";
import { useNavigate, useLocation } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { Icons } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const App = () => {
  const { state } = useLocation();
  const [imageURL, setImageURL] = useState("");
  const [oldLogo, setOldLogo] = useState("");
  const [hovered, setHovered] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (state) {
      setValue("companyName", state.name);
      setValue("email", state.email);
      setValue("phone", state.phone);
      setValue("notes", state.notes);
      setOldLogo(state.logo);
    }
  }, [state, setValue]);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    try {
      const formData = new FormData();
      formData.append("document", e.target.files[0]);

      const response = await FileServices.uploadImage(formData);
      console.log(imageURL);
      setImageURL(response?.data?.path);
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error);
      console.log(error?.message);
    }
  };
  const phoneNumberValidation = (value, country) => {
    const usPhonePattern = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{5})$/;
    const mxPhonePattern = /^(\+52)?\d{12}$/;

    if (country === "us") {
      return usPhonePattern.test(value) || "Please enter a valid US phone number";
    } else if (country === "mx") {
      return mxPhonePattern.test(value) || "Please enter a valid Mexican phone number";
    }
    return true;
  };

  const onSubmit = async (formData) => {
    const obj = {
      _id: state?._id,
      logo: imageURL,
      name: formData.companyName,
      phone: formData.phone,
      email: formData.email,
      notes: formData.notes,
    };
    try {
      const data = await CompanyServices.updateCompany(obj);
      console.log(data);
      SuccessToaster(data?.message);
      navigate("/companies");
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error);
      console.log(error?.message);
    }
    console.log(obj);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "10px",
          alignItems: "center",
          mt: 10,
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
          Companies /
        </Typography>
        <Typography
          sx={{ fontSize: "22px", color: Colors.primary, fontWeight: "600" }}
        >
          Edit Company
        </Typography>
      </Box>
      <Box
        maxWidth="lg"
        sx={{
          mt: 2,
          ml: 2,
          mr: 2,
          padding: "20px",
          backgroundColor: Colors.backgroundColor,
          boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      >
        <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
          Company Details
        </Typography>
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100px"
                marginTop="20px"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
               <Typography sx={{fontWeight:"bold"}}>Your Logo</Typography>
                <Box
                  sx={{
                    position: "relative",
                    width: 90,
                    height: 90,
                    margin: "0 auto",
                    mt: 2,
                  }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Box
                    component="img"
                    src={imageURL ? baseUrl + imageURL : baseUrl + oldLogo}
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      cursor: "pointer",
                      objectFit: "cover",
                      border: "1px solid grey",
                      background: !oldLogo && !imageURL ? Colors.primary : "",
                    }}
                    onClick={(e) => {
                      handleImageClick(e);
                    }}
                  />

                  {(hovered || !oldLogo) && (hovered || !imageURL) && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        background: imageURL || oldLogo ? "" : Colors.primary,
                        padding: "32px 35px",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        borderRadius: "50%",
                        display: "block",
                        "&:hover": {
                          background: imageURL || oldLogo ? "" : Colors.primary,
                        },
                      }}
                      onClick={(e) => {
                        handleImageClick(e);
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Company Name
              </InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                sx={{ mt: 0.5 }}
                margin="normal"
                {...register("companyName", {
                  required: "Company Name is required",
                })}
                error={errors.companyName && true}
                helperText={errors?.companyName?.message}
                InputProps={{
                  style: { borderColor: "#ff4081" },
                }}
                InputLabelProps={{
                  style: { color: "#ff4081" },
                }}
              />
              <InputLabel
                sx={{ fontWeight: "bold", color: Colors.black, mt: 0.5 }}
              >
                Phone Number
              </InputLabel>
              <FormControl
                        sx={{
                          ".form-control": {
                            height: "56px !important",
                            background: "transparent !important",
                          },
                        }}
                        error={!!errors.phone}
                        fullWidth
                      >
                        <Controller
                          name="phone"
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
                              value={field.value}
                              countryCodeEditable={false}

                              onChange={field.onChange}
                              inputStyle={{ width: "100%" }}
                            />
                          )}
                        />
                        <FormHelperText>
                          {errors.phone ? errors.phone.message : ""}
                        </FormHelperText>
                      </FormControl>
              <InputLabel
                sx={{ fontWeight: "bold", color: Colors.black, mt: 0.5 }}
              >
                Email
              </InputLabel>
              <TextField
                sx={{ mt: 0.5 }}
                fullWidth
                variant="outlined"
                margin="normal"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                error={errors.email && true}
                helperText={errors?.email?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                Additional Notes (optional)
              </InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                multiline
                rows={9.3 }
                // margin="normal"
                {...register("notes")}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                style={{ backgroundColor: "#ff4081", color: "#fff" }}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default App;
