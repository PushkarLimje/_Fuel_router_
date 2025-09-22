// import React from "react";
// import HomeHeader from "../Components/Header/HomeHeader.jsx"
// import Footer from "../Components/Footer/Footer.jsx";
// import { Outlet } from "react-router-dom";
// function HomeLayout() {
//   return (
//     <>
//       <HomeHeader />
//       <Outlet />
//       <Footer />
//     </>
//   );
// }
// export default HomeLayout;


import { Outlet, useLocation } from "react-router-dom";
import HomeHeader from "../Components/Header/HomeHeader.jsx"  // adjust path if different
import Footer from "../Components/Footer/Footer.jsx";   // adjust path if different

const HomeLayout = () => {
  const location = useLocation();
  
  // hide header/footer on login & register pages
  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && <HomeHeader />}
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default HomeLayout;

