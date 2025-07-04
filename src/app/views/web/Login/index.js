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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../../context";
import { useNavigate } from "react-router-dom";
import { Images } from "../../../assets/images";
import Loader from "../../../components/Loader"; 
 import { useLocation } from "react-router-dom";



function AgentLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const { WebUserLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();


  
  // Inside onSubmit:
  const onSubmit = async (data) => {
    setLoader(true);
    const obj = {
      email: data.email,
      password: data.password,
    };
  
    try {
      const response = await AuthServices.agentLogin(obj);
      WebUserLogin(response?.data?.user);
      SuccessToaster(response?.message);
  
      const params = new URLSearchParams(location.search);
      const redirectPath = params.get("redirect") || "/";
  
      // Prevent going back to login page
      navigate(redirectPath, { replace: true });
  
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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f7fafc",
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
        onClick={() => navigate("/")}
        src={Images.logo}
        alt="Talha's Estate"
        sx={{
          width: 170,
          position: "absolute",
          top: 20,
          left: 10,
          cursor: "pointer",
        }}
      />

      <Grid
        container
        sx={{
          width: "100%",
          maxWidth: 900,
          // minHeight: 600,
          p: 2,
          backgroundColor: "#ffffff",

          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Left: Form */}
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            px={{ xs: 3, sm: 4 }}
            py={4}
            sx={{ height: "100%" }}
            justifyContent={"center"}
          >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  color: Colors.primary,
                  fontWeight: 700,
                  fontSize: "24px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                Agent Login
              </Typography>
            </Box>

            {/* Form */}
            <Grid
              container
              spacing={2}
              component="form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Enter a valid email",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  margin="normal"
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

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 1,
                    color: "#fff",
                    backgroundColor: Colors.primary,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    py: 1.25,
                    "&:hover": {
                      backgroundColor: Colors.primary,
                      opacity: 0.9,
                    },
                  }}
                >
                  {loader ? (
                    <Loader width="20px" height="20px" color={Colors.white} />
                  ) : (
                    "Login"
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
                mt: 1,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => {
                navigate("/agent/signup");
              }}
            >
              Don't have an account? Sign up
            </Typography>
          </Box>
        </Grid>

        {/* Right: Image */}
        <Grid
          item
          xs={false}
          md={6}
          sx={{
            backgroundImage: `url(${Images.agentLogin})`, // You can replace this with your custom image
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: { xs: "none", md: "block" },
          }}
        />
      </Grid>
    </Box>
  );
}

export default AgentLogin;
