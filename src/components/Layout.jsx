import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="">{children}</main>
    </>
  );
};

export default Layout;
