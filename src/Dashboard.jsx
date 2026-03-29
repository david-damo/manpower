import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function Dashboard({ isAdmin }) {

  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);

  const [form, setForm] = useState({
    hkFemalePresent: "",
    hkMalePresent: "",
    technicianPresent: "",
    plumberPresent: "",
    pm: "",
    apm: "",
    accountant: "",
    helpDesk: "",
    hkSupervisor: "",
    hkTechSupervisor: ""
  });

  const [dynamicRoles, setDynamicRoles] = useState({});
  const [roleName, setRoleName] = useState("");
  const [roleCount, setRoleCount] = useState("");

  const BASE_URL = "https://mak-mtg6.onrender.com";

  // ✅ Fetch data
  const fetchData = () => {
    axios.get(`${BASE_URL}/api/manpower`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setHistory(res.data);

          const last = res.data[res.data.length - 1];
          setLatest(last);

          // Dynamic roles
          if (last.extraRoles) {
            setDynamicRoles(last.extraRoles);
          }
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Add dynamic role
  const addRole = () => {
    if (!roleName || !roleCount) return;

    setDynamicRoles({
      ...dynamicRoles,
      [roleName]: Number(roleCount)
    });

    setRoleName("");
    setRoleCount("");
  };

  // ✅ Submit
  const handleSubmit = () => {
    const token = localStorage.getItem("auth");

    const payload = {
      ...form,
      extraRoles: dynamicRoles
    };

    axios.post(`${BASE_URL}/api/admin/manpower`, payload, {
      headers: {
        Authorization: "Basic " + token
      }
    })
      .then(() => {
        alert("Saved Successfully ✅");
        fetchData();
      })
      .catch(err => {
        console.error(err);
        alert("Error saving data ❌");
      });
  };

  // ✅ Chart Data (last 7 days)
  const chartData = history.slice(-7).map(item => ({
    date: item.date,
    hkFemale: item.hkFemalePresent || 0,
    hkMale: item.hkMalePresent || 0,
    technician: item.technicianPresent || 0,
    plumber: item.plumberPresent || 0
  }));

  return (
    <div style={{ padding: "20px" }}>

      <h1>🚀 Manpower Dashboard</h1>

      {/* DATE */}
      {latest && (
        <h3>Date: {latest.date}</h3>
      )}

      {/* SUMMARY CARDS */}
      {latest && (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Card title="HK Female" value={latest.hkFemalePresent} />
          <Card title="HK Male" value={latest.hkMalePresent} />
          <Card title="Technician" value={latest.technicianPresent} />
          <Card title="Plumber" value={latest.plumberPresent} />

          <Card title="PM" value={latest.pm} />
          <Card title="APM" value={latest.apm} />
          <Card title="Accountant" value={latest.accountant} />
          <Card title="Help Desk" value={latest.helpDesk} />
          <Card title="HK Supervisor" value={latest.hkSupervisor} />
          <Card title="HK Tech Supervisor" value={latest.hkTechSupervisor} />
        </div>
      )}

      {/* CHART */}
      <h2 style={{ marginTop: "30px" }}>📊 Last 7 Days Trend</h2>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="hkFemale" />
            <Bar dataKey="hkMale" />
            <Bar dataKey="technician" />
            <Bar dataKey="plumber" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p>
      )}

      {/* ADMIN PANEL */}
      {isAdmin && (
        <div style={{ marginTop: "40px" }}>
          <h2>🔐 Admin Panel</h2>

          {/* FORM */}
          {Object.keys(form).map(key => (
            <input
              key={key}
              placeholder={key}
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              style={{ margin: "5px" }}
            />
          ))}

          {/* DYNAMIC ROLE */}
          <h3>Add Custom Role</h3>
          <input
            placeholder="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
          <input
            placeholder="Count"
            value={roleCount}
            onChange={(e) => setRoleCount(e.target.value)}
          />
          <button onClick={addRole}>Add Role</button>

          {/* PREVIEW */}
          <h3>Preview:</h3>
          {Object.entries(dynamicRoles).map(([k, v]) => (
            <p key={k}>{k} : {v}</p>
          ))}

          <button onClick={handleSubmit}>Submit Data</button>
        </div>
      )}

    </div>
  );
}

// ✅ CARD COMPONENT (Fix for React error #31)
function Card({ title, value }) {
  return (
    <div style={{
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      width: "150px",
      textAlign: "center"
    }}>
      <h4>{title}</h4>
      <h2>{value ?? 0}</h2>
    </div>
  );
}

export default Dashboard;