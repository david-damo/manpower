import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

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
    axios.get("https://mak-mtg6.onrender.com/api/manpower")
  .then(res => {
    console.log("API DATA 👉", res.data);  // 👈 ADD THIS
    if (res.data && res.data.length > 0) {
      setData(res.data[res.data.length - 1]);
    }
  })
      .catch(err => console.error("API Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Submit new data (Admin only)
  const handleSubmit = () => {
    axios.post("https://mak-mtg6.onrender.com/api/manpower", form)
      .then(() => {
        alert("✅ Data saved!");
        setForm({
          hkFemalePresent: "",
          hkMalePresent: "",
          technicianPresent: "",
          plumberPresent: ""
        });
        fetchData();
      })
      .catch(err => console.error("POST Error:", err));
  };

  // 🔹 Show loading
  if (!data) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  // 🔹 Chart Data
  const chartData = [
    { name: "HK Female", value: Number(data.hkFemalePresent || 0) },
    { name: "HK Male", value: Number(data.hkMalePresent || 0) },
    { name: "Technician", value: Number(data.technicianPresent || 0) },
    { name: "Plumber", value: Number(data.plumberPresent || 0) }
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      
      <h1>🚀 Manpower Dashboard</h1>

      {/* 🔹 Cards */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
        
        <div style={cardStyle}>
          <h3>HK Female</h3>
          <p>{data.hkFemalePresent}</p>
        </div>

        <div style={cardStyle}>
          <h3>HK Male</h3>
          <p>{data.hkMalePresent}</p>
        </div>

        <div style={cardStyle}>
          <h3>Technician</h3>
          <p>{data.technicianPresent}</p>
        </div>

        <div style={cardStyle}>
          <h3>Plumber</h3>
          <p>{data.plumberPresent}</p>
        </div>

      </div>

      {/* 🔹 Chart */}
      <div style={{ marginTop: "40px" }}>
        <h2>📊 Manpower Distribution</h2>

        <BarChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>

      {/* 🔐 Admin Form */}
      {isAdmin && (
        <div style={{ marginTop: "40px" }}>
          <h2>➕ Add Today Data</h2>

          <input
            placeholder="HK Female"
            value={form.hkFemalePresent}
            onChange={e => setForm({ ...form, hkFemalePresent: e.target.value })}
          /><br /><br />

          <input
            placeholder="HK Male"
            value={form.hkMalePresent}
            onChange={e => setForm({ ...form, hkMalePresent: e.target.value })}
          /><br /><br />

          <input
            placeholder="Technician"
            value={form.technicianPresent}
            onChange={e => setForm({ ...form, technicianPresent: e.target.value })}
          /><br /><br />

          <input
            placeholder="Plumber"
            value={form.plumberPresent}
            onChange={e => setForm({ ...form, plumberPresent: e.target.value })}
          /><br /><br />

          <button onClick={handleSubmit} style={buttonStyle}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

// 🔹 Styles
const cardStyle = {
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  width: "150px",
  textAlign: "center",
  boxShadow: "2px 2px 10px rgba(0,0,0,0.1)"
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Dashboard;
