import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, Legend
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API = "https://mak-mtg6.onrender.com";

function Dashboard({ isAdmin }) {

  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const [form, setForm] = useState({
    hkFemalePresent: "",
    hkMalePresent: "",
    technicianPresent: "",
    plumberPresent: ""
  });

  // ✅ Current Date
  const today = new Date().toISOString().split("T")[0];

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

  // 🔹 Filter by date
  const getFilteredData = () => {
    if (!selectedDate) return data;

    const filtered = history.find(item => item.date === selectedDate);
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

  // 🔹 Excel Download
  const downloadExcel = () => {
    const exportData = history.map(item => ({
      Date: item.date || "",
      HK_Female: item.hkFemalePresent || 0,
      HK_Male: item.hkMalePresent || 0,
      Technician: item.technicianPresent || 0,
      Plumber: item.plumberPresent || 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Manpower Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(file, "manpower_data.xlsx");
  };

  if (!data) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  // 🔹 Current distribution chart
  const chartData = [
    { name: "HK Female", value: filteredData?.hkFemalePresent || 0 },
    { name: "HK Male", value: filteredData?.hkMalePresent || 0 },
    { name: "Technician", value: filteredData?.technicianPresent || 0 },
    { name: "Plumber", value: filteredData?.plumberPresent || 0 }
  ];

  // ✅ LAST 7 CALENDAR DAYS LOGIC (FIXED)
  const trendData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    // format YYYY-MM-DD
    //const formattedDate = d.toISOString().split("T")[0];
	const formattedDate = d.toLocaleDateString("en-CA"); // gives YYYY-MM-DD

    // match with backend data
    const found = history.find(item => item.date === formattedDate);

    trendData.push({
      name: d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
      }),
      hkFemale: found?.hkFemalePresent || 0,
      hkMale: found?.hkMalePresent || 0,
      technician: found?.technicianPresent || 0,
      plumber: found?.plumberPresent || 0
    });
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f8",
      padding: "20px",
      fontFamily: "Segoe UI"
    }}>

      {/* HEADER */}
      <div style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <div>
          <h2>📊 Manpower Dashboard</h2>
          <div style={{ color: "#666" }}>📅 Today: {today}</div>
        </div>

        <div>
          <button onClick={downloadExcel} style={btn}>Download Excel</button>
          {isAdmin && <button onClick={handleLogout} style={btn}>Logout</button>}
        </div>
      </div>

      {/* DATE FILTER */}
      <div style={{ marginTop: "15px" }}>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>

      {/* CARDS */}
      <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
        {chartData.map((item, i) => (
          <div key={i} style={card}>
            <p>{item.name}</p>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* BAR CHART */}
      <div style={section}>
        <h3>Current Distribution</h3>
        <BarChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>

      {/* TREND GRAPH */}
      <div style={section}>
        <h3>Last 7 Days Trend</h3>
        <LineChart width={600} height={300} data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dataKey="hkFemale" />
          <Line dataKey="hkMale" />
          <Line dataKey="technician" />
          <Line dataKey="plumber" />
        </LineChart>
      </div>

      {/* ADMIN FORM */}
      {isAdmin && (
        <div style={section}>
          <h3>Add Data</h3>

          <input placeholder="HK Female"
            value={form.hkFemalePresent}
            onChange={e => setForm({ ...form, hkFemalePresent: e.target.value })}
          />
          <input placeholder="HK Male"
            value={form.hkMalePresent}
            onChange={e => setForm({ ...form, hkMalePresent: e.target.value })}
          />
          <input placeholder="Technician"
            value={form.technicianPresent}
            onChange={e => setForm({ ...form, technicianPresent: e.target.value })}
          />
          <input placeholder="Plumber"
            value={form.plumberPresent}
            onChange={e => setForm({ ...form, plumberPresent: e.target.value })}
          />

          <br /><br />
          <button onClick={handleSubmit} style={btn}>Submit</button>
        </div>
      )}

    </div>
  );
}

// styles
const card = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center"
};

const section = {
  background: "#fff",
  marginTop: "20px",
  padding: "15px",
  borderRadius: "10px"
};

const btn = {
  margin: "5px",
  padding: "8px 12px",
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default Dashboard;