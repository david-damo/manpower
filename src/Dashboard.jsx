import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const API = "https://mak-mtg6.onrender.com";

function Dashboard({ isAdmin }) {
  const [data, setData] = useState(null);

  const [form, setForm] = useState({
    hkFemalePresent: "",
    hkMalePresent: "",
    technicianPresent: "",
    plumberPresent: ""
  });

  // 🔹 Fetch latest data
  const fetchData = () => {
    axios.get(`${API}/api/manpower`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setData(res.data[res.data.length - 1]);
        }
      })
      .catch(err => console.error("API Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Submit data (Admin)
  const handleSubmit = () => {
    const token = localStorage.getItem("auth");

    axios.post(
      `${API}/api/admin/manpower`,
      form,
      {
        headers: {
          Authorization: "Basic " + token
        }
      }
    )
    .then(() => {
      alert("Data saved successfully");
      fetchData();
    })
    .catch(err => {
      console.error("POST Error:", err);
      alert("Unauthorized or error");
    });
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/";
  };

  // 🔹 Loading state
  if (!data) {
    return <h2 style={{ textAlign: "center" }}>Loading data...</h2>;
  }

  const chartData = [
    { name: "HK Female", value: data.hkFemalePresent || 0 },
    { name: "HK Male", value: data.hkMalePresent || 0 },
    { name: "Technician", value: data.technicianPresent || 0 },
    { name: "Plumber", value: data.plumberPresent || 0 }
  ];

  return (
    <div style={{ padding: "20px" }}>
      
      {/* 🔹 Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>🚀 Manpower Dashboard</h1>
        {isAdmin && <button onClick={handleLogout}>Logout</button>}
      </div>

      {/* 🔹 Cards */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {chartData.map((item, index) => (
          <div key={index} style={{
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            width: "150px",
            textAlign: "center"
          }}>
            <h3>{item.name}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </div>

      {/* 🔹 Chart */}
      <h2 style={{ marginTop: "30px" }}>📊 Manpower Distribution</h2>

      <BarChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>

      {/* 🔹 Admin Form */}
      {isAdmin && (
        <div style={{ marginTop: "30px" }}>
          <h3>Add Data</h3>

          <input placeholder="HK Female"
            onChange={e => setForm({ ...form, hkFemalePresent: e.target.value })}
          /><br />

          <input placeholder="HK Male"
            onChange={e => setForm({ ...form, hkMalePresent: e.target.value })}
          /><br />

          <input placeholder="Technician"
            onChange={e => setForm({ ...form, technicianPresent: e.target.value })}
          /><br />

          <input placeholder="Plumber"
            onChange={e => setForm({ ...form, plumberPresent: e.target.value })}
          /><br />

          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
