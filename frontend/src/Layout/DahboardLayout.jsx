

import React from "react";
import DashboardHeader from "../Components/Header/DashboardHeader.jsx"
import Footer from "../Components/Footer/Footer.jsx";
import { Outlet } from "react-router-dom";

// function DashboardLayout() {
//   return (
//     <>
//       <DashboardHeader />
//       <Outlet />
//       <Footer />
//     </>
//   );
// }
// export default DashboardLayout;

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
