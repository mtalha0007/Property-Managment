import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorToaster, SuccessToaster } from "../../../components/Toaster";
import AuthServices from "../../../api/AuthServices/auth.index";
import Colors from "../../../assets/styles";
import {
  Visibility,
  VisibilityOff,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../context";
import { useNavigate } from "react-router-dom";
import { Images } from "../../../assets/images";
import FileServices from "../../../api/FileServices/file.index";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Loader from "../../../components/Loader";

function AgentSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [preview, setPreview] = useState(null);
  const [images, setImages] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [document, setDocument] = useState(null);

  const { WebUserLogin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleUpload = async (e) => {
    setImgLoading(true);
    const formData = new FormData();
    const selectedFiles = Array.from(e.target.files);

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await FileServices.uploadImage(formData);
      console.log(response);
      setImages(response?.urls[0]);
      setPreview(response?.urls[0]);
      SuccessToaster(response?.message);
    } catch (error) {
      ErrorToaster(error);
    } finally {
      setImgLoading(false);
    }
  };
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
      setDocPreview(response?.url);
      SuccessToaster(response?.message);
    } catch (error) {
      ErrorToaster(error);
    } finally {
      setDocLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoader(true);
    const obj = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,
      image: images,
      rera_id: data.rearaid,
      rera_doc: document,
    };
    console.log(obj);
    try {
      const response = await AuthServices.agentSignup(obj);
      console.log(response);

      // WebUserLogin(response?.data?.user);

      SuccessToaster(response?.message);
      navigate("/agent/login");
      reset();
    } catch (error) {
      ErrorToaster(error);
    } finally {
      setLoader(false);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f7fafc",
        minHeight: "100vh",
        px: 2,
        backgroundImage: `url(${Images.bgLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <Box
        component="img"
        src={Images.logo}
        onClick={() => navigate("/")}
        alt="Talha's Estate"
        sx={{
          width: 300,
          position: "absolute",
          top: 6,
          left: 10,
          cursor:"pointer",
        }}
      />
      <Grid
        container
        sx={{
          width: "100%",
          maxWidth: 800,
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          overflow:"auto",
          p: { xs: 2, sm: 4 },
          height:{lg:"auto",md:'auto',sm:'500px',xs:'500px'}
        }}
      >
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="center">
            {/* Header */}
            <Typography
              variant="h6"
              sx={{
                color: Colors.primary,
                fontWeight: 700,
                fontSize: "22px",
                mb: 2,
              }}
            >
              Agent Sign Up
            </Typography>

            {/* Form Start */}
            <Grid
              container
              spacing={2}
              component="form"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Profile Pic + RERA Upload Side by Side */}
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
                        <Loader
                          width="30px"
                          height="30px"
                          color={Colors.primary}
                        />
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
                          e.stopPropagation();
                          setPreview(null);
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
                        {document
                          ? `RERA Documnet Uploaded`
                          : "Upload RERA Document"}
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
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    backgroundColor: Colors.primary,
                    fontWeight: 600,
                    py: 1,
                    fontSize: "15px",
                    textTransform: "none",
                    color: Colors.white,
                    "&:hover": {
                      backgroundColor: Colors.primary,
                      opacity: 0.9,
                    },
                  }}
                >
                  {loader ? (
                    <Loader width="20px" height="20px" color={Colors.white} />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Grid>
            </Grid>

            {/* Toggle Link */}
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                color: Colors.primary,
                mt: 1.5,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/agent/login")}
            >
              Already have an account? Login
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AgentSignup;
