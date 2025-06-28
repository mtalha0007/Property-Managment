import { useContext } from "react";
import { AuthContext } from "../context/createContext";

const useAuth = () => useContext(AuthContext);

export default useAuth;
