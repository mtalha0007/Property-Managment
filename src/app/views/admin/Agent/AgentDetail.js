"use client"

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Container,
  IconButton,Link
} from "@mui/material"
import { useEffect, useState } from "react"

import {  useParams } from "react-router-dom"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import DriveEtaIcon from "@mui/icons-material/DriveEta"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import AuthServices from "../../../api/AuthServices/auth.index"
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DescriptionIcon from "@mui/icons-material/Description";

export default function DriverDetail() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  const getData = async () => {
    
    try {
      setLoading(true)
      const response = await AuthServices.getAgentDetail(id)
      setData(response?.data?.agent)
    } catch (error) {
      console.error("Error fetching driver:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

//   const getStatusColor = (role) => {
//     switch (role?.toLowerCase()) {
//       case "driver":
//         return "primary"
//       case "admin":
//         return "secondary"
//       default:
//         return "default"
//     }
//   }

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}
      >
        <CircularProgress />
      </Container>
    )
  }

  if (!data) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" color="error" textAlign="center">
          Driver not found
        </Typography>
      </Container>
    )
  }

  return (
    <Box sx={{mt:10,px:2}}>
      {/* Header Section */}
      <Card sx={{ mb: 3 ,borderRadius:"12px"}}>
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <Avatar
          src={data?.image}
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              
              fontSize: "2rem",
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {data.name}
          </Typography>
          
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" ,borderRadius:"12px"}}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
              
                sx={{ display: "flex", alignItems: "center", mb: 2 ,color:'#03091A'}}
              >
                <PersonIcon sx={{ mr: 1 }} />
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {data.name}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {data.phone}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {data.address}
                </Typography>
              </Box>

            </CardContent>
          </Card>
        </Grid>

        {/* Professional Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%",borderRadius:"12px" }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
               
                sx={{ display: "flex", alignItems: "center", mb: 2 ,color:"#03091A"}}
              >
                <AppRegistrationIcon sx={{ mr: 1 }} />
                Professional Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Chip
                  label={data.role?.toUpperCase()}
                //   color={getStatusColor(data.role)}
                  size="small"
                  sx={{ mt: 0.5 ,background:"#03091A",color:"white" }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                 Rera Id
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {data.rera_id || "Not provided"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                
              <Box>
      <Typography variant="body2" color="text.secondary">
        Rera Document
      </Typography>

      {data?.rera_doc ? (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1" fontWeight="medium">
            Document Available
          </Typography>
          <IconButton
            component={Link}
            href={data.rera_doc}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DescriptionIcon color="primary" />
          </IconButton>
        </Box>
      ) : (
        <Typography variant="body1" fontWeight="medium">
          No Document Provided
        </Typography>
      )}
    </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        {/* <Grid item xs={12}>
          <Card sx={{borderRadius:"12px"}}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <AccessTimeIcon sx={{ mr: 1 }} />
                System Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Account Created
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(data.createdAt)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(data.updatedAt)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Driver ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" sx={{ fontFamily: "monospace" }}>
                      {data._id}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
    </Box>
  )
}
