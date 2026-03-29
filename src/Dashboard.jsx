import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function Dashboard({ isAdmin }) {

  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);

  const [roles, setRoles] = useState({});
  const [roleName, setRoleName] = useState("");
  const [roleValue, setRoleValue] = useState("");

  const BASE_URL = "https://mak-mtg6.onrender.com";

  // ✅ Fetch Data
  const fetchData = () => {
    axios.get(`${BASE_URL}/api/manpower`)
      .then(res => {
        if (res.data.length > 0) {
          setHistory(res.data);
          setLatest(res.data[res.data.length - 1]);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Add Role dynamically
  const addRole = () => {
    if (!roleName || roleValue === "") return;

    setRoles({
      ...roles,
      [roleName]: Number(roleValue)
    });

    setRoleName("");
    setRoleValue("");
  };

  // ✅ Submit (KEY FIX)
  const handleSubmit = () => {
    const token = localStorage.getItem("auth");

    const payload = {
      date: new Date().toISOString().split("T")[0],
      roles: roles // 🔥 ONLY THIS REQUIRED
    };

    console.log("PAYLOAD:", payload);

    axios.post(`${BASE_URL}/api/admin/manpower`, payload, {
      headers: {
        Authorization: "Basic " + token,
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        alert("✅ Saved");
        setRoles({});
        fetchData();
      })
      .catch(err => {
        console.error(err);
        alert("❌ Error saving");
      });
  };

  // ✅ Chart Data (last 7 days)
  const chartData = history.slice(-7).map(item => ({
    date: item.date,
    ...item.roles
  }));

  return (
    <div style={{ padding: "20px" }}>

      <h1>🚀 Manpower Dashboard</h1>

      {/* ✅ DISPLAY LATEST */}
      {latest && (
        <div>
          <h3>Date: {latest.date}</h3>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {latest.roles &&
              Object.entries(latest.roles).map(([role, value]) => (
                <Card key={role} title={role} value={value} />
              ))
            }
          </div>
        </div>
      )}

      {/* ✅ GRAPH */}
      <h2 style={{ marginTop: "30px" }}>📊 Last 7 Days</h2>

      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            {/* 🔥 Dynamic Bars */}
            {latest?.roles &&
              Object.keys(latest.roles).map(role => (
                <Bar key={role} dataKey={role} />
              ))
            }

          </BarChart>
        </ResponsiveContainer>
      )}

      {/* ✅ ADMIN */}
      {isAdmin && (
        <div style={{ marginTop: "40px" }}>
          <h2>🔐 Admin Panel</h2>

          {/* ADD ROLE */}
          <input
            placeholder="Role Name (e.g. PM)"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />

          <input
            placeholder="Count"
            value={roleValue}
            onChange={(e) => setRoleValue(e.target.value)}
          />

          <button onClick={addRole}>Add Role</button>

          {/* PREVIEW */}
          <h3>Preview</h3>
          {Object.entries(roles).map(([k, v]) => (
            <p key={k}>{k}: {v}</p>
          ))}

          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

    </div>
  );
}

// ✅ Card
function Card({ title, value }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "15px",
      borderRadius: "10px",
      width: "120px",
      textAlign: "center"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default Dashboard;