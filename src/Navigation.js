import  {Svgs} from "./app/assets/images/index";
import BadgeIcon from "@mui/icons-material/Badge";
import AssessmentIcon from '@mui/icons-material/Assessment';

const AdminNavigation = [
  {
    name: "Dashboard",
    icon: Svgs.dashboard,
    path:"/dashboard"
   
  },
  // {
  //   name: "Employees",
  //   icon: Svgs.employees,
  //   path:"/employees",    
  // },
  // {
  //   name: "Employees Request",
  //   icon: Svgs.employees,
  //   path:"/employee/request",    
  // },
  // {
  //   name: "Companies",
  //   icon: Svgs.company,
  //   path:"/companies",    
  // },
  {
    name: "Properties",
    icon: Svgs.property,
    path:"/properties",    
  },
  {
    name: "Agents",
    icon: Svgs.employees,
    path:"/agent/list",    
  },
  {
    name: "Investors",
    icon: Svgs.employees,
    path:"/investor/list",    
  },
  {
    name: "Booking",
    icon: Svgs.jobRequest ,
    path:"/booking/list",    
  },
  {
    name: "Booking Approved",
    icon: Svgs.jobRequest ,
    path:"/approved/list",    
  },
  // {
  //   name: "Job Request",
  //   icon: Svgs.jobRequest,
  //   path:"/jobrequest",    
  // },
  // {
  //   name: "Job Applicants",
  //   icon: Svgs.jobRequest,
  //   path:"/job-applicant",    
  // },
  // {
  //   name: "Jobs",
  //   icon: Svgs.jobRequest,
  //   path:"/jobs",    
  // },
  // {
  //   name: "Jobs Report",
  //   icon: Svgs.jobRequest,
  //   path:"/job/report",    
  // },
  // {
  //   name: "Application",
  //   icon: <Equalizer />,
  //   subMenu: [
  //     {
  //       name: "Kanban",
  //       icon: <Circle />,
  //       path: "/kanban"
  //     },
  //     {
  //       name: "Wizard",
  //       icon: <Circle />,
  //       path: "/wizard"
  //     },
  //     {
  //       name: "Calendar",
  //       icon: <Circle />,
  //       path: "/calendar"
  //     },
  //   ]
  // },
  // {
  //   name: "Ecommerce",
  //   icon: <ShoppingCart />,
  //   subMenu: [
  //     {
  //       name: "Products",
  //       icon: <Circle />,
  //       path: "/products"
  //     },
  //     {
  //       name: "Others",
  //       icon: <Circle />,
  //       path: "/others"
  //     },
  //   ]
  // },
  // {
  //   name: "Authentication",
  //   icon: <Person />,
  //   subMenu: [
  //     {
  //       name: "Sign In",
  //       icon: <Circle />,
  //       path: "/signin"
  //     },
  //     {
  //       name: "Sign Up",
  //       icon: <Circle />,
  //       path: "/signup"
  //     },
  //   ]
  // },
];
const PublicNavigation = [
  {
    name: "Home",
    icon: Svgs.dashboard,
    path:"/investor/dashboard"
   
  },
  {
    name: "Properties",
    icon: Svgs.property,
    path:"/investor/properties"
   
  },

  
 
];

export  {AdminNavigation,PublicNavigation};