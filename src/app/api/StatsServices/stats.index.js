import { StatsRoute } from "./stats.route";
import { post, get, put,deleted,patch } from "../index";

const StatsServices = {
 
  getStats: async ( ) => {
    let result = get(StatsRoute.getStats);
    return result;
  },
  
};

export default StatsServices;
