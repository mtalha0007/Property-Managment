import Axios from "../../axios";
import { ErrorHandler } from "../utils/ErrorHandler";

const get = async (endpoint, param) => {
  try {
    const result = await Axios.get(endpoint, { params: param });
    if (result.status === 200) return result.data;
    else throw result;
  } catch (e) {
    throw ErrorHandler(e);
  }
};

const post = async (endpoint, data) => {
  try {
    const result = await Axios.post(endpoint, data);
    if (result.status === 200) return result.data;
    else throw result;
  } catch (e) {
    throw ErrorHandler(e);

  }
};

const put = async (endpoint, data) => {
  try {
    const result = await Axios.put(endpoint, data);
    if (result.status === 200) return result.data;
    else throw result;
  } catch (e) {
    throw ErrorHandler(e);
  }
};

 const patch = async (endPoint,data) => {
  try {
    const result = await Axios.patch(endPoint,data);
    if (result.status === 200) return result.data;
    else throw result;
  } catch (e) {
    throw ErrorHandler(e);
  }
};


const deleted = async (endpoint) => {
  try {
    const result = await Axios.delete(endpoint);
    if (result.status === 200) return result.data;
    else throw result;
  } catch (e) {
    throw ErrorHandler(e);
  }
}

export { get, post, put, patch, deleted };