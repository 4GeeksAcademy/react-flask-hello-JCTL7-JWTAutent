import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { StoreProvider } from "../hooks/useGlobalReducer";

const Layout = () => {
  return (
    <StoreProvider>
      <ScrollToTop>

        <div className="app-wrapper">
          <Navbar />
          <main className="app-content">
            <Outlet />
          </main>
          <Footer />
        </div>

      </ScrollToTop>
    </StoreProvider>
  );
};

export default Layout;