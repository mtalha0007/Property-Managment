import { AuthRoutes } from "./auth.route";
import { post, get, put, patch, deleted } from "../index";


const AuthServices = {
  login: async (obj) => {
    let result = post(AuthRoutes.login ,obj );
    return result;
  },
  agentSignup: async (obj) => {
    let result = post(AuthRoutes.agentSignup ,obj );
    return result;
  },
  agentList: async (search , page ,limit) => {
    let result = get(AuthRoutes.agentList + `?search=${search}&page=${page}&limit=${limit}` );
    return result;
  },
  getInvestors: async (search , page ,limit) => {
    let result = get(AuthRoutes.getInvestors + `?search=${search}&page=${page}&limit=${limit}` );
    return result;
  },
  agentDelete: async (id) => {
    let result = deleted(AuthRoutes.agentDelete + `/${id}` );
    return result;
  },
  getInvestorById: async (id) => {
    let result = get(AuthRoutes.getInvestorById + `/${id}` );
    return result;
  },
  deleteInvestor: async (id) => {
    let result = deleted(AuthRoutes.deleteInvestor + `/${id}` );
    return result;
  },
  agentLogin: async (obj) => {
    let result = post(AuthRoutes.agentLogin ,obj );
    return result;
  },
  createInvestor: async (obj) => {
    let result = post(AuthRoutes.createInvestor ,obj );
    return result;
  },
  updateInvestor: async (obj) => {
    let result = patch(AuthRoutes.updateInvestor ,obj );
    return result;
  },
  register: async (obj) => {
    let result = post(AuthRoutes.register ,obj );
    return result;
  },
  checkPhone: async (obj) => {
    let result = post(AuthRoutes.checkPhone ,obj );
    return result;
  },
  checkEmail: async (obj) => {
    let result = post(AuthRoutes.checkEmail ,obj );
    return result;
  },
  changePassword: async (obj) => {
    let result = patch(AuthRoutes.changePassword ,obj );
    return result;
  },
  stats: async () => {
    let result = get(AuthRoutes.stats  );
    return result;
  },


};

export default AuthServices;
