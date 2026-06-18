import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";

import SupplierDashboard from "@/pages/supplier/Dashboard";
import AddProperty from "@/pages/supplier/AddProperty";

import PropertyDetails from "@/pages/property/PropertyDetails";
import BookProperty from "@/pages/agent/BookProperty";
import MyBookings from "./pages/agent/MyBookings";
import BookingSuccess from "./pages/agent/BookingSuccess";
import BookingDetails from "./pages/agent/BookingDetails";

import ChangePassword from "./pages/ChangePassword";
// import PrivacyPolicy from "./pages/privacyPolicy";
// import TermsPolicy from "./pages/TermsPolicy";
// import CancellationPolicy from "./pages/CancellationPolicy";

import ProtectedRoute from "@/components/ProtectedRoute";
import { getUser } from "@/utils/auth";
import BankDetails from "./pages/BankDetails";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(getUser());

  // 🔥 listen logout event globally
  useEffect(() => {
    const handleLogout = () => setUser(null);

    window.addEventListener("logout", handleLogout);

    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>

            {/* ROOT */}
            <Route
              path="/"
              element={
                user
                  ? <Navigate to="/home" replace />
                  : <Navigate to="/login" replace />
              }
            />

            {/* LOGIN */}
            <Route
              path="/login"
              element={
                user
                  ? <Navigate to="/home" replace />
                  : <Login onLogin={(loggedUser: any) => setUser(loggedUser)} />
              }
            />

            {/* REGISTER */}
            <Route
              path="/register"
              element={
                user
                  ? <Navigate to="/home" replace />
                  : <Register />
              }
            />

            {/* PUBLIC ROUTES */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/bankdetails" element={<BankDetails />} />
             {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                   <Route path="/terms-of-service" element={<TermsPolicy />} />
                         <Route path="/cancellation-policy" element={<CancellationPolicy />} /> */}
                   
             
 <Route
                path="/change-password"
                element={<ChangePassword />}
              />
            {/* PROTECTED ROUTES */}
            <Route element={<ProtectedRoute />}>

              <Route
                path="/home"
                element={<Home onLogout={() => setUser(null)} />}
              />

              <Route
                path="/supplier/dashboard"
                element={<SupplierDashboard />}
              />

              <Route
                path="/supplier/add-property"
                element={<AddProperty />}
              />

              <Route
                path="/property/:id"
                element={<PropertyDetails />}
              />

              <Route
                path="/agent/book/:id"
                element={<BookProperty />}
              />

              <Route
                path="/agent/bookings"
                element={<MyBookings />}
              />

              <Route
                path="/agent/booking/:bookingNumber"
                element={<BookingDetails />}
              />

              <Route
                path="/agent/booking-success/:bookingNumber"
                element={<BookingSuccess />}
              />

             

            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;