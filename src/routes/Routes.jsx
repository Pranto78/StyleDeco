import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import Root from '../Root/Root';
import Home from '../pages/Home/Home';
import ErrorPage from '../pages/Error/ErrorPage';
import { LogIn } from 'lucide-react';
import Registration from '../components/Registration/Registration';
import Login from '../components/Login/Login';



export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        index: true,
        Component: Home,
      },
      {
        path:'login',
        element: <Login></Login>
      },
      {
        path:'signup',
        element:<Registration></Registration>
      }
    ]
  },
]);
