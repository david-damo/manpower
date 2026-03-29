import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard isAdmin={false} />} />
        <Route path="/admin" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;