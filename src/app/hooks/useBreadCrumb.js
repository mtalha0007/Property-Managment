import { useContext } from "react";
import BreadCrumbContext from "../context";

const useBreadCrumb = () => useContext(BreadCrumbContext);

export default useBreadCrumb;