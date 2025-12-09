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
        path:"services",
        element:<Services></Services>
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
      {
        path: "/dashboard/manage-decorators",
        element: (
          <AdminRoute>
            <ManageDecorator></ManageDecorator>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/manage-services",
        element: (
          <AdminRoute>
            <ManageService></ManageService>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/manage-bookings",
        element: (
          <AdminRoute>
            <ManageBooking></ManageBooking>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/assign-decorator",
        element: (
          <AdminRoute>
            <AssignDecorator></AssignDecorator>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/analytics-charts",
        element: (
          <AdminRoute>
            <AnalyticsCharts></AnalyticsCharts>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/revenue-monitoring",
        element: (
          <AdminRoute>
            <RevenueMonitoring></RevenueMonitoring>
          </AdminRoute>
        ),
      },
    ],
  },
]);
