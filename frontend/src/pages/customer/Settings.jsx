import CustomerSidebar from "./CustomerSidebar";
import "./CustomerPages.css";

export default function Settings(){
  return (
    <div className="cs-layout">
      <CustomerSidebar />
      <main className="cs-main">
        <h1>Settings</h1>
        <p>Basic settings placeholder. You can add notification preferences, password change, etc.</p>
      </main>
    </div>
  );
}
