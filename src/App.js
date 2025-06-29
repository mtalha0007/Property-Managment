import { Fragment } from "react";
import Colors from "./app/assets/styles";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./app/layout/dashboard";
import AdminRoutes from "./app/routes/admin";
import PublicRoutes from "./app/routes/public";
import "@fontsource/noto-sans";
import Login from "./app/views/admin/Login/index";
import useAuth from "./app/hooks/useAuth";
import { ToasterContainer } from "./app/components/Toaster";
import "./App.css"
import Home from "./app/views/web/Home";
import PropertyList from "./app/views/web/Property/PropertyList";
import PropertyDetail from "./app/views/web/Property/PropertyDetail";
import AgentLogin from "./app/views/web/Login";
import AgentSignup from "./app/views/web/Signup";


const theme = createTheme({
  
  typography: {
    fontFamily: "Noto Sans, sans-serif",
    h1: {
      fontSize: "72px",
    },
    h2: {
      fontSize: "60px",
    },
    h3: {
      fontSize: "48px",
    },
    h4: {
      fontSize: "36px",
    },
    h5: {
      fontSize: "24px",
    },
    h6: {
      fontSize: "18px",
    },
    subtitle1: {
      fontSize: "16px",
    },
    subtitle2: {
      fontSize: "14px",
      fontWeight: 400,
    },
    caption: {
      fontSize: "12px",
    },
  },
  palette: {
    primary: {
      main: Colors.primary
    }
  }
})

function App() {
  const { user ,webUser } = useAuth();
  console.log(user ,"admin")
  console.log(webUser ,"webUser")
  return (
    <Fragment>
      <ThemeProvider theme={theme}>
      <ToasterContainer/>
        <BrowserRouter>
          <Routes>
         
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/agent/login" element={<AgentLogin />} />
            <Route path="/agent/signup" element={<AgentSignup />} />
          
            {webUser?.token && (
              <>
            <Route path="/property-list" element={<PropertyList />} />
            <Route path="/property-detail/:id" element={<PropertyDetail />} />
              </>
            )}

           
           {user?.role == "admin" ? (
            <>
            <Route element={user ? <DashboardLayout /> : <Navigate to={"/admin"} />}>
              {AdminRoutes.map((item, i) => (
                <Route key={i} path={item.path} element={item.component} />
              ))}
            </Route>
            </>
           ):(
            <>
            <Route element={webUser ? <DashboardLayout /> : <Navigate to={"/"} />}>
              {PublicRoutes.map((item, i) => (
                <Route key={i} path={item.path} element={item.component} />
              ))}
            </Route>
            </>
           )}

          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Fragment >
  );
}

export default App;
