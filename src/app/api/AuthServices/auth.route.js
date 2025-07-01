export const  AuthRoutes = {
   
    login: "/auth/login",
    register:"/employees/addEmployeeRequest",
    checkEmail:"/auth/checkDuplicateEmail",
    checkPhone:"/auth/checkDuplicatePhone",
    changePassword:"/auth/changePassword",
    agentSignup:"/auth/agent/signup",
    agentLogin:"/auth/agent/login",
    agentList:"/auth/agent/list",
    agentDelete: "/auth/agent/delete",
    stats:"/stats",
    investorStats:"/investorstats",

    getInvestors:"/auth/investors",
    createInvestor:"/auth/signup",
    deleteInvestor:"/auth/investors/delete",
    getInvestorById:"auth/investors/detail",
    updateInvestor:"/auth/investors/update",


    createBooking:"/bookings/booking/create",
    getBooking:"/bookings/getbookings",
    getBookingById:"/bookings/getbooking",
    deleteBooking:"/bookings/deletebooking",
    updateBooking:"/bookings/updatebooking",

    createFeedBack:'/bookings/create/feedback',
  };
    