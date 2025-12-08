// src/components/Dashboard/Dashboard.jsx
import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import UseAuthContext from "../../Hooks/UseAuthContext";
import {
  Home,
  User,
  Calendar,
  CreditCard,
  Package,
  Users,
  ClipboardList,
  BarChart3,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  Briefcase,
  CheckSquare,
} from "lucide-react";

const Dashboard = () => {
  const { user, adminEmail, logOut, role: contextRole } = UseAuthContext();

  // Determine role safely
  const role = contextRole || (adminEmail ? "admin" : user ? "user" : null);

  // Common logout
  const handleLogout = () => logOut();

  // Add this useEffect inside Dashboard.jsx
  useEffect(() => {
    const interval = setInterval(() => {
      // Re-check role every 10 seconds when page is open
      axiosSecure.get("/me").then((res) => {
        if (res.data.role === "decorator") {
          window.location.reload(); // or better: update state
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // USER MENU
  const userMenu = [
    { name: "My Profile", icon: <User size={20} />, to: "/dashboard/profile" },
    {
      name: "My Bookings",
      icon: <Calendar size={20} />,
      to: "/dashboard/my-bookings",
    },
    {
      name: "Payment History",
      icon: <CreditCard size={20} />,
      to: "/dashboard/payment-history",
    },
  ];

  // DECORATOR MENU
  const decoratorMenu = [
    {
      name: "My Assigned Projects",
      icon: <Briefcase size={20} />,
      to: "/dashboard/assigned-projects",
    },
    {
      name: "Today's Schedule",
      icon: <Calendar size={20} />,
      to: "/dashboard/today-schedule",
    },
    {
      name: "Update Project Status",
      icon: <CheckSquare size={20} />,
      to: "/dashboard/update-status",
    },
    {
      name: "Earnings Summary",
      icon: <DollarSign size={20} />,
      to: "/dashboard/earnings",
    },
  ];

  // ADMIN MENU (Exactly as per your requirement)
  const adminMenu = [
    {
      name: "Manage Decorators",
      icon: <Users size={20} />,
      to: "/dashboard/manage-decorators",
    },
    {
      name: "Manage Services",
      icon: <Package size={20} />,
      to: "/dashboard/manage-services",
    },
    {
      name: "Manage Bookings",
      icon: <ClipboardList size={20} />,
      to: "/dashboard/manage-bookings",
    },
    {
      name: "Assign Decorator",
      icon: <Users size={20} />,
      to: "/dashboard/assign-decorator",
    },
    {
      name: "Revenue Monitoring",
      icon: <DollarSign size={20} />,
      to: "/dashboard/revenue-monitoring",
    },
    {
      name: "Analytics Charts",
      icon: <BarChart3 size={20} />,
      to: "/dashboard/analytics-charts",
    },
  ];

  const menuItems =
    role === "admin"
      ? adminMenu
      : role === "decorator"
      ? decoratorMenu
      : userMenu;

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Top Bar */}
        <div className="navbar bg-base-200 border-b px-4">
          <div className="flex-1">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost lg:hidden"
            >
              <Menu size={24} />
            </label>
            <h2 className="text-xl font-bold">
              {role === "admin"
                ? "Admin Dashboard"
                : role === "decorator"
                ? "Decorator Dashboard"
                : "User Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm">
              {user?.email || adminEmail || "Guest"}
            </span>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 bg-base-100 min-h-screen">
          <Outlet />{" "}
          {/* This renders nested routes like /dashboard/my-bookings */}
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 h-full bg-base-300 text-base-content">
          {/* Logo / Home */}
          <li className="mb-6">
            <NavLink
              to="/"
              className="flex items-center gap-3 text-xl font-bold"
            >
              <Home size={24} />
              <span className="hidden lg:block">StyleDecor</span>
            </NavLink>
          </li>

          <div className="divider"></div>

          {/* Dynamic Menu Based on Role */}
          {menuItems.map((item, idx) => (
            <li key={idx} className="mb-2">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 ${
                    isActive ? "bg-primary text-white" : "hover:bg-base-200"
                  }`
                }
              >
                {item.icon}
                <span className="hidden lg:block">{item.name}</span>
              </NavLink>
            </li>
          ))}

          <div className="divider mt-auto"></div>

          {/* Settings */}
          <li>
            <NavLink
              to="/dashboard/settings"
              className="flex items-center gap-3"
            >
              <Settings size={20} />
              <span className="hidden lg:block">Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
