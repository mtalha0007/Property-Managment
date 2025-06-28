import { createContext, useContext } from "react";
import { AuthContext } from "./createContext";



const BreadCrumbContext = createContext();  
export const useAuth = () => useContext(AuthContext);


export default BreadCrumbContext;