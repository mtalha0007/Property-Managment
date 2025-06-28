import { DocumentRoutes } from "./route";
import { post, get, put,deleted,patch } from "../index";

const DocumentServices = {
  SignDoc: async (obj) => {
    let result = post(DocumentRoutes.SignDoc, obj);
    return result;
  },

  getDoc: async (employeeID,jobId) => {
    let result = get(DocumentRoutes.getDoc + `?employee_id=${employeeID}&job_id=${jobId}`);
    return result;
  },

  approveDoc: async (obj ) => {
    let result = patch(DocumentRoutes.approveDoc,obj);
    return result;
  },
};

export default DocumentServices;
