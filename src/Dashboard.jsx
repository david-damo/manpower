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
    plumberPresent: "",
    pm: "",
    apm: "",
    accountant: "",
    helpDesk: "",
    hkSupervisor: "",
    hkTechSupervisor: ""
  });

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
        plumberPresent: "",
        pm: "",
        apm: "",
        accountant: "",
        helpDesk: "",
        hkSupervisor: "",
        hkTechSupervisor: ""
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
      Plumber: item.plumberPresent || 0,
      PM: item.pm || 0,
      APM: item.apm || 0,
      Accountant: item.accountant || 0,
      HelpDesk: item.helpDesk || 0,
      HK_Supervisor: item.hkSupervisor || 0,
      HK_Tech_Supervisor: item.hkTechSupervisor || 0
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

  // 🔹 Cards
  const chartData = [
    { name: "HK Female", value: filteredData?.hkFemalePresent || 0 },
    { name: "HK Male", value: filteredData?.hkMalePresent || 0 },
    { name: "Technician", value: filteredData?.technicianPresent || 0 },
    { name: "Plumber", value: filteredData?.plumberPresent || 0 },
    { name: "PM", value: filteredData?.pm || 0 },
    { name: "APM", value: filteredData?.apm || 0 },
    { name: "Accountant", value: filteredData?.accountant || 0 },
    { name: "HelpDesk", value: filteredData?.helpDesk || 0 },
    { name: "HK Supervisor", value: filteredData?.hkSupervisor || 0 },
    { name: "HK Tech Supervisor", value: filteredData?.hkTechSupervisor || 0 }
  ];

  // 🔹 Trend Data (FIXED DATE LOGIC)
  const trendData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const formattedDate = d.toISOString().split("T")[0];

    const found = history.find(item => item.date === formattedDate);

    trendData.push({
      name: d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
      }),
      hkFemale: found?.hkFemalePresent || 0,
      hkMale: found?.hkMalePresent || 0,
      technician: found?.technicianPresent || 0,
      plumber: found?.plumberPresent || 0,
      pm: found?.pm || 0,
      apm: found?.apm || 0,
      accountant: found?.accountant || 0,
      helpDesk: found?.helpDesk || 0,
      hkSupervisor: found?.hkSupervisor || 0,
      hkTechSupervisor: found?.hkTechSupervisor || 0
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: "20px" }}>
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
        <BarChart width={700} height={300} data={chartData}>
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
        <LineChart width={700} height={300} data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dataKey="hkFemale" />
          <Line dataKey="hkMale" />
          <Line dataKey="technician" />
          <Line dataKey="plumber" />
          <Line dataKey="pm" />
          <Line dataKey="apm" />
          <Line dataKey="accountant" />
          <Line dataKey="helpDesk" />
          <Line dataKey="hkSupervisor" />
          <Line dataKey="hkTechSupervisor" />
        </LineChart>
      </div>

      {/* ADMIN FORM */}
      {isAdmin && (
        <div style={section}>
          <h3>Add Data</h3>

          {Object.keys(form).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              style={{ margin: "5px" }}
            />
          ))}

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
  textAlign: "center",
  minWidth: "120px"
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