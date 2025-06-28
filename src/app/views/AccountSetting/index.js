import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import UploadIcon from "@mui/icons-material/Upload";
import { jwtDecode } from "jwt-decode";

//   import routes from "services/System/routes";

import { ErrorToaster, SuccessToaster } from "../../components/Toaster";

import { useAuth } from "../../context";
import AuthServices from "../../api/AuthServices/auth.index";
import Colors from "../../assets/styles";
import instance from "../../../axios";
import { ErrorHandler } from "../../utils/ErrorHandler";
import FileServices from "../../api/FileServices/file.index";
import EmployeeServices from "../../api/EmployeeServices/employee.index";

export default function AccountSetting() {
  const [hovered, setHovered] = useState(false);
  const [userDetail, setUserDetail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [data, setData] = useState({});
  const [imageURL, setImageURL] = useState("");

  const { user, updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    setValue,
    trigger,
    getValues
  } = useForm();

  const decodedToken = jwtDecode(user.token);
  const userIdFromToken = decodedToken.employee_id;

  const oldPassword = watch("old_password");
  const newPassword = watch("new_password");
  const confirm_password = watch("confirm_password");

  const baseUrl = process.env.REACT_APP_BASE_URL;

  // useEffect(() => {
  //   if (newPassword && newPassword === oldPassword) {
  //     setError("new_password", {
  //       type: "manual",
  //       message: "Old Password and New Password cannot be the same",
  //     });
  //   } else {
  //     clearErrors("new_password");
  //   }

  //   if (confirm_password && newPassword !== confirm_password) {
  //     setError("confirm_password", {
  //       type: "manual",
  //       message: "New Password and Confirm Password must be the same",
  //     });
  //   } else {
  //     clearErrors("confirm_password");
  //   }
  // }, [newPassword, oldPassword, confirm_password, setError, clearErrors,]);

  const submitForm = async (formData) => {
    try {
      let obj = {
        oldPassword: formData.old_password,
        newPassword: formData.new_password,
      };
      console.log("Form submitted", obj);
      if (newPassword && newPassword === oldPassword || confirm_password && newPassword !== confirm_password) {
        return
      }else{
        
      let result;
      result = await AuthServices.changePassword(obj);

      SuccessToaster(result?.message);
      setValue("old_password", "");
      setValue("new_password", "");
      setValue("confirm_password", "");
      }
    } catch (error) {
      ErrorToaster(error);
    } finally {
    }
  

  };
  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    try {
      const formData = new FormData();
      formData.append("document", e.target.files[0]);
      const response = await FileServices.uploadImage(formData);
      console.log(response);
      setImageURL(response?.data?.path);
      updateProfile(response?.data?.path);
      updateEmployee(response?.data?.path);
      console.log(response?.data?.path);
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error?.message || "Failed to upload image");
    }
  };

  const getEmployeesDetails = async () => {
    try {
      const { data } = await EmployeeServices.getEmployeeDetails(
        userIdFromToken
      );
      setData(data.details[0]);
      updateProfile(data.details[0]?.picture);
    } catch (error) {
      ErrorHandler(error);
      console.log(error?.message);
    }
  };
  useEffect(() => {
    getEmployeesDetails();
  }, []);
  const updateEmployee = async (pic) => {
    const obj = {
      _id: data?._id,
      first_name: data?.first_name,
      last_name: data?.last_name,
      picture: pic ? pic : data?.picture,
      phone: data?.user_info?.phone,
      emergency_num: data?.emergency_num ? data?.emergency_num : "",
      email: data?.user_info?.email,
      age: data?.age,
      experience: data?.experience,
      desired_position: data?.desired_position,
      skill_type: data?.skill_type,
      skills: data?.skills,
      area_town: data?.area_town,
      job_type: data?.job_type,
      // property_types: form3.propertyType,
      property_types: [],

      temporary_work: {
        hours_from: data?.temporary_work?.hours_from,
        hours_to: data?.temporary_work?.hours_to,
        same_day_assignment: data?.temporary_work?.same_day_assignment,
        after_hours: data?.temporary_work?.after_hours,
        work_weekends: data?.temporary_work?.work_weekends,
        salary: "",
      },
      direct_hire: {
        desired_salary: data?.direct_hire?.desired_salary,
        after_hours: data?.direct_hire?.after_hours,
        work_weekends: data?.direct_hire?.work_weekends,
        insurance_mandatory: data?.direct_hire?.insurance_mandatory,
      },
      transportation: data?.transportation,
      travel: data?.travel,
      new_branfels: data?.new_branfels,
      boerne: data?.boerne,
      // minimum_salary: data.directHire.minSalary,
      live_on_site: data?.live_on_site,
      relocate: data?.relocate,
      codes: data?.codes,
      documents: data?.documents,
      language: data?.language,
      driving_license: data?.driving_license,
      restrictions: data?.restrictions,
      recreational_drugs: data?.recreational_drugs,
      additional_notes: data?.notes ? data?.notes : "",
    };
    console.log(obj);
    try {
      const { response, message } = await EmployeeServices.UpdateEmployee(obj);
      console.log(response);
      SuccessToaster(message);
      getEmployeesDetails();
    } catch (error) {
      ErrorHandler(error?.message);
      ErrorToaster("error occured");
      console.error("Error uploading image: ", error?.message);
    }
  };
  return (
    <>
      <Box sx={{ mt: 5, ml: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "600", fontSize: "20px", color: Colors.primary }}
        >
          Account Setting
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Grid container justifyContent={"space-between"}>
          <Grid item md={4} xs={12} sx={{ padding: { md: "12px", xs: "6px" } }}>
            <Box
              sx={{
                background: Colors.backgroundColor,
                borderRadius: "10px",
                padding: "38px 15px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem",
              }}
            >
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
                    src={imageURL ?baseUrl + imageURL : baseUrl + data?.picture}
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      cursor: "pointer",
                      objectFit: "cover",
                      border: "1px solid grey",
                    }}
                    onClick={(e) => {
                      handleImageClick(e);
                    }}
                  />
                  {hovered && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        padding: "5px 15px",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "50%",
                        display: "block",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                        },
                      }}
                      onClick={(e) => {
                        handleImageClick(e);
                      }}
                    >
                      <UploadIcon />
                      <Box sx={{ fontSize: "12px" }}>Upload Image</Box>
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

              <Box
                sx={{
                  mt: "19px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Box component={"span"} sx={{ fontWeight: "600" }}>
                  Name:{" "}
                </Box>
                <Box component={"span"} sx={{ fontWeight: "400" }}>
                  {user?.name}
                </Box>
              </Box>
              <Box
                sx={{
                  mt: "19px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Box component={"span"} sx={{ fontWeight: "600" }}>
                  Email:{" "}
                </Box>
                <Box component={"span"} sx={{ fontWeight: "400" }}>
                  {user?.email}
                </Box>
              </Box>
              <Box
                sx={{
                  mt: "19px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Box component={"span"} sx={{ fontWeight: "600" }}>
                  Phone :{" "}
                </Box>
                <Box component={"span"} sx={{ fontWeight: "400" }}>
                  {"+" + user?.phone}
                </Box>
              </Box>
              <Box
                sx={{
                  mt: "19px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Box component={"span"} sx={{ fontWeight: "600" }}>
                  Role :{" "}
                </Box>
                <Box component={"span"} sx={{ fontWeight: "400" }}>
                  {user?.role}
                </Box>
              </Box>
              <Box
                sx={{
                  mt: 3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              ></Box>
            </Box>
          </Grid>

          <Grid item md={8} xs={12} sx={{ padding: { md: "12px", xs: "6px" } }}>
            <Box
              sx={{
                background: Colors.backgroundColor,
                borderRadius: "10px",
                padding: "38px 15px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "600", color: Colors.primary }}
              >
                Change Password
              </Typography>
              <form onSubmit={handleSubmit(submitForm)}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item md={6} sx={{ width: "100%" }}>
                    <Box sx={{ fontWeight: "500", fontSize: "14px", mb: 1 }}>
                      Old Password
                    </Box>
                    <TextField
                      type={showPassword ? "text" : "password"}
                      {...register("old_password", {
                        required: "Please enter old password",
                      })}
                      error={Boolean(errors.old_password)}
                      InputProps={{
                        style: { padding: "5px" },
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        ),
                      }}
                      helperText={errors.old_password?.message}
                      fullWidth
                      size={"small"}
                      placeholder={"Old Password"}
                    />
                  </Grid>
                  <Grid item md={6} sx={{ width: "100%" }}>
                    <Box sx={{ fontWeight: "500", fontSize: "14px", mb: 1 }}>
                      New Password
                    </Box>
                    <TextField
                      type={showPassword1 ? "text" : "password"}
                      // {...register("new_password", {
                      //   required: "Please enter new password",
                      // })}
                      {...register("new_password", {
                        required: "New Password is requires",
                        validate: (value) => {
                          const oldPassword = getValues("old_password");
                          return value != oldPassword || "New passsword cannot be same as old password";
                        },
                        onChange: () => {
                          trigger("password"); // Re-validate confirm password field on change
                        }
                      })}
                      error={Boolean(errors.new_password)}
                      InputProps={{
                        style: { padding: "5px" },
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword1(!showPassword1)}
                          >
                            {showPassword1 ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        ),
                      }}
                      helperText={errors.new_password?.message}
                      fullWidth
                      size={"small"}
                      placeholder={"New Password"}
                    />
                  </Grid>
                  <Grid item md={6} sx={{ width: "100%" }}>
                    <Box sx={{ fontWeight: "500", fontSize: "14px", mb: 1 }}>
                      Confirm Password
                    </Box>
                    <TextField
                      type={showPassword2 ? "text" : "password"}
                      // {...register("confirm_password", {
                      //   required: "Please enter Confirm password",
                      //   validate: (value) =>
                      //     value === newPassword ||
                      //     "New Password and Confirm Password must be the same",
                      // })}
                      {...register("confirm_password", {
                        required: "Confirm Password is required",
                        validate: (value) => {
                          const password = getValues("new_password");
                          return value === password || "Passwords do not match";
                        },
                        onChange: () => {
                          trigger("cnfpassword"); // Re-validate confirm password field on change
                        }
                      })}
                      error={Boolean(errors.confirm_password)}
                      InputProps={{
                        style: { padding: "5px" },
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword2(!showPassword2)}
                          >
                            {showPassword2 ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        ),
                      }}
                      helperText={errors.confirm_password?.message}
                      fullWidth
                      size={"small"}
                      placeholder={"Confirm Password"}
                    />
                  </Grid>

                  <Grid item md={12}>
                    <Button
                      type="submit"
                      sx={{
                        fontWeight: "500",
                        textAlign: "center",
                        borderRadius: "5px",
                        padding: "6px 30px",
                        cursor: "pointer",
                        fontSize: "14px",
                        mb: 1,
                        background: Colors.primary,
                        color: Colors.white,
                        "&:hover": {
                          background: Colors.primary,
                        },
                      }}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
