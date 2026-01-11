import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import StarField from "../components/Bg/StarField";

const Root = () => {
  const [theme, setTheme] = useState("dark");

  return (
    <div className={`relative min-h-screen ${theme}`}>
      <StarField theme={theme} />

      <div className="relative z-10">
        <Navbar theme={theme} setTheme={setTheme} />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default Root;
