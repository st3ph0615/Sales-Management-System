import CustomerSidebar from "./CustomerSidebar";
import { useEffect, useState } from "react";
import "./CustomerPages.css";

export default function Profile(){
  const [profile, setProfile] = useState({name:"", email:"", region:"", address:"", phone:""});
  useEffect(()=>{
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/profile/me", { headers: { Authorization: "Bearer " + token }})
      .then(r=>r.json()).then(data => {
        if (data.user) setProfile(data.user);
        else if (data.name) setProfile(data);
      }).catch(()=>{});
  },[]);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/profile/update", {
      method:"PUT",
      headers:{ "Content-Type":"application/json", Authorization: "Bearer " + token },
      body: JSON.stringify(profile)
    });
    const data = await res.json();
    alert(data.message || data.error || "Saved");
  };

  return (
    <div className="cs-layout">
      <CustomerSidebar />
      <main className="cs-main">
        <h1>Profile</h1>
        <form className="cs-form" onSubmit={handleSave}>
          <label>Name<input value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})} /></label>
          <label>Region<input value={profile.region} onChange={e=>setProfile({...profile, region:e.target.value})} /></label>
          <label>Address<textarea value={profile.address} onChange={e=>setProfile({...profile, address:e.target.value})} /></label>
          <label>Phone<input value={profile.phone} onChange={e=>setProfile({...profile, phone:e.target.value})} /></label>
          <button type="submit" className="btn">Save Profile</button>
        </form>
      </main>
    </div>
  );
}
