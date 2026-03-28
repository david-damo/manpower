import Dashboard from "./Dashboard";
import Admin from "./Admin";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
