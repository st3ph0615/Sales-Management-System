import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProducts from "./pages/customer/CustomerProducts";
import CustomerOrders from "./pages/customer/MyOrders";
import CustomerPayments from "./pages/customer/carts";
import CustomerProfile from "./pages/customer/Profile";
import CustomerSettings from "./pages/customer/Settings";
import CustomerProductDetails from "./pages/customer/CustomerProductDetails";
import Checkout from "./pages/customer/Checkout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

 


  const handleLogin = (loggedUser) => {
    setUser(loggedUser);

    if (loggedUser.role === "admin") {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/customer/dashboard";
    }
  };

  const handleRegistered = () => {
    window.location.href = "/login";
  };

  // admin route wrapper
  const requireAdmin = (Component) => {
    const stored = localStorage.getItem("user");
    if (!stored) return <Navigate to="/login" />;

    const u = JSON.parse(stored);
    return u.role === "admin" ? <Component /> : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route
          path="/login"
          element={
            <Login
              activeTab="login"
              onTabChange={(tab) => (window.location.href = `/${tab}`)}
              onLogin={handleLogin}
            />
          }
        />

        <Route
          path="/register"
          element={
            <Register
              activeTab="register"
              onTabChange={(tab) => (window.location.href = `/${tab}`)}
              onRegistered={handleRegistered}
            />
          }
        />

        {/* PRODUCT VIEW */}
        <Route path="/customer/products/:id" element={<CustomerProductDetails />} />

        {/* CUSTOMER ROUTES */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/products" element={<CustomerProducts />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />
        <Route path="/customer/payments" element={<CustomerPayments />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/settings" element={<CustomerSettings />} />
        <Route path="/customer/checkout" element={<Checkout />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={requireAdmin(AdminDashboard)} />
        <Route path="/admin/orders" element={requireAdmin(AdminOrders)} />
        <Route path="/admin/products" element={requireAdmin(AdminProducts)} />
        <Route path="/admin/users" element={requireAdmin(AdminUsers)} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
