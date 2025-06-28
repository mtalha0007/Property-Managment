import BreadCrumbContext from "../context";
import useProvideBreadCrumb from "../hooks/useProvideBreadCrumb";

function BreadCrumbProvider({ children }) {

  const name = useProvideBreadCrumb();

  return (
    <BreadCrumbContext.Provider value={name}>
      {children}
    </BreadCrumbContext.Provider>
  )
}

export default BreadCrumbProvider;