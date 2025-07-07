import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CardMedia,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import styled from "@emotion/styled";
import { Images, Svgs } from "../../../assets/images/index";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminNavigation, PublicNavigation } from "../../../../Navigation";

import { useAuth } from "../../../context/index";
import useBreadCrumb from "../../../hooks/useBreadCrumb";
import Colors from "../../../assets/styles";

const drawerWidth = 270;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  ...theme.mixins.toolbar,
}));

export default function SideNav({ status, toggleStatus ,setStatus}) {
  const { userLogout, user } = useAuth();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const location = useLocation();
  const { setName } = useBreadCrumb();

  const [expand, setExpand] = useState({});

  useEffect(() => {
    setName(location.pathname);
  }, [location.pathname, setName]);

  const handleToggleSubMenu = (name) => {
    setExpand((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };
  // useEffect(()=>{
  //   if(matchesXs){
  //     drawerWidth=0
  //     setStatus(true)
  //   }
  // },[status])
  return (
    <Box sx={{ display: "flex" }} className="rrfneivne"> 
      <Drawer
        sx={{
          transition: "all .3s ease-in-out",
          width: {
            xs:
              status === false 
                ? drawerWidth
                : status === false
                ? "60px"
                : 0,
            md: status === false ? drawerWidth : 0,
          },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            transition: "all .3s ease-in-out",
            width: {
              xs:
                status === false 
                  ? "70px"
                  : status === false 
                  ? drawerWidth
                  : "",
              md:
                status === false 
                  ? "270px"
                  : status === false 
                  ? drawerWidth
                  : "",
              // md: status === false  && user.role == "employee"  ? drawerWidth : 0,
            },
            boxSizing: "border-box",
            background: Colors.backgroundColor,
            borderRight: "1px solid rgb(193 192 192 / 13%)",
            margin: "16px 11px",
            borderRadius: "10px",
            height: "96vh",
            boxShadow: " 5px 5px 10px 0 rgba(0, 0, 0, 0.1)",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <DrawerHeader>
          <CardMedia
            component="img"
            src={matches  ? Images.logo : Images.logo}
            sx={{
              width: matches   ? "60px" : "120px",
              objectFit: "contain",
            }}
          />
        </DrawerHeader>

        <List
          sx={{
            pr: { md: "19px", xs: 0 },
            pl: { md: "50px", xs: 0 },
            py: 2,
            ml: { md: 0, xs: "0px" },
            overflowY:'auto'
          }}
        >
          {user?.role == "admin" ? (
            <>
              {AdminNavigation.map((item, index) => {
                const isSelected = location.pathname.includes(item.path);

                return (
                  <Fragment key={index}>
                    <ListItem sx={{ p: 0, pb: 2 }}>
                      <ListItemButton
                        onClick={() => {
                          navigate(item.path);
                          handleToggleSubMenu(item.name);
                        }}
                        sx={{
                          p: "12px 16px",
                          gap: "22px",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: "32px",
                            boxShadow: "5px 5px 10px 0 rgba(0, 0, 0, 0.1)",
                            backgroundColor: isSelected
                              ? Colors.primary
                              : Colors.dashboardBgColor,
                           
                            borderRadius: "3px",
                            padding: "7px 2px",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item?.icon?.replace(
                                /fill="#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})"/g,
                                `fill="${
                                  isSelected ? Colors.white : Colors.black
                                }"`
                              ),
                            }}
                          />
                        </ListItemIcon>

                        <>
                          <ListItemText
                            primary={item.name}
                            sx={{
                              color: isSelected ? Colors.black : Colors.black,
                              display: { md: "block", xs: "none"   },
                              span: {
                                fontWeight: isSelected ? 600 : 400,
                                fontSize: "14px !important",
                              },
                            }}
                          />
                        </>
                      </ListItemButton>
                    </ListItem>
                  </Fragment>
                );
              })}
            </>
          ) : (
            <>
              {PublicNavigation.map((item, index) => {
                const isSelected = location.pathname.includes(item.path);

                return (
                  <Fragment key={index}>
                    <ListItem sx={{ p: 0, pb: 2 }}>
                      <ListItemButton
                        onClick={() => {
                          navigate(item.path);
                          handleToggleSubMenu(item.name);
                        }}
                        sx={{
                          p: "12px 16px",
                          gap: "22px",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: "32px",
                            boxShadow: "5px 5px 10px 0 rgba(0, 0, 0, 0.1)",
                            backgroundColor: isSelected
                              ? Colors.primary
                              : Colors.dashboardBgColor,
                            borderRadius: "3px",
                            padding: "7px 2px",
                            display: "flex",
                            justifyContent: "center",
                          
                          }}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item.icon.replace(
                                /fill="#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})"/g,
                                `fill="${
                                  isSelected ? Colors.white : Colors.black
                                }"`
                              ),
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          sx={{
                            color: isSelected ? Colors.black : Colors.black,
                            span: {
                              fontWeight: isSelected ? 600 : 400,
                              fontSize: "14px !important",
                              display: { md: "block", xs: "none" },
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Fragment>
                );
              })}
            </>
          )}
        </List>
        <List
          sx={{
            pr: { md: "19px", xs: 0 },
            pl: { md: "50px", xs: 0 },
            py: 2,
            ml: { md: 0, xs: "0px" },
          }}
        >
          <ListItem sx={{ p: 0, pb: 2 }}>
            <ListItemButton
              onClick={() => {
                userLogout();
                navigate("/login");
              }}
              sx={{
                p: "12px 16px",
                gap: "22px",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "32px",
                  boxShadow: "5px 5px 10px 0 rgba(0, 0, 0, 0.1)",
                  borderRadius: "3px",
                  padding: "7px 2px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: Svgs["signout"] }} />
              </ListItemIcon>
              <ListItemText
                primary={"Sign Out"}
                sx={{
                  span: {
                    fontSize: "14px !important",
                    display: { md: "block", xs: "none"   },
                  },
                }}
              />  
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
