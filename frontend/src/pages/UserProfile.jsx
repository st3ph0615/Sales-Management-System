import { useState, useEffect } from "react";

export default function UserProfile() {
  const [image, setImage] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState("");

  // Load user email from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setEmail(storedUser.email);
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const url = "http://localhost:3000/api/profile/update";  
    console.log("FETCHING:", url);

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name,
        email,
        region,
        address,
        phone,
      }),
    });

    const data = await res.json();
    console.log("RESPONSE:", data);

    if (!res.ok) {
      setMessage(data.error || "Update failed");
      return;
    }

    setMessage("Profile updated! Redirecting...");
    setTimeout(() => (window.location.href = "/"), 1500);

  } catch (err) {
    console.error(err);
    setMessage("Error saving profile");
  }
};


  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Avatar */}
        <div style={styles.avatarContainer}>
          <img
            src={image || "https://via.placeholder.com/150?text=Avatar"}
            alt="Profile"
            style={styles.avatar}
          />

          <label style={styles.cameraIcon}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            📷
          </label>
        </div>

        <h2 style={styles.title}>Create Your Profile</h2>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.row}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              readOnly
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <input
              type="text"
              placeholder="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.input}
            />
          </div>

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.inputFull}
          />

          <button type="submit" style={styles.button}>Save Profile</button>

          <p style={{ marginTop: 10 }}>{message}</p>
        </form>
      </div>
    </div>
  );
}

/* -----------------------------
   CLEAN STYLES (TESTED & VALID)
------------------------------*/
const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    background: "linear-gradient(to bottom, #a8e6ff, #d3d3d3)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "rgba(255,255,255,0.9)",
    padding: "40px",
    width: "700px",
    borderRadius: "20px",
    boxShadow: "0 20px 45px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  },
  cameraIcon: {
    position: "absolute",
    bottom: "0px",
    right: "0px",
    background: "#000",
    color: "#fff",
    fontSize: "16px",
    padding: "6px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "2px solid white",
  },
  title: {
    marginBottom: 30,
    fontSize: "22px",
    fontWeight: "600",
  },
  form: {
    width: "100%",
  },
  row: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
  },
  input: {
    flex: 1,
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  inputFull: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "20px",
  },
  button: {
    width: "200px",
    padding: "12px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    display: "block",
    margin: "0 auto",
  },
};
