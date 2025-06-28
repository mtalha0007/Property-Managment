import { JobTimeRoute } from "./route";
import { post, get, put,deleted,patch } from "../index";

const JobTimeServices = {
  setJobTime: async (obj) => {
    let result = await post(JobTimeRoute.setJobTime, obj);
    return result;
  },
  getTimeSheet: async (jobId) => {
    let result = await get(JobTimeRoute.getTimeSheet + `?job_id=${jobId}`);
    return result;
  },
  updateTimeSheet: async (obj) => {
    let result = await patch(JobTimeRoute.updateTimeSheet , obj);
    return result;
  },
  
 
};

export default JobTimeServices;
