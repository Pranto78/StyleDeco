import React from "react";
import { Link, NavLink } from "react-router-dom";
import UseAuthContext from "../../Hooks/UseAuthContext";
// import UseAuthContext from "../../Hooks/UseAuthContext";
import decoLogo from '../../assets/yyy.png';


// Active link style function
const getLinkStyle = ({ isActive }) => ({
  color: isActive ? "#2563eb" : "",
  borderBottom: isActive ? "2px solid #2563eb" : "none",
  paddingBottom: "2px",
});

const adminEmail = localStorage.getItem("adminEmail");


const Navbar = () => {
  const { user, logOut,role } = UseAuthContext();

  const handleLogout = async () => {
    try {
      await logOut(); // Firebase sign out

      // CRITICAL: Remove admin token so normal users work again!
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail"); // if you save it
      localStorage.removeItem("role"); // optional cleanup

      toast.success("Logged out successfully!"); // optional
    } catch (err) {
      console.error("Logout error:", err.message);
      toast.error("Logout failed");
    } finally {
      // Optional: redirect to home
      window.location.href = "/"; // or use navigate()
    }
  };

  const links = (
    <>
      <li>
        <NavLink to="/" style={getLinkStyle}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/services" style={getLinkStyle}>
          Services
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" style={getLinkStyle}>
          About
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" style={getLinkStyle}>
          Contact
        </NavLink>
      </li>

      {/* NEW (working) */}
      {user || adminEmail ? (
        <li>
          <NavLink to="/dashboard" style={getLinkStyle}>
            Dashboard
          </NavLink>
        </li>
      ) : null}
    </>
  );

  return (
    <div className="navbar bg-transparent backdrop-blur-sm shadow-none mx-auto px-4 fixed top-0 left-0 w-full z-50">
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
            {links}
          </ul>
        </div>
        <Link
          to="/"
          className="btn flex items-center justify-center btn-ghost font-bold text-primary-gradient text-2xl"
        >
          <div className="mt-2">
            <img src={decoLogo} className="h-14 w-15 object-contain" alt="" />
          </div>
          <div className="">StyleDecor</div>
        </Link>
      </div>

      {/* Navbar Center (large screen) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-10">{links}</ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end flex items-center gap-3">
        {/* If user is logged in */}
        {user ? (
          <>
            {/* User Photo */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    src={
                      user?.photoURL ||
                      "https://i.ibb.co.com/k63VV2qG/software-engineer.png"
                    }
                    alt="User"
                  />
                </div>
              </div>

              {/* Dropdown Menu */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 mt-3 w-40 rounded-box shadow"
              >
                <li>
                  <Link to="/dashboard/profile">Profile</Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn-primary-gradient"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          // If NO user (show login/signup)
          <>
            <Link
              to="/login"
              className="btn-primary-gradient px-3 bg-gray-400 rounded py-1 text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn-primary-gradient px-3 rounded py-1 text-white"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
