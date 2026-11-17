// src/App.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "./context/auth.context";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Page components (organized under dedicated pages/ directory)
import Home from "./pages/home.page";
import Browse from "./pages/browse.page";
import BusinessDetail from "./pages/business-detail.page";
import Book from "./pages/book.page";
import MyBookings from "./pages/my-bookings.page";
import Login from "./pages/login.page";
import Signup from "./pages/signup.page";
import CreateBusiness from "./pages/create-business.page";
import ManageServices from "./pages/manage-services.page";
import SetAvailability from "./pages/set-availability.page";
import OwnerDashboard from "./pages/owner-dashboard.page";

export default function App() {
  const { isAuthenticated, isOwner, loading } = useAuth();

  const [route, setRoute] = useState(window.location.pathname);

  const navigate = useCallback((href) => {
    window.history.pushState({}, "", href);
    setRoute(href);
  }, []);

  const publicLanding = "/";
  const authPages = ["/login", "/signup"];
  const protectedRoutes = [
    "/browse",
    "/book",
    "/my-bookings",
    "/create-business",
    "/manage-services",
    "/set-availability",
    "/owner-dashboard",
  ];

  // Redirect logic based on auth state and route
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated && protectedRoutes.includes(route)) {
      navigate("/login");
      return;
    }
    if (isAuthenticated && authPages.includes(route)) {
      // redirect owners to owner dashboard, customers to browse page
      const target = isOwner ? "/owner-dashboard" : "/browse";
      navigate(target);
    }
  }, [route, isAuthenticated, isOwner, loading, navigate]);

  // Listen for browser navigation events
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
    if (route.startsWith("/business/")) {
      const businessId = route.split("/").pop();
      return <BusinessDetail id={businessId} />;
    }
    switch (route) {
      case "/":
        return <Home />;
      case "/login":
        return <Login />;
      case "/signup":
        return <Signup />;
      case "/browse":
        return <Browse />;
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
        return <Home />;
    }
  };

  if (loading) return null;

  const isAuthRoute = authPages.includes(route);

  return isAuthRoute ? (
    <AuthLayout>
      <Page />
    </AuthLayout>
  ) : (
    <MainLayout>
      <Page />
    </MainLayout>
  );
}
