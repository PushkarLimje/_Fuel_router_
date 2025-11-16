import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
// import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements , Route, RouterProvider } from 'react-router-dom'
import { HomeLayout,DashboardLayout } from './Layout/index.js'
import {About,Contacts,Dashboard,FuelStations,Home,Login,PlanRoute,Register,Settings,Terms,TripHistory, PrivacyPolicy} from  './pages/index.js'
import ProtectedRoute from './Components/ProtectedRoute.jsx'  // ✅ ADD THIS
import { ToastProvider } from './Components/ToastContext.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Home + Public pages */}
      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      </Route>

      {/* Dashboard + Protected pages - WRAP WITH ProtectedRoute */}
      <Route element={<ProtectedRoute />}>  {/* ✅ ADD THIS */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planroute" element={<PlanRoute />} />
          <Route path="/fuelstations" element={<FuelStations />} />
          <Route path="/triphistory" element={<TripHistory />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>  {/* ✅ ADD THIS */}
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <RouterProvider router={router} /> */}
    <ToastProvider> {/* ✅ WRAP WITH ToastProvider */}
      <RouterProvider router={router} />
    </ToastProvider>
  </StrictMode>,
)

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       {/* Home + Public pages */}
//       <Route element={<HomeLayout />}>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contacts />} />
//         <Route path="/terms" element={<Terms />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      
//       </Route>

      

//       {/* Dashboard + Protected pages */}
//       <Route element={<DashboardLayout />}>
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/planroute" element={<PlanRoute />} />
//         <Route path="/fuelstations" element={<FuelStations />} />
//         <Route path="/triphistory" element={<TripHistory />} />
//         <Route path="/settings" element={<Settings />} />
//       </Route>
//     </>
//   )
// )


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
    
//     <RouterProvider router={router} />
    
//   </StrictMode>,
// )
