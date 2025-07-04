import { PropertyRoutes } from "./property.route";
import { post, get, put,deleted,patch } from "../index";

const PropertyServices = {
  createProperty: async (obj) => {
    let result = post(PropertyRoutes.createProperty, obj);
    return result;
  },
  getProperty: async (search,id,page,limit,minPrice,maxPrice,type,purpose) => {
    let result = get(PropertyRoutes.getProperty + `?search=${search}&id=${id}&page=${page}&limit=${limit}&start_price=${minPrice}&end_price=${maxPrice}&type=${type}&purpose=${purpose}`);
    return result;
  },
  getPropertyById: async (id) => {
    let result = get(PropertyRoutes.getPropertyById + `/${id}`);
    return result;
  },
  deleteProperty: async (id ) => {
    let result = deleted(PropertyRoutes.deleteProperty + `/${id}`);
    return result;
  },
  updateProperty: async (obj ) => {
    let result = patch(PropertyRoutes.updateProperty ,obj);
    return result;
  },
  getInvestrorProperty: async (search,page,limit,id) => {
    let result = get(PropertyRoutes.getInvestrorProperty + `?search=${search}&page=${page}&limit=${limit}&id=${id}`);
    return result;
  }
};

export default PropertyServices;
