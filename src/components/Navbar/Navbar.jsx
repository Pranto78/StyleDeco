import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import UseAuthContext from "../../Hooks/UseAuthContext";
import decoLogo from "../../assets/yyy.png";
import toast from "react-hot-toast";
import { LogIn, UserPlus, LogOut, House, ClipboardPaste, CircleAlert, PhoneForwarded, LayoutDashboard } from "lucide-react";
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
        <NavLink  to="/" style={getLinkStyle}>
          <House size={15} />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className="" to="/services" style={getLinkStyle}>
          <ClipboardPaste size={15} />
          Services
        </NavLink>
      </li>
      <li>
        <NavLink className="" to="/about" style={getLinkStyle}>
          <CircleAlert size={15} />
          About
        </NavLink>
      </li>
      <li>
        <NavLink className="" to="/contact" style={getLinkStyle}>
          <PhoneForwarded size={15} />
          Contact
        </NavLink>
      </li>

      {user || adminEmail ? (
        <li>
          <NavLink className="" to="/dashboard" style={getLinkStyle}>
            <LayoutDashboard size={15} />
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


  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
<motion.div
  initial={false}
  animate={{
    borderRadius: scrolled ? "9999px" : "0px",
    marginTop: scrolled ? "12px" : "0px",
    width: scrolled ? "95%" : "100%",
    boxShadow: scrolled
      ? "0 10px 30px rgba(0,0,0,0.15)"
      : "none",
  }}
  transition={{
    type: "spring",
    stiffness: 120,
    damping: 20,
  }}
  className="navbar bg-transparent backdrop-blur-sm fixed top-0 left-1/2 -translate-x-1/2 z-50 px-4"
>
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

            <motion.ul
  initial={{ opacity: 0, y: -10, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -10, scale: 0.95 }}
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 18,
  }}
  className="menu menu-sm dropdown-content bg-base-100 mt-3 w-44 shadow-xl rounded-2xl backdrop-blur-md"
>

              <li>
                <Link to="/dashboard/profile">Profile</Link>
              </li>
              <li>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="btn-primary-gradient rounded-2xl flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </motion.button>
              </li>
            </motion.ul>
          </div>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/login"
                className="btn-primary-gradient px-3 py-1 rounded-2xl text-black flex items-center gap-2"
              >
                <LogIn size={16} /> Login
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/signup"
                className="btn-primary-gradient px-3 py-1 rounded-2xl text-black flex items-center gap-2"
              >
                <UserPlus size={16} /> Sign Up
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;
