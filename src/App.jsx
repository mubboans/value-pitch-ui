// import { useState } from 'react'
// import { Button } from 'primereact/button';
// import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex
// import 'primeflex/themes/primeone-light.css'
import './App.css'

import { lazy, Suspense } from "react";
// import Login from './component/Login';
// import Register from './component/Register';
import ProgressBar from './component/ProgressBar';
const Dashboard = lazy(() => import("./component/Dashboard"));
const Register = lazy(() => import("./component/Register"));
const Login = lazy(() => import("./component/Login"));
// import { useDispatch, useSelector } from "react-redux";
import Toaster from './component/Toaster';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './component/ProtectedRoute';
// import { isUserLogined } from './helper/helperFn';
import RouteNotFound from './component/RouteNotFound';
import NavBar from './component/NavBar';
import { isUserLogined } from './helper/helperFn';


function App() {
  return (
    <div>
      <Toaster />
      <NavBar isLogin={isUserLogined()} />
      <Suspense fallback={<ProgressBar />}>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute Component={Dashboard} />
            }
          ></Route>
          <Route path="*" element={<RouteNotFound />} />
        </Routes>
      </Suspense>
      {/* <Login /> */}
      {/* <ProgressBar /> */}
      {/* <Register /> */}
      {/* <h1>Hello {count}</h1> */}
      {/* <Button
        icon="pi pi-plus"
        className="mr-2"
        severity="success"
        label="Increment"
        onClick={() => setCount((count) => count + 1)}
      ></Button> */}
    </div>
  )
}

export default App
