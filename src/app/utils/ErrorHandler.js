export const ErrorHandler = (error) => {
  if (error?.response) {
    console.log("Error Handler Call", error?.response?.status);
    if (error?.response?.status === 401) {
      const token = localStorage.getItem("user");
      localStorage.clear();
      window.location.reload();
      
      if (token) {
        localStorage.clear();
        window.location.reload();
      }
    }
    return error?.response?.data?.message;
  } else if (error?.request) {
    return error?.message;
  } else {
    return "Something went wrong";
  }
};
