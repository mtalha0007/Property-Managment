import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Grid,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import React, { useState } from "react";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
  Close as CloseIcon,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from "@mui/icons-material";
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import Logout from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Images } from "../../../assets/images";
import { useAuth } from "../../../context";
import AuthServices from "../../../api/AuthServices/auth.index";
import FileServices from "../../../api/FileServices/file.index";
import { useForm } from "react-hook-form";
import { ErrorToaster, SuccessToaster } from "../../../components/Toaster";
import SimpleDialog from "../../../components/Dialog";
import Colors from "../../../assets/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { WebUserLogin, webUser, webUserLogOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [preview, setPreview] = useState(null);
  const [images, setImages] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    webUserLogOut();
    navigate("/")
    window.location.reload();
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleUpload = async (e) => {
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
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    let obj = {};

    if (isSignup) {
      obj = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        image: images[0],
      };
    } else {
      obj = {
        email: data.email,
        password: data.password,
      };
    }

    try {
      const response = isSignup
        ? await AuthServices.agentSignup(obj)
        : await AuthServices.agentLogin(obj);
      console.log(response);
      if (!isSignup) {
        WebUserLogin(response?.data?.user);
      }
      SuccessToaster(response?.message);
      setOpen(false);
      reset();
      setPreview(null);
    } catch (error) {
      ErrorToaster(error);
    }
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
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
      <List onClick={() => setOpen(true)}>
        <ListItem button>
          <ListItemText primary="Sign Up / Sign In" />
        </ListItem>
      </List>
    </Drawer>
  );
  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="xl" sx={{ padding: "0px !important" }}>
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                //  gap: 1
              }}
            >
              {/* <Box sx={{ display: { xs: "block", md: "none" } }}>
                <IconButton
                  edge="start"
                  onClick={handleMobileMenuToggle}
                  sx={{ color: "#4a5568" }}
                >
                  <MenuIcon />
                </IconButton>
              </Box> */}

              <Box
                onClick={() => navigate("/")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
              >
                <Box
                  component="img"
                  src={Images.logo}
                  alt="Talha's Estate"
                  sx={{
                    width: 110,
                  
                  }}
                />
               
              </Box>
            </Box>

            {webUser?.token ? (
              <>
                <Box
                  sx={{
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                  }}
                  onClick={handleAvatarClick}
                >
                  <Avatar
                    src={webUser?.image || Images.default}
                    alt={webUser?.name || "User"}
                    sx={{ width: 32, height: 32 }}
                  />
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1,
                      minWidth: 180,
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <MenuItem disabled>
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2" color="textSecondary">
                      {webUser?.name || "User"}
                    </Typography>
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={()=>navigate("/my-booking")}>
                    <ListItemIcon>
                      <ImportContactsIcon fontSize="small" />
                    </ListItemIcon>
                    My Bookings
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box
                sx={{
                  alignItems: "center",
                  gap: 1,
                }}
                onClick={() => setOpen(true)}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="text"
                    sx={{
                      color: "#4a5568",
                      textTransform: "none",
                      fontSize: "0.875rem",
                      backgroundColor: Colors.primary,
                      px: 2,
                      borderRadius: 1,
                      color: Colors.white,
                      ":hover": {
                        backgroundColor: Colors.primary,
                        opacity: 0.9,

                      },
                    }}
                    onClick={() => navigate("/agent/signup")}
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      color: "#4a5568",
                      textTransform: "none",
                      fontSize: "0.875rem",
                      backgroundColor: Colors.primary,
                      px: 2,
                      borderRadius: 1,
                      color: Colors.white,
                      ":hover": {
                        backgroundColor: Colors.primary,
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => navigate("/agent/login")}
                  >
                    Sign In
                  </Button>
                </Box>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {mobileMenu}

      
    </>
  );
}
