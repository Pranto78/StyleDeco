import React from "react";
import { Link, NavLink } from "react-router-dom";
import UseAuthContext from "../../Hooks/UseAuthContext";


// Active link style function
const getLinkStyle = ({ isActive }) => ({
  color: isActive ? "#2563eb" : "",
  borderBottom: isActive ? "2px solid #2563eb" : "none",
  paddingBottom: "2px",
});

const Navbar = () => {
  const { user, logOut } = UseAuthContext();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.log(err.message);
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
        <NavLink to="/profile" style={getLinkStyle}>
          My Profile
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm mx-auto px-4">
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
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          StyleDecor
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
              <label tabIndex={0} className="cursor-pointer">
                <img
                  src={
                    user.photoURL || "https://i.ibb.co/0F6F4V4/default-user.png"
                  }
                  alt="User"
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
              </label>

              {/* Dropdown Menu */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 mt-3 w-40 rounded-box shadow"
              >
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-red-500">
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
              className="btn-primary px-3 bg-gray-400 rounded py-1 text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn-primary px-3 bg-gray-400 rounded py-1 text-white"
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
