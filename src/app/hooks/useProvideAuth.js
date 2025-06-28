import { useState } from "react";
import Storage from "../utils/Storage";

function useProvideAuth() {
  const { setStorageItem, getStorageItem } = Storage();

  // *For User
  const [user, setUser] = useState(getStorageItem("user"));
  const [webUser, setWebUser] = useState(getStorageItem("webUser"));

  // *For Login
  const userLogin = (data) => {
    setStorageItem("user", data);
    setUser(data);
  };
  const WebUserLogin = (data) => {
    setStorageItem("webUser", data);
    setWebUser(data);
  };

  // *For Logout
  const userLogout = async () => {
    localStorage.clear();
    setUser(null);
  };
  const webUserLogOut = async () => {
    localStorage.clear();
    setWebUser(null);
  };
  const updateProfile = (image) => {
    const userData = getStorageItem('user')
    userData.picture = image
    console.log(userData)
    setStorageItem('user', userData)
    setUser(userData)
  };
  return {
    user,
    userLogin,
    userLogout,
    updateProfile,

    webUser,
    WebUserLogin,
    webUserLogOut
  };
}

export default useProvideAuth;
