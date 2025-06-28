import {FileRoutes } from "./file.route";
import { post, get, put } from "../index";


const FileServices = {
  uploadImage: async (obj) => {
    let result = post(FileRoutes.uploadImage ,obj );
    return result;
  },
  uploadDocument: async (obj) => {
    let result = post(FileRoutes.uploadDocument ,obj );
    return result;
  },

};

export default FileServices;
