import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import AdminPage from "./AdminPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard isAdmin={false} />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;