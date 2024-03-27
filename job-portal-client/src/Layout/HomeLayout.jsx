
import Footer from "../pages/Footer";
import React, { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";

// import { SmallSidebar, LargeSidebar, DashboardNavbar } from "../components";
// import Swal from "sweetalert2";
// import { useUserContext } from "../context/UserContext";
// import axios from "axios";

//  const HomeLayout = () => {
   

//  const DashboardContext = createContext();


//     const { handleFetchMe, user } = useUserContext();
// //     const [showSidebar, setShowSidebar] = useState(false);

//     const handleLogout = async () => {
//         try {
//             const response = await axios.post(
//                 "http://localhost:3000/api/v1/auth/logout",
//                 { withCredentials: true }
//             );
//             Swal.fire({
//                 icon: "success",
//                 title: "Logout...",
//                 text: response?.data?.message,
//             });
//             handleFetchMe();
//         } catch (error) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Oops...",
//                 text: error?.response?.data,
//             });
//         }
//     };

//     // passing values
//     const values = { handleLogout };
//     return (
//         <DashboardContext.Provider value={values}>
     
//                  <div className="">
                       
//                         <div className="dashboard-page">
//                             <Outlet />
//                         </div>
                        
//             <Footer/>
//                     </div>
              
//         </DashboardContext.Provider>
//     );
// };

// export const useDashboardContext = () => useContext(DashboardContext);

//  export default HomeLayout; 

const HomeLayout = () => {
    return (
        <div>
            <Outlet />
            <Footer/>
        </div>
    );
};

export default HomeLayout; 
