import { useEffect, useState } from "react";
import axios from "axios";

function PublicDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/manpower")
      .then(res => {
        if (res.data.length > 0) {
          setData(res.data[res.data.length - 1]);
        }
      });
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Manpower Dashboard (Public)</h1>

      <p>HK Female: {data.hkFemalePresent}</p>
      <p>HK Male: {data.hkMalePresent}</p>
      <p>Technician: {data.technicianPresent}</p>
      <p>Plumber: {data.plumberPresent}</p>
    </div>
  );
}

export default PublicDashboard;