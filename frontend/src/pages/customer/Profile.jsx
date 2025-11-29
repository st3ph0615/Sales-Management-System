import CustomerSidebar from "./CustomerSidebar";
import { useEffect, useState } from "react";
import "./Profile.css"; // <— NEW CSS FILE

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    region: "",
    address: "",
    phone: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/profile/me", {
      headers: { Authorization: "Bearer " + token }
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setProfile(data.user);
        else if (data.name) setProfile(data);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(profile)
    });

    const data = await res.json();
    alert(data.message || data.error || "Saved");
  };

  return (
    <div className="cs-layout">
      <CustomerSidebar />

      <main className="cs-main profile-main">
        <h2 className="page-title">My Profile</h2>

        <div className="profile-card">
          <form className="profile-form" onSubmit={handleSave}>

            <div className="form-row">
              <label>Name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label>Region</label>
              <input
                value={profile.region}
                onChange={(e) =>
                  setProfile({ ...profile, region: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Address</label>
              <textarea
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              ></textarea>
            </div>

            <div className="form-row">
              <label>Phone</label>
              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>

            <button type="submit" className="btn primary save-btn">
              Save Profile
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
