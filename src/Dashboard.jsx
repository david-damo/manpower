import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function Dashboard({ isAdmin }) {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [roles, setRoles] = useState({});

  const [newRole, setNewRole] = useState("");
  const [newCount, setNewCount] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // 🔹 Fetch data
  const fetchData = () => {
    axios.get("https://mak-mtg6.onrender.com/api/manpower")
      .then(res => {
        if (res.data && res.data.length > 0) {
          setHistory(res.data);

          const latest = res.data[res.data.length - 1];
          setData(latest);

          // Extract dynamic roles
          const roleData = { ...latest };
          delete roleData.id;
          delete roleData.date;

          setRoles(roleData);
        }
      })
      .catch(err => console.error("API Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Add new role dynamically
  const addRole = () => {
    if (!newRole || !newCount) return;

    setRoles(prev => ({
      ...prev,
      [newRole]: Number(newCount)
    }));

    setNewRole("");
    setNewCount("");
  };

  // 🔹 Submit data
  const handleSubmit = () => {
    const token = localStorage.getItem("auth");

    const payload = {
      date: today,
      ...roles
    };

    axios.post(
      "https://mak-mtg6.onrender.com/api/admin/manpower",
      payload,
      {
        headers: {
          Authorization: "Basic " + token
        }
      }
    )
      .then(() => {
        alert("✅ Data Saved");
        fetchData();
      })
      .catch(err => {
        console.error(err);
        alert("❌ Error saving data");
      });
  };

  // 🔹 Chart Data (last 7 days)
  const chartData = history.slice(-7).map(item => {
    const obj = {
      date: item.date
    };

    Object.keys(item).forEach(key => {
      if (key !== "id" && key !== "date") {
        obj[key] = item[key];
      }
    });

    return obj;
  });

  // 🔹 Colors for chart bars
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#00c49f",
    "#ffbb28"
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      
      {/* HEADER */}
      <h1>🚀 Manpower Dashboard</h1>
      <p><b>Date:</b> {today}</p>

      {/* CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}>
        {Object.entries(roles).map(([key, value]) => (
          <div key={key} style={{
            padding: "20px",
            borderRadius: "12px",
            background: "#f5f5f5",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <h3 style={{ textTransform: "capitalize" }}>{key}</h3>
            <p style={{ fontSize: "20px" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <h2 style={{ marginTop: "40px" }}>📊 Distribution (Last 7 Days)</h2>

      {chartData.length > 0 ? (
        <BarChart width={800} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />

          {Object.keys(roles).map((role, index) => (
            <Bar
              key={role}
              dataKey={role}
              fill={colors[index % colors.length]}
            />
          ))}
        </BarChart>
      ) : (
        <p>No data available</p>
      )}

      {/* ADMIN PANEL */}
      {isAdmin && (
        <div style={{
          marginTop: "40px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px"
        }}>
          <h2>🔐 Admin Panel</h2>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              placeholder="Role Name"
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
            />
            <input
              placeholder="Count"
              type="number"
              value={newCount}
              onChange={e => setNewCount(e.target.value)}
            />
            <button onClick={addRole}>Add Role</button>
          </div>

          <h4>Preview:</h4>
          {Object.entries(roles).map(([k, v]) => (
            <p key={k}>{k} : {v}</p>
          ))}

          <button
            onClick={handleSubmit}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}
          >
            Submit Data
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;