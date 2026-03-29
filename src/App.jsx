import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;