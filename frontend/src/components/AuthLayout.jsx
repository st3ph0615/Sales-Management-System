import logo from "../assets/Logo.png";

export default function AuthLayout({ children, activeTab, onTabChange }) {
  return (
    <div style={styles.container}>
      {/* LEFT SIDE (LOGO + TEXT) */}
      <div style={styles.left}>
        <img 
          src={logo} alt="Logo" 
          style={{ width: 250}} 
        />

        <p style={{ fontWeight: 500, marginTop: 5}}>DISCOVER MORE.</p>
        <p style={{ width: 300, fontWeight: "bold", textAlign: "center"}}>
          Where the Products You Love Find You.
        </p>
        <p style={{ width: 300, opacity: 0.7, marginTop: -10, textAlign: "center"}}>
          Shop a world of possibilities designed to fit your lifestyle.
        </p>
      </div>

      {/* RIGHT SIDE (CARD + FORMS) */}
      <div style={styles.card}>
        <div style={styles.tabs}>
          <button
            onClick={() => onTabChange("login")}
            style={activeTab === "login" ? styles.tabActive : styles.tab}
          >
            Login
          </button>

          <button
            onClick={() => onTabChange("register")}
            style={activeTab === "register" ? styles.tabActive : styles.tab}
          >
            Register
          </button>
        </div>

        {/* FORM */}
        <div style={{ marginTop: 20 }}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(to bottom, #a8e6ff, #d3d3d3)",
    alignItems: "center",
    justifyContent: "center",
    gap: "250px",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "rgba(255,255,255,0.7)",
    padding: "40px",
    width: 350,
    borderRadius: 16,
    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
  },
  tabs: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  tab: {
    padding: "8px 20px",
    borderRadius: 20,
    border: "1px solid #000",
    background: "white",
    cursor: "pointer",
  },
  tabActive: {
    padding: "8px 20px",
    borderRadius: 20,
    background: "black",
    color: "white",
    border: "1px solid black",
    cursor: "pointer",
  },
};
