import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function Dashboard({ isAdmin }) {
  const [data, setData] = useState(null);
  const [roles, setRoles] = useState({});
  const [roleName, setRoleName] = useState("");
  const [roleValue, setRoleValue] = useState("");

  // 🔹 Fetch latest data
  const fetchData = () => {
    axios.get("https://mak-mtg6.onrender.com/api/manpower")
      .then(res => {
        if (res.data && res.data.length > 0) {
          setData(res.data[res.data.length - 1]);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Add role dynamically
  const addRole = () => {
    if (!roleName || !roleValue) return;

    setRoles({
      ...roles,
      [roleName]: Number(roleValue)
    });

    setRoleName("");
    setRoleValue("");
  };

  // 🔹 Submit
  const handleSubmit = () => {
    const token = localStorage.getItem("auth");

    axios.post(
      "https://mak-mtg6.onrender.com/api/admin/manpower",
      {
        date: new Date().toISOString().split("T")[0],
        roles: roles
      },
      {
        headers: {
          Authorization: "Basic " + token
        }
      }
    )
    .then(() => {
      alert("Saved!");
      setRoles({});
      fetchData();
    })
    .catch(err => console.error(err));
  };

  // 🔹 Chart Data
  const chartData = data?.roles
    ? Object.entries(data.roles).map(([key, value]) => ({
        name: key,
        value: value
      }))
    : [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚀 Manpower Dashboard</h2>

      {/* 🔹 Display Cards */}
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {data?.roles &&
          Object.entries(data.roles).map(([key, value]) => (
            <div key={key} style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              width: "150px",
              textAlign: "center"
            }}>
              <h4>{key}</h4>
              <p>{value}</p>
            </div>
          ))}
      </div>

      {/* 🔹 Chart */}
      <h3 style={{ marginTop: "30px" }}>📊 Distribution</h3>
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>

      {/* 🔹 Admin Panel */}
      {isAdmin && (
        <div style={{ marginTop: "30px" }}>
          <h3>Admin Panel</h3>

          <input
            placeholder="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />

          <input
            placeholder="Count"
            value={roleValue}
            onChange={(e) => setRoleValue(e.target.value)}
          />

          <button onClick={addRole}>Add Role</button>

          <br /><br />

          <button onClick={handleSubmit}>Submit Data</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;