import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeLayout from "./HomeLayout";
import DashboardLayout from "./DashboardLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PlanRoute from "./pages/PlanRoute";
import FuelStations from "./pages/FuelStations";
import TripHistory from "./pages/TripHistory";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home + Public pages */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard + Protected pages */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planroute" element={<PlanRoute />} />
          <Route path="/fuelstations" element={<FuelStations />} />
          <Route path="/triphistory" element={<TripHistory />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
