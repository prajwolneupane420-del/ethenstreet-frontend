import Footer from './Footer';
import Header from './Header';
import Toast from './Toast';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AnnouncementBar from './AnnouncementBar';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const hideFooter = location.pathname.includes("/product") && isMobile;

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Header />

      <main>{children}</main>

      {!hideFooter && <Footer />}

      <Toast />
    </div>
  );
};

export default Layout;