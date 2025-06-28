

import Register from "../../views/web/Register";
import Login from "../../views/admin/Login";
import Home from "../../views/web/Home";
import Job from "../../views/web/Jobs"
import JoDetails from "../../views/admin/Jobs/JobRequest/JobDetail";
import AccountSetting from "../../views/AccountSetting";
import AppliedJobs from "../../views/web/Jobs/appliedJob";
import AssignedJobs from "../../views/web/Jobs/assignedJob";
import EmployeeReport from "../../views/web/Jobs/employeeJobReport";
const PublicRoutes = [
  {
    path: "/sign-up",
    component: <Register />
  },
  {
    path: "/login",
    component: <Login />
  },
  {
    path: "/",
    component: <Home />
  },
  {
    path: "/jobrequest",
    component: <Job />
  },
  {
    path: "/applied-jobs",
    component: <AppliedJobs />
  },
  {
    path: "/jobrequest/details/:id",
    component: <JoDetails />
  },
  {
    path: "/account/setting",
    component: <AccountSetting />
  },
  
  {
    path: "/assigned-jobs",
    component: <AssignedJobs />
  },
  {
    path: "/myjob/report",
    component: <EmployeeReport />
  },
 
]

export default PublicRoutes;