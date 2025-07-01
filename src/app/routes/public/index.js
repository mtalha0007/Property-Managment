

import Login from "../../views/admin/Login";
import Home from "../../views/web/Home";
import AccountSetting from "../../views/AccountSetting";
import InvestorDashboard from "../../views/Investors/InvestorDashboard";
import InvestorProperties from "../../views/Investors/InvestorProperty";
import PropertyDetails from "../../views/admin/Property/PropertyDetails";
const PublicRoutes = [

  {
    path: "/login",
    component: <Login />
  },
  {
    path: "/investor/dashboard",
    component: <InvestorDashboard />
  },
  {
    path: "/investor/properties",
    component: <InvestorProperties />
  },
 
  {
    path: "/account/setting",
    component: <AccountSetting />
  },
  {
    path: "/properties/details/:id",
    component: <PropertyDetails/>
  },
  

 
]

export default PublicRoutes;