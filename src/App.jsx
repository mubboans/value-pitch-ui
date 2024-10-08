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
const MyProfile = lazy(() => import("./component/MyProfile"));
const MyUser = lazy(() => import("./component/MyUser"));
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
              <ProtectedRoute allowedRoles={['admin', 'client']} Component={Dashboard} />
            }
          ></Route>
          <Route path='/myprofile' element={
            <ProtectedRoute allowedRoles={['admin', 'user', 'client']} Component={MyProfile} />
          } />
          <Route path='/myuser' element={
            <ProtectedRoute allowedRoles={['admin', 'client']} Component={MyUser} />
          } />
          <Route path="*" element={<RouteNotFound />} />
          <Route path='/' element={<Login />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
