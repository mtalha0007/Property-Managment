import { CompanyRoutes } from "./company.route";
import { post, get, put,deleted,patch } from "../index";

const CompanyServices = {
  createCompany: async (obj) => {
    let result = post(CompanyRoutes.createCompany, obj);
    return result;
  },
  getCompany: async (id,search,dateFrom,dateTo,page,limit) => {
    let result = get(CompanyRoutes.getCompany + `?id=${id}&search=${search}&date_from=${dateFrom}&date_to=${dateTo}&page=${page}&limit=${limit}`);
    return result;
  },
  deleteCompany: async (id ) => {
    let result = deleted(CompanyRoutes.deleteCompany + `?id=${id}`);
    return result;
  },
  updateCompany: async (obj ) => {
    let result = patch(CompanyRoutes.updateCompany ,obj);
    return result;
  },
};

export default CompanyServices;
