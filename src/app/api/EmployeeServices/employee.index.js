import { EmployeeRoutes } from "./employee.route";
import { post, get, put,deleted,patch } from "../index";

const EmployeeServices = {
  createEmployee: async (obj) => {
    let result = post(EmployeeRoutes.createEmployee, obj);
    return result;
  },
  getEmployee: async (id , page,limit,status,skillType,search) => {
    let result = get(EmployeeRoutes.getEmployee + `?id=${id}&page=${page}&limit=${limit}&status=${status}&skill_type=${skillType}&search=${search}`);
    return result;
  },
  getApplicantEmployee: async (id , page,limit,status,skillType,search,job_id) => {
    let result = get(EmployeeRoutes.getApplicantEmployee + `?id=${id}&page=${page}&limit=${limit}&status=${status}&skill_type=${skillType}&search=${search}&job_id=${job_id}`);
    return result;
  },
  employeeRequest: async (id , page,limit,status,skillType,search) => {
    let result = get(EmployeeRoutes.employeeRequest + `?id=${id}&page=${page}&limit=${limit}&status=${status}&skill_type=${skillType}&search=${search}`);
    return result;
  },
  getEmployeeDetails: async (id) => {
    let result = get(EmployeeRoutes.getEmployeeDetails + `?id=${id}`);
    return result;
  },
  getEmployeeRequestDetail: async (id) => {
    let result = get(EmployeeRoutes.getEmployeeRequestDetail + `?id=${id}`);
    return result;
  },
  getSingleEmployee: async (id) => {
    let result = get(EmployeeRoutes.getSingleEmployee + `?employee_id=${id}`);
    return result;
  },
  deleteEmployee: async (id ) => {
    let result = deleted(EmployeeRoutes.deleteEmployee + `?id=${id}`);
    return result;
  },
 UpdateEmployee: async (obj ) => {
    let result = patch(EmployeeRoutes.UpdateEmployee,obj);
    return result;
  },
 updateRequest: async (obj ) => {
    let result = patch(EmployeeRoutes.updateRequest,obj);
    return result;
  },
  SendMessage: async (obj) => {
    let result = post(EmployeeRoutes.SendMessage, obj);
    return result;
  },
};

export default EmployeeServices;
