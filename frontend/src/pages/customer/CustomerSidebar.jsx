import { NavLink, useNavigate } from "react-router-dom";
import "./CustomerSidebar.css";

export default function CustomerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="cs-sidebar">
      <div className="cs-logo">ITEMORA</div>

      <nav className="cs-nav">
        <NavLink to="/customer/dashboard" className={({isActive})=> isActive ? "active" : ""}>Dashboard</NavLink>
        <NavLink to="/customer/products" className={({isActive})=> isActive ? "active" : ""}>Products</NavLink>
        <NavLink to="/customer/orders" className={({isActive})=> isActive ? "active" : ""}>My Orders</NavLink>
        <NavLink to="/customer/payments" className={({isActive})=> isActive ? "active" : ""}>My Cart</NavLink>
        <NavLink to="/customer/profile" className={({isActive})=> isActive ? "active" : ""}>Profile</NavLink>
        <NavLink to="/customer/settings" className={({isActive})=> isActive ? "active" : ""}>Settings</NavLink>
      </nav>

      <button className="cs-logout" onClick={handleLogout}>Logout</button>
    </aside>
  );
}
