import Navbar from "./../components/Navbar/Navbar";
import Footer from "./../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import StarField from "../components/Bg/StarField";
// import Starfield from "../components/Starfield";

const Root = () => {
  return (
    <div className="relative min-h-screen">
      {/* ⭐ dynamic math-based starfield */}
      <StarField />

      {/* real content */}
      <div className="relative z-10">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default Root;
