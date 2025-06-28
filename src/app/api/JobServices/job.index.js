import { JobRoutes } from "./job.route";
import { post, get, put,deleted,patch } from "../index";

const JobServices = {
  createJob: async (obj) => {
    let result = post(JobRoutes.createJob, obj);
    return result;
  },
  applyOnJob: async (obj) => {
    let result = post(JobRoutes.applyOnJob, obj);
    return result;
  },
  getJobs: async ( page,limit,id,search , status) => {
    let result = get(JobRoutes.getJobs + `?page=${page}&limit=${limit}&id=${id}&search=${search}&status=${status}`);
    return result;
  },
  getAllJobs: async () => {
    let result = get(JobRoutes.getAllJobs);
    return result;
  },
  getAppliedJobs: async ( page,limit,id,search) => {
    let result = get(JobRoutes.getAppliedJobs + `?page=${page}&limit=${limit}&id=${id}&search=${search}`);
    return result;
  },
  getAssignedJobs: async ( page,limit,id,search) => {
    let result = get(JobRoutes.getAssignedJobs + `?page=${page}&limit=${limit}&id=${id}&search=${search}`);
    return result;
  },
  getJobDetails: async (id ) => {
    let result = get(JobRoutes.getJobDetails + `?id=${id}`);
    return result;
  },
  updateJob: async (obj ) => {
    let result = patch(JobRoutes.updatejob,obj);
    return result;
  },
  assignJob: async (obj ) => {
    let result = patch(JobRoutes.assignJob,obj);
    return result;
  },
  approveJob: async (obj ) => {
    let result = patch(JobRoutes.approveJob,obj);
    return result;
  },
};

export default JobServices;
