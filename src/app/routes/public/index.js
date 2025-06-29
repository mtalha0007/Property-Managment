

import Login from "../../views/admin/Login";
import Home from "../../views/web/Home";
import AccountSetting from "../../views/AccountSetting";
const PublicRoutes = [

  {
    path: "/login",
    component: <Login />
  },
  {
    path: "/",
    component: <Home />
  },
 
  {
    path: "/account/setting",
    component: <AccountSetting />
  },
 
  

 
]

export default PublicRoutes;