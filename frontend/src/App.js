// src/App.js
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
