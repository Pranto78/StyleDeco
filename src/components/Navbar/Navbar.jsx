import React from "react";
import { Link, NavLink } from "react-router-dom";
import UseAuthContext from "../../Hooks/UseAuthContext";
import decoLogo from "../../assets/yyy.png";
import toast from "react-hot-toast";
import { LogIn, UserPlus, LogOut } from "lucide-react";
import { motion } from "framer-motion";

// Active link style function
const getLinkStyle = ({ isActive }) => ({
  color: isActive ? "#2563eb" : "",
  borderBottom: isActive ? "2px solid #2563eb" : "none",
  paddingBottom: "2px",
});

const adminEmail = localStorage.getItem("adminEmail");

const Navbar = () => {
  const { user, logOut, role } = UseAuthContext();

  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("role");
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error("Logout failed");
    } finally {
      window.location.href = "/";
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

      {user || adminEmail ? (
        <li>
          <NavLink to="/dashboard" style={getLinkStyle}>
            Dashboard
          </NavLink>
        </li>
      ) : (
        <>
          {/* MOBILE ONLY */}
          <li className="lg:hidden">
            <NavLink to="/login" style={getLinkStyle}>
              Login
            </NavLink>
          </li>
          <li className="lg:hidden">
            <NavLink to="/signup" style={getLinkStyle}>
              Sign Up
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-transparent backdrop-blur-sm fixed top-0 w-full z-50 px-4">
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            ☰
          </label>
          <ul className="menu menu-sm dropdown-content bg-base-100 mt-3 w-52 p-2 shadow rounded-box">
            {links}
          </ul>
        </div>

        <Link
          to="/"
          className="btn btn-ghost text-2xl font-bold flex items-center gap-2"
        >
          <img src={decoLogo} className="h-14 object-contain" alt="" />
          <span className="text-primary-gradient">StyleDecor</span>
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-10">{links}</ul>
      </div>

      {/* Navbar End (DESKTOP) */}
      <div className="navbar-end hidden lg:flex items-center gap-3">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
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

            <ul className="menu menu-sm dropdown-content bg-base-100 mt-3 w-40 shadow rounded-box">
              <li>
                <Link to="/dashboard/profile">Profile</Link>
              </li>
              <li>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="btn-primary-gradient flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </motion.button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/login"
                className="btn-primary-gradient px-3 py-1 rounded text-white flex items-center gap-2"
              >
                <LogIn size={16} /> Login
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/signup"
                className="btn-primary-gradient px-3 py-1 rounded text-white flex items-center gap-2"
              >
                <UserPlus size={16} /> Sign Up
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
