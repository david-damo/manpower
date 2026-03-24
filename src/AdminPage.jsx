import { useState } from "react";
import Dashboard from "./Dashboard";

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "admin123") {
      setLoggedIn(true);
    } else {
      alert("Wrong password");
    }
  };

  // 🔐 Login Screen
  if (!loggedIn) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          padding: "30px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <h2>🔐 Admin Login</h2>

          <input
            type="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          /><br /><br />

          <button onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ After login
  return <Dashboard isAdmin={true} />;
}

export default AdminPage;