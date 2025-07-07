import React, { useState, useEffect } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import Colors from "../../../assets/styles";
import { Link, useNavigate } from "react-router-dom";
import { Person, ExitToApp, ArrowDropDown } from "@mui/icons-material";
import { useAuth } from "../../../context/index";
import MenuIcon from "@mui/icons-material/Menu";

function Header({ status, toggleStatus }) {
  const { userLogout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const navigate = useNavigate();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClickOutside = (event) => {
    if (anchorEl && !anchorEl.contains(event.target)) {
      handleMenuClose();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open, anchorEl]);

  const userData = localStorage.getItem("user");
  const parsedData = JSON.parse(userData);

  return (
    <AppBar sx={{ bgcolor: Colors.white, boxShadow: 0 }}>
      <Toolbar sx={{ bgcolor: Colors.dashboardBgColor }}>
        <Grid container py={2} justifyContent={"space-between"}>
          <Grid
            item
            xs={12}
            sx={{
              transition: "all .3s ease-in-out",
              ml: {
                md:
                  status === false 
                    ? "270px"
                    : status === false
                    ? "270px"
                    : "",
                xs:
                  status === false 
                    ? "70px"
                    : status === false
                    ? "270px"
                    : "",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                backgroundColor: Colors.backgroundColor,
                borderRadius: "10px",
                p: 1,
                mx: "10px",
                boxShadow: "5px 5px 10px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box
                role="presentation"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Box>
                  <IconButton onClick={toggleStatus}>
                    {status === true ? <MenuIcon /> : <MenuIcon />}
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  mr: 2,
                  cursor: "pointer",
                }}
                onClick={handleMenuOpen}
              >
                <Avatar src={user?.picture ? baseUrl + user?.picture : ""} />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ color: "black", fontWeight: "bold" }}>
                    {user?.name}
                  </Box>
                  <Box sx={{ color: "black" }}>{user?.role}</Box>
                </Box>
                <IconButton>
                  <ArrowDropDown />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{
                    "& .MuiMenu-paper": {
                      minWidth: "250px",
                      borderRadius: "10px",
                      backgroundColor: Colors.backgroundColor,
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/account/setting");
                      handleMenuClose()
                    }}
                  >
                    <Person sx={{ mr: 1 }} />
                    <Box
                      // onClick={() => navigate("/account/setting")}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Account Setting
                    </Box>
                  </MenuItem>
                  <MenuItem
                    sx={{ my: 1 }}
                    onClick={() => {
                      userLogout();
                      navigate("/login");
                      handleMenuClose();
                    }}
                  >
                    <ExitToApp sx={{ mr: 1 }} /> {/* Icon for Logout */}
                    Sign Out
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
