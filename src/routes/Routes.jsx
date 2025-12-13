import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import Home from "../pages/Home/Home";
import ErrorPage from "../pages/Error/ErrorPage";
import Registration from "../components/Registration/Registration";
import Login from "../components/Login/Login";
import Dashboard from "../components/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import ManageDecorator from "../components/Dashboard/AdminElement/ManageDecorator";
import AdminRoute from "./AdminRoute";
import ManageService from "../components/Dashboard/AdminElement/ManageService";
import ManageBooking from "../components/Dashboard/AdminElement/ManageBooking";
import AssignDecorator from "../components/Dashboard/AdminElement/AssignDecorator";
import AnalyticsCharts from "../components/Dashboard/AdminElement/AnalyticsCharts";
import RevenueMonitoring from "../components/Dashboard/AdminElement/RevenueMonitoring";
import ServiceDetails from "../components/ServiceDetails/ServiceDetails";
import Services from "../components/Services/Services";
import MyProfle from "../components/Dashboard/User/MyProfle";
import MyBooking from "../components/Dashboard/User/MyBooking";
import PaymentHistory from "../components/Dashboard/User/PaymentHistory";
import PaymentCancel from "../components/Dashboard/User/PaymentCancel";
import PaymentSuccess from "../components/Dashboard/User/PaymentSuccess";
import DecoratorRoute from "./DecoratorRoute";
import MyAssignProject from "../components/Dashboard/Decorator/MyAssignProject";
import TodaysSchedule from "../components/Dashboard/Decorator/TodaysSchedule";
import UpdateProjectStatus from "../components/Dashboard/Decorator/UpdateProjectStatus";
import EarningSummary from "../components/Dashboard/Decorator/EarningSummary";
import About from "../components/About/About";
import Contact from "../components/Contact/Contact";
import RoleRedirect from "./RoleRedirect";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Registration /> },
      {
        path: "services",
        element: <Services></Services>,
      },
      {
        path: "about",
        element: <About></About>,
      },
      {
        path: "contact",
        element: <Contact></Contact>,
      },
      {
        path: "service-details/:id",
        element: (
          <PrivateRoute>
            <ServiceDetails></ServiceDetails>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    errorElement: <ErrorPage />,
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      // ✅ DEFAULT LANDING
      { index: true, element: <RoleRedirect /> },

      // USER
      { path: "profile", element: <MyProfle /> },
      { path: "my-bookings", element: <MyBooking /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "payment-cancelled", element: <PaymentCancel /> },
      { path: "payment-success", element: <PaymentSuccess /> },

      // ADMIN
      {
        path: "manage-decorators",
        element: (
          <AdminRoute>
            <ManageDecorator />
          </AdminRoute>
        ),
      },
      {
        path: "manage-services",
        element: (
          <AdminRoute>
            <ManageService />
          </AdminRoute>
        ),
      },
      {
        path: "manage-bookings",
        element: (
          <AdminRoute>
            <ManageBooking />
          </AdminRoute>
        ),
      },
      {
        path: "assign-decorator",
        element: (
          <AdminRoute>
            <AssignDecorator />
          </AdminRoute>
        ),
      },
      {
        path: "analytics-charts",
        element: (
          <AdminRoute>
            <AnalyticsCharts />
          </AdminRoute>
        ),
      },
      {
        path: "revenue-monitoring",
        element: (
          <AdminRoute>
            <RevenueMonitoring />
          </AdminRoute>
        ),
      },

      // DECORATOR
      {
        path: "assigned-projects",
        element: (
          <DecoratorRoute>
            <MyAssignProject />
          </DecoratorRoute>
        ),
      },
      {
        path: "today-schedule",
        element: (
          <DecoratorRoute>
            <TodaysSchedule />
          </DecoratorRoute>
        ),
      },
      {
        path: "update-status",
        element: (
          <DecoratorRoute>
            <UpdateProjectStatus />
          </DecoratorRoute>
        ),
      },
      {
        path: "earnings",
        element: (
          <DecoratorRoute>
            <EarningSummary />
          </DecoratorRoute>
        ),
      },
    ],
  },
]);
