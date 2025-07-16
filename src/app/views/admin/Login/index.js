import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Images, Svgs } from "../../../assets/images";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import useBreadCrumb from "../../../hooks/useBreadCrumb";
import { useForm } from "react-hook-form";
import { ErrorToaster, SuccessToaster } from "../../../components/Toaster";
import { ErrorHandler } from "../../../utils/ErrorHandler";
import AuthServices from "../../../api/AuthServices/auth.index";
import { useAuth } from "../../../context";
import Loader from "../../../components/Loader";
import Colors from "../../../assets/styles";

function App() {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = window.location.origin


  const { setName } = useBreadCrumb();
  const navigate = useNavigate();
  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { userLogin } = useAuth();
  let sleep = () => new Promise((r) => setTimeout(r, 2000));
  const login = async (formData) => {
    const obj = {
      email: formData.email,
      password: formData.password,
    };
    setLoading(true);
    try {
      const  data= await AuthServices.login(obj);
      console.log(data)
      await sleep();
      SuccessToaster(data?.message);
    
      userLogin(data?.data?.user);
      if(data?.data?.user?.role == "admin"){
        navigate("/dashboard");
        setName("/dashboard");
      }else if(data?.data?.user?.role == "investor"){
        navigate("/investor/dashboard");
        setName("/investor/dashboard");
      }
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Grid container alignItems={"center"} >
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // paddingTop: "90px",
          backgroundColor: "#fefefe",
          justifyContent:"center",
          height: { xs: "100vh", md: "auto" },
        }}
      >
        <Box>
          <img
            src={Images.logo}
            alt="Bella Staffing Solutions Logo"
            style={{ width: "300px" }}
          />
        </Box>
        <Typography
          variant="h4"
          sx={{ marginTop: "20px", color: "#333", fontWeight: "bold" }}
        >
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ marginTop: "10px", color: "#666" }}>
          Login into your account
        </Typography>
        <Box
          component="form"
          sx={{
            marginTop: "20px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onSubmit={handleSubmit(login)}
        >
          <TextField
            margin="normal"
            fullWidth
            sx={{
              // background: Colors.white,
              width: "74%",
              // border: "1px solid grey",
              // outline: "none",
              "& fieldset": {
                borderRadius: "0px",
                border: "1px solid grey",
              },
              // "& fieldset": {
              //   border: "none",
              //   borderRadius: "0px",
              // },
              // "&:hover": {
              //   borderRadius: "0px",
              // },
            }}
            placeholder="Email"
            type="email"
            {...register("email", {
              required: "Please enter your Email",
            })}
            error={errors?.email?.message}
            helperText={errors?.email?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            placeholder="Password"
            sx={{
              width: "74%",
              // background: Colors.white,

              "& fieldset": {
                borderRadius: "0px",
                border: "1px solid grey",
              },
            }}
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Please enter your Password",
              validate: (value) =>
                value.trim() !== "" || "Please enter your Password",
            })}
            error={errors?.password?.message}
            helperText={errors?.password?.message}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            }}
          />
        
          <Button
            variant="contained"
            type="submit"
            sx={{
              width: "74%",
              marginTop: "35px",
              backgroundColor:Colors.primary,
              color: Colors.white,
              "&:hover": { backgroundColor: Colors.primary,opacity:0.9 },
            }}
          >
            {loading ? <Loader width={"20px"} height={"20px"} color={Colors.white}  /> : "Login"}
          </Button>
          
          
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        md={7}
        sx={{
          width: "100%",
          height: "100vh",
          display: { xs: "none", md: "flex" },     
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 5px",
        }}
      >
       
          <img
            className="bgImage"
            src={Images.sideImage}
            alt="Illustration"
            style={{  width: "100%" }}
          />

          
      
      </Grid>
      {/* {params.includes("admin") ? (
            <Box sx={{mt:1}}></Box>
          ):(
            <Box sx={{mt:1}}>Dont have an account <span onClick={()=>navigate("/sign-up")} style={{fontWeight:"bold",cursor:"pointer"}}>Sign up</span></Box>
           

          )} */}
    </Grid>
  );
}

export default App;
