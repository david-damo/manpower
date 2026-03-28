import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, Legend
} from "recharts";

const API = "https://mak-mtg6.onrender.com";

function Dashboard({ isAdmin }) {

  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  const [form, setForm] = useState({
    hkFemalePresent: "",
    hkMalePresent: "",
    technicianPresent: "",
    plumberPresent: ""
  });

  // 🔹 Fetch data
  const fetchData = () => {
    axios.get(`${API}/api/manpower`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setHistory(res.data);
          setData(res.data[res.data.length - 1]); // latest
        }
      })
      .catch(err => console.error("API Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Submit (Admin)
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

  // 🔹 Loading
  if (!data) {
    return <h2 style={{ textAlign: "center" }}>Loading data...</h2>;
  }

  // 🔹 Latest snapshot (cards + bar chart)
  const chartData = [
    { name: "HK Female", value: data.hkFemalePresent || 0 },
    { name: "HK Male", value: data.hkMalePresent || 0 },
    { name: "Technician", value: data.technicianPresent || 0 },
    { name: "Plumber", value: data.plumberPresent || 0 }
  ];

  // 🔹 Last 7 entries trend
  const trendData = history.slice(-7).map((item, index) => ({
    name: "Day " + (index + 1),
    hkFemale: item.hkFemalePresent || 0,
    hkMale: item.hkMalePresent || 0,
    technician: item.technicianPresent || 0,
    plumber: item.plumberPresent || 0
  }));

  return (
    <div style={{
      maxWidth: "1000px",
      margin: "auto",
      padding: "20px",
      fontFamily: "Arial"
    }}>

      {/* 🔹 Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1>📊 Manpower Dashboard</h1>
        {isAdmin && <button onClick={handleLogout}>Logout</button>}
      </div>

      {/* 🔹 Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "15px",
        marginTop: "20px"
      }}>
        {chartData.map((item, index) => (
          <div key={index} style={{
            padding: "20px",
            borderRadius: "12px",
            background: "#f5f5f5",
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>
            <h4>{item.name}</h4>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* 🔹 Bar Chart */}
      <h2 style={{ marginTop: "30px" }}>📊 Current Distribution</h2>

      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>

      {/* 🔹 Trend Chart */}
      <h2 style={{ marginTop: "40px" }}>📈 Last 7 Entries Trend</h2>

      <LineChart width={700} height={300} data={trendData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="hkFemale" />
        <Line type="monotone" dataKey="hkMale" />
        <Line type="monotone" dataKey="technician" />
        <Line type="monotone" dataKey="plumber" />
      </LineChart>

      {/* 🔹 Admin Form */}
      {isAdmin && (
        <div style={{ marginTop: "40px" }}>
          <h3>Add Data</h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
            maxWidth: "400px"
          }}>
            <input placeholder="HK Female"
              onChange={e => setForm({ ...form, hkFemalePresent: e.target.value })}
            />
            <input placeholder="HK Male"
              onChange={e => setForm({ ...form, hkMalePresent: e.target.value })}
            />
            <input placeholder="Technician"
              onChange={e => setForm({ ...form, technicianPresent: e.target.value })}
            />
            <input placeholder="Plumber"
              onChange={e => setForm({ ...form, plumberPresent: e.target.value })}
            />
          </div>

          <button style={{ marginTop: "10px" }} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
