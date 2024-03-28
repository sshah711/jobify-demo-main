/* eslint-disable react/prop-types */

import styled from "styled-components";
import Logo from "../Logo";
import { NavLink } from "react-router-dom";
// import { useContext } from "react";
// import { Context } from "../../main";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { FiLogOut } from "react-icons/fi";
// import { toast } from "react-toastify";
const Navbar = ({ navbarRef }) => {
  //   const [isAuthenticated, setIsAuthenticated] = useContext(Context);
  //   // const { handleFetchMe, user } = useUserContext();
  //   const handleLogout = async () => {
  //     await axios
  //       .get("http://localhost:3000/api/v1/auth/logout", {
  //         withCredentials: true,
  //       })
  //       .then((res) => {
  //         toast.success(res?.data?.message), setIsAuthenticated(false);
  //       })
  //       .catch((error) => {
  //         toast(error?.response?.data.message);
  //       });
  //};
  return (
    <Wrapper ref={navbarRef}>
      <div className="container">
        <Logo />
        <div className="flex justify-end items-center">
          <NavLink className="nav-item" to="/all-jobs">
            Jobs
          </NavLink>
          <NavLink className="nav-item hidden sm:block" to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className="nav-item" to="/login">
            <span className="bg-[#247BF7] text-white px-6 py-2 rounded">
              Login
            </span>
          </NavLink>
          {/* {!isAuthenticated ? (
            <NavLink className="nav-item" to="/login">
              <span className="bg-[#247BF7] text-white px-6 py-2 rounded">
               
                Login
              </span>
            </NavLink>
          ) : (
            <button className="logout" onClick={handleLogout}>
              <FiLogOut className="text-lg mr-1" /> logout
            </button>
          )} */}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  box-shadow: 0 5px 5px var(--shadow-light);
  padding: 1rem 0;
  .container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .container .nav-item {
    font-size: 16px;
    font-weight: 500;
    text-transform: capitalize;
    margin-left: 20px;
    color: var(--color-black);
  }
  .container .nav-item.active {
    color: var(--color-primary);
  }
  @media screen and (max-width: 1200px) {
    padding: 1rem 2rem;
  }
  @media screen and (max-width: 600px) {
    padding: 1.2rem 1rem;
    .container {
      display: flex;
      /* justify-content: center; */
    }
  }
`;

export default Navbar;
