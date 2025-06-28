import { AuthContext } from "../context/createContext";
import useProvideAuth from "../hooks/useProvideAuth";

function AuthProvider({ children }) {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
