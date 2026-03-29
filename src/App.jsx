import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { useState } from "react";

function App() {
  const [auth, setAuth] = useState(localStorage.getItem("auth"));

  return (
    <>
      {/* 🔹 Navigation */}
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/admin">Admin</Link>
      </nav>

      {/* 🔹 Routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/admin"
          element={
            auth ? <Dashboard isAdmin={true} /> : <Login setAuth={setAuth} />
          }
        />
      </Routes>
    </>
  );
}

export default App;