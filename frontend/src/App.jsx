import { useState, useEffect, useCallback } from "react";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Pages
import Home from "./app/Home";
import Browse from "./app/Browse";
import BusinessDetail from "./app/BusinessDetail";
import Book from "./app/Book";
import MyBookings from "./app/MyBookings";
import Login from "./app/Login";
import Signup from "./app/Signup";
import CreateBusiness from "./app/CreateBusiness";
import ManageServices from "./app/ManageServices";
import SetAvailability from "./app/SetAvailability";
import OwnerDashboard from "./app/OwnerDashboard";

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);

  const navigate = useCallback((href) => {
    window.history.pushState({}, "", href);
    setRoute(href);
  }, []);

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    const onNavigate = (e) => {
      setRoute(e.detail.href);
      window.history.pushState({}, "", e.detail.href);
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("navigate", onNavigate);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("navigate", onNavigate);
    };
  }, []);

  const Page = () => {
    switch (route) {
      case "/":
        return <Home />;
      case "/login":
        return <Login />;
      case "/signup":
        return <Signup />;
      case "/browse":
        return <Browse />;
      case "/business/:id":
        return <BusinessDetail id={route.split("/").pop()} />;
      case "/book":
        return <Book />;
      case "/my-bookings":
        return <MyBookings />;
      case "/create-business":
        return <CreateBusiness />;
      case "/manage-services":
        return <ManageServices />;
      case "/set-availability":
        return <SetAvailability />;
      case "/owner-dashboard":
        return <OwnerDashboard />;
      default:
        // Support hash routes or fallback
        if (route.startsWith("/business/")) {
          return <BusinessDetail id={route.split("/").pop()} />;
        }
        return <Home />;
    }
  };

  // Only pure login/signup pages are wrapped in standalone AuthLayout
  const isAuthRoute = route === "/login" || route === "/signup";

  return (
    <AuthProvider>
      {isAuthRoute ? (
        <AuthLayout>
          <Page />
        </AuthLayout>
      ) : (
        <MainLayout>
          <Page />
        </MainLayout>
      )}
    </AuthProvider>
  );
}
