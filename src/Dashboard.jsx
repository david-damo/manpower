import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Dashboard({ isAdmin }) {
  const [data, setData] = useState(null);
  const [roles, setRoles] = useState({});
  const [roleName, setRoleName] = useState("");
  const [roleValue, setRoleValue] = useState("");

  // 🔹 Fetch latest data
  const fetchData = () => {
    axios
      .get("https://mak-mtg6.onrender.com/api/manpower")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          let latest = res.data[res.data.length - 1];

          // ✅ BACKWARD COMPATIBILITY (old → new)
          if (!latest.roles) {
            latest.roles = {
              "HK Female": latest.hkFemalePresent || 0,
              "HK Male": latest.hkMalePresent || 0,
              Technician: latest.technicianPresent || 0,
              Plumber: latest.plumberPresent || 0,
            };
          }

          setData(latest);
        }
      })
      .catch((err) => console.error("API Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Add role dynamically
  const addRole = () => {
    if (!roleName || !roleValue) return;

    setRoles((prev) => ({
      ...prev,
      [roleName]: Number(roleValue),
    }));

    setRoleName("");
    setRoleValue("");
  };

  // 🔹 Submit data (Admin)
  const handleSubmit = () => {
    const token = localStorage.getItem("auth");

    axios
      .post(
        "https://mak-mtg6.onrender.com/api/admin/manpower",
        {
          date: new Date().toISOString().split("T")[0],
          roles: roles,
        },
        {
          headers: {
            Authorization: "Basic " + token,
          },
        }
      )
      .then(() => {
        alert("✅ Data Saved Successfully");
        setRoles({});
        fetchData();
      })
      .catch((err) => console.error("POST Error:", err));
  };

  // 🔹 Chart Data
  const chartData = data?.roles
    ? Object.entries(data.roles).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚀 Manpower Dashboard</h2>

      {/* 🔹 Date Display */}
      {data?.date && (
        <p>
          <strong>Date:</strong> {data.date}
        </p>
      )}

      {/* 🔹 Cards */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {data?.roles &&
          Object.entries(data.roles).map(([key, value]) => (
            <div
              key={key}
              style={{
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                width: "150px",
                textAlign: "center",
                background: "#f9f9f9",
              }}
            >
              <h4>{key}</h4>
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                {value}
              </p>
            </div>
          ))}
      </div>

      {/* 🔹 Chart */}
      <h3 style={{ marginTop: "30px" }}>📊 Distribution</h3>

      {chartData.length > 0 ? (
        <BarChart width={800} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      ) : (
        <p>No data available</p>
      )}

      {/* 🔹 Admin Panel */}
      {isAdmin && (
        <div style={{ marginTop: "40px" }}>
          <h3>🔐 Admin Panel</h3>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              placeholder="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />

            <input
              placeholder="Count"
              type="number"
              value={roleValue}
              onChange={(e) => setRoleValue(e.target.value)}
            />

            <button onClick={addRole}>Add Role</button>
          </div>

          {/* 🔹 Preview before submit */}
          {Object.keys(roles).length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <h4>Preview:</h4>
              {Object.entries(roles).map(([k, v]) => (
                <p key={k}>
                  {k} : {v}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            style={{ marginTop: "15px" }}
          >
            Submit Data
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;