"use client"

import { useEffect, useState } from "react"
import { Box, Grid, Typography, Card, CardContent, Paper, CircularProgress, Chip } from "@mui/material"
import { TrendingUp, TrendingDown, People, Business, Event, CheckCircle } from "@mui/icons-material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts"
import AuthServices from "../../../api/AuthServices/auth.index"



const ErrorHandler = (error) => {
  console.error("Error:", error)
}

const Colors = {
  primary: "#2563eb", 
  secondary: "#7c3aed", 
  success: "#059669", 
  warning: "#d97706", 
  error: "#dc2626", 
  info: "#0891b2", 
  backgroundColor: "#ffffff",
  black: "#1f2937", 
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  chartColors: [
    "#3b82f6", 
    "#10b981", 
    "#f59e0b", 
    "#8b5cf6", 
    "#ef4444", 
    "#06b6d4", 
    "#84cc16", 
    "#f97316", 
  ],
}

function Dashboard() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  const getStatsData = async () => {
    try {
      setLoading(true)
      const response = await AuthServices.stats()
      setData(response)
    } catch (error) {
      ErrorHandler(error)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("sdasdasd")
    getStatsData()  
  }, [])

  const cardData = [
    {
      title: "Total Agents",
      value: data?.totalAgents || 0,
      icon: <People sx={{ fontSize: 40, color: Colors.primary }} />,
      trend: data?.employees?.growth >= 0 ? <TrendingUp /> : <TrendingDown />,
      trendPercent: data?.employees?.growth || 0,
      
      
    },
    {
      title: "Total Buildings",
      value: data?.totalProperties || 0,
      icon: <Business sx={{ fontSize: 40, color: Colors.success }} />,
      trend: data?.jobs?.growth >= 0 ? <TrendingUp /> : <TrendingDown />,
      trendPercent: data?.jobs?.growth || 0,
      
      
    },
    {
      title: "Total Bookings",
      value: data?.totalBookings || 0,
      icon: <Event sx={{ fontSize: 40, color: Colors.warning }} />,
      trend: data?.companies?.growth >= 0 ? <TrendingUp /> : <TrendingDown />,
      trendPercent: data?.companies?.growth || 0,
     
      
    },
    {
      title: "Approved Bookings",
      value: data?.totalApprovedBookings || 0,
      icon: <CheckCircle sx={{ fontSize: 40, color: Colors.secondary }} />,
      trend: data?.jobsPending?.growth >= 0 ? <TrendingUp /> : <TrendingDown />,
      trendPercent: data?.jobsPending?.growth || 0,
      
    
    },
  ]

  // Chart data
  const barChartData = [
    { name: "Agents", value: data?.totalAgents || 0, fill: Colors.chartColors[0] },
    { name: "Properties", value: data?.totalProperties || 0, fill: Colors.chartColors[1] },
    { name: "Bookings", value: data?.totalBookings || 0, fill: Colors.chartColors[2] },
    { name: "Approved", value: data?.totalApprovedBookings || 0, fill: Colors.chartColors[3] },
  ]

  const pieChartData = [
    {
      name: "Approved Bookings",
      value: data?.totalApprovedBookings || 0,
      fill: Colors.chartColors[1],
    },
    {
      name: "Pending Bookings",
      value: (data?.totalBookings || 0) ,
      fill: Colors.warning,
    },
  ]

  const monthlyData = [
    { month: "Jan", properties: 8, bookings: 12, approved: 10 },
    { month: "Feb", properties: 9, bookings: 15, approved: 12 },
    { month: "Mar", properties: 10, bookings: 18, approved: 15 },
    { month: "Apr", properties: 12, bookings: 22, approved: 18 },
    { month: "May", properties: 15, bookings: 25, approved: 20 },
    { month: "Jun", properties: 18, bookings: 28, approved: 25 },
  ]

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box sx={{ px: 3 ,mt:9}}>
      {/* Stats Cards */}
      <Grid container spacing={3} >
        {cardData.map((item, index) => {
          const isPositive = item.trendPercent >= 0

          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  // background: item.bgColor,
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  borderRadius: 3,
                  border: `1px solid ${Colors.gray[200]}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: Colors.black }}>
                      {item.title}
                    </Typography>
                    {item.icon}
                  </Box>

                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                    {item.value}
                  </Typography>

                  
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ my: 0.8 }}>
        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: `1px solid ${Colors.gray[200]}`,
              backgroundColor: Colors.backgroundColor,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Overview Statistics
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Current statistics across all categories
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: `1px solid ${Colors.gray[200]}`,
              backgroundColor: Colors.backgroundColor,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Booking Status
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Distribution of approved vs pending bookings
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
{/*  */}

    
    </Box>
  )
}

export default Dashboard
