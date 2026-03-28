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

  // ✅ NEW: Date filter state
  const [selectedDate, setSelectedDate] = useState("");

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
          setData(res.data[res.data.length - 1]);
        }
      })
      .catch(err => console.error("API Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ NEW: Filter logic
  const getFilteredData = () => {
    if (!selectedDate) return data;

    const filtered = history.find(item =>
      //item.date && item.date.startsWith(selectedDate)
	  const getFilteredData = () => {
		  if (!selectedDate) return data;

		  const filtered = history.find(item =>
			item.date === selectedDate
		  );

		  return filtered || null;
		};
    );

    return filtered || null;
  };

  const filteredData = getFilteredData();

  // 🔹 Submit
  const handleSubmit = () => {
    const token = localStorage.getItem("auth");

    axios.post(`${API}/api/admin/manpower`, form, {
      headers: { Authorization: "Basic " + token }
    })
    .then(() => {
      alert("Data saved successfully");
      setForm({
        hkFemalePresent: "",
        hkMalePresent: "",
        technicianPresent: "",
        plumberPresent: ""
      });
      fetchData();
    })
    .catch(err => {
      console.error(err);
      alert("Error saving data");
    });
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/";
  };

  if (!data) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  // 🔹 Use filtered data
  const chartData = [
    { name: "HK Female", value: filteredData?.hkFemalePresent || 0 },
    { name: "HK Male", value: filteredData?.hkMalePresent || 0 },
    { name: "Technician", value: filteredData?.technicianPresent || 0 },
    { name: "Plumber", value: filteredData?.plumberPresent || 0 }
  ];

  // 🔹 Trend data (unchanged)
  const trendData = history.slice(-7).map((item, index) => ({
    name: "Day " + (index + 1),
    hkFemale: item.hkFemalePresent || 0,
    hkMale: item.hkMalePresent || 0,
    technician: item.technicianPresent || 0,
    plumber: item.plumberPresent || 0
  }));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f8",
      padding: "20px",
      fontFamily: "Segoe UI"
    }}>

      {/* 🔹 HEADER */}
      <div style={{
        background: "#ffffff",
        padding: "15px 20px",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2>📊 Manpower Dashboard</h2>
        {isAdmin && (
          <button onClick={handleLogout} style={btnStyle}>
            Logout
          </button>
        )}
      </div>

      {/* ✅ NEW: DATE FILTER */}
      <div style={{ marginTop: "20px" }}>
        <label>Select Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* 🔹 CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}>
        {chartData.map((item, i) => (
          <div key={i} style={cardStyle}>
            <p style={{ color: "#777" }}>{item.name}</p>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* 🔹 BAR CHART */}
      <div style={sectionStyle}>
        <h3>📊 Current Distribution</h3>
        <BarChart width={700} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>

      {/* 🔹 TREND CHART */}
      <div style={sectionStyle}>
        <h3>📈 Last 7 Entries Trend</h3>
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
      </div>

      {/* 🔹 ADMIN FORM */}
      {isAdmin && (
        <div style={sectionStyle}>
          <h3>Add Manpower Data</h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "10px",
            maxWidth: "500px"
          }}>
            <input value={form.hkFemalePresent}
              placeholder="HK Female"
              onChange={e => setForm({ ...form, hkFemalePresent: e.target.value })}
              style={inputStyle}
            />
            <input value={form.hkMalePresent}
              placeholder="HK Male"
              onChange={e => setForm({ ...form, hkMalePresent: e.target.value })}
              style={inputStyle}
            />
            <input value={form.technicianPresent}
              placeholder="Technician"
              onChange={e => setForm({ ...form, technicianPresent: e.target.value })}
              style={inputStyle}
            />
            <input value={form.plumberPresent}
              placeholder="Plumber"
              onChange={e => setForm({ ...form, plumberPresent: e.target.value })}
              style={inputStyle}
            />
          </div>

          <button onClick={handleSubmit} style={{ ...btnStyle, marginTop: "10px" }}>
            Submit
          </button>
        </div>
      )}

    </div>
  );
}

// 🔹 Styles
const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  textAlign: "center"
};

const sectionStyle = {
  background: "#fff",
  marginTop: "20px",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const btnStyle = {
  padding: "8px 15px",
  border: "none",
  borderRadius: "8px",
  background: "#007bff",
  color: "#fff",
  cursor: "pointer"
};

export default Dashboard;