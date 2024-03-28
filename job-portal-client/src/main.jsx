import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import router from "./Router/Routes";
import { RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserContext } from "./context/UserContext";
import axios from "axios";

axios.defaults.withCredentials = true;

// Create a client
const queryClient = new QueryClient();

// export const Context = createContext({ isAuthenticated: false });
// const AppW = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState({});

//   return (
//     <Context.Provider
//       value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
//     >
//       <RouterProvider router={router}></RouterProvider>
//     </Context.Provider>
//   );
// };

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <UserContext>
            <RouterProvider router={router}></RouterProvider>
        </UserContext> */}
    {/* <AppW /> */}
   
    <QueryClientProvider client={queryClient}>
  
      <UserContext>
        <RouterProvider router={router}></RouterProvider>
     
      </UserContext>
      
    </QueryClientProvider>
  </React.StrictMode>
);
