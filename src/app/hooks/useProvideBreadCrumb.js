import { useState, useEffect } from "react";

function useProvideBreadCrumb() {
  const [pageName, setPageName] = useState(localStorage.getItem("pageName") || null);

  useEffect(() => {
    if (pageName) {
      localStorage.setItem("pageName", pageName);
    }
  }, [pageName]);

  const setName = (name) => {
    setPageName(name);
    console.log(name);
  };

  return {
    pageName,
    setName
  };
}

export default useProvideBreadCrumb;
