import Dashboard from "../../views/admin/dashboard";
import Login from "../../views/admin/Login/index";



import CreateProperty from "../../views/admin/Property/CreateProperty/index"
import PropertyList from "../../views/admin/Property/PropertyList/index"
import PropertyDetails from "../../views/admin/Property/PropertyDetails";
import UpdateProperty from "../../views/admin/Property/UpdateProperty";



import AccountSetting from "../../views/AccountSetting";

import AgentListing from "../../views/admin/Agent/index"
import InvestorList from "../../views/admin/Investors/InvestorList";
import InvestorCreate from "../../views/admin/Investors/InvestorCreate";
import EditInvestor from "../../views/admin/Investors/EditInvestor";
import BookingList from "../../views/admin/Booking/BookingList";
import BookingApproved from "../../views/admin/Booking/ApprovedBooking/index";

const AdminRoutes = [
  {
    path: "/login",
    component: <Login />
  },
  {
    path: "/dashboard",
    component: <Dashboard />
  },
 
  
  
 
  {
    path: "/properties",
    component: <PropertyList />
  },
  {
    path: "/properties/create",
    component: <CreateProperty />
  },
  {
    path: "/properties/update/:id",
    component: <UpdateProperty/>
  },
  {
    path: "/properties/details/:id",
    component: <PropertyDetails/>
  },
 
 
  {
    path: "/account/setting",
    component: <AccountSetting />
  },
 {

  path: "/agent/list",
  component: <AgentListing />
 },
 {

  path: "/investor/list",
  component: <InvestorList />
 },
 {

  path: "/investor/create",
  component: <InvestorCreate />
 },
 {

  path: "/investor/update/:id",
  component: <EditInvestor />
 },
 {

  path: "/booking/list",
  component: <BookingList />
 },
 {

  path: "/approved/list",
  component: <BookingApproved />
 },
  
];

export default AdminRoutes;