import Dashboard from "../../views/admin/dashboard";
import Login from "../../views/admin/Login/index";



import CreateCompany from "../../views/admin/Company/CreateCompany/index"
import CompanyList from "../../views/admin/Company/CompanyList/index"
import CompanyDetails from "../../views/admin/Company/CompanyDetail";
import UpdateCompany from "../../views/admin/Company/UpdateCompany/index";

import CreateProperty from "../../views/admin/Property/CreateProperty/index"
import PropertyList from "../../views/admin/Property/PropertyList/index"
import PropertyDetails from "../../views/admin/Property/PropertyDetails";
import UpdateProperty from "../../views/admin/Property/UpdateProperty";

import CreateJobRequest from "../../views/admin/Jobs/JobRequest/CreateJobRequest/index"
import JobRequestList from "../../views/admin/Jobs/JobRequest/JobRequestList/index"
import UpdateJobRequest from "../../views/admin/Jobs/JobRequest/UpdateJobRequest/index"
import AssignedJob from "../../views/admin/Jobs/JobRequest/AssignedJob/index"
import JobsList from "../../views/admin/Jobs/JobsList/index"
import Create from "../../views/admin/CreateSkill/index"
import JoDetails from "../../views/admin/Jobs/JobRequest/JobDetail";
import AssignedEmployee from "../../views/admin/Jobs/JobRequest/AssignedJob/AssignedEmployee";

import CreateCode from "../../views/admin/CreateSkill/code"
import ApplicantList from "../../views/admin/Jobs/JobRequest/ApplicantList";
import JobsReport from "../../views/admin/Jobs/JobsReport";
import AccountSetting from "../../views/AccountSetting";

import AgentListing from "../../views/admin/Agent/index"
import InvestorList from "../../views/admin/Investors/InvestorList";
import InvestorCreate from "../../views/admin/Investors/InvestorCreate";
import EditInvestor from "../../views/admin/Investors/EditInvestor";

const AdminRoutes = [
  {
    path: "/admin",
    component: <Login />
  },
  {
    path: "/dashboard",
    component: <Dashboard />
  },
  {
    path: "/create/skill",
    component: <Create />
  },
  
  
  {
    path: "/companies",
    component: <CompanyList />
  },
  {
    path: "/companies/create",
    component: <CreateCompany />
  },
  {
    path: "/companies/update",
    component: <UpdateCompany />
  },
  {
    path: "/companies/details",
    component: <CompanyDetails />
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
    path: "/jobrequest",
    component: <JobRequestList />
  },
  {
    path: "/jobrequest/create",
    component: <CreateJobRequest />
  },
  {
    path: "/jobrequest/update/:id",
    component: <UpdateJobRequest />
  },
  {
    path: "/jobrequest/details/:id",
    component: <JoDetails />
  },
  {
    path: "/jobrequest/assignto",
    component: <AssignedJob />
  },
  {
    path: "/jobrequest/assign-employee",
    component: <AssignedEmployee />
  },
  {
    path: "/jobs",
    component: <JobsList />
  },
  {
    path: "/create/code",
    component: <CreateCode />
  },
 
  {
    path: "/job-applicant/applicant-list/:id",
    component: <ApplicantList />
  },
  {
    path: "/job/report",
    component: <JobsReport />
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
  
];

export default AdminRoutes;