import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { useState } from "react";

function App() {
  const [auth, setAuth] = useState(localStorage.getItem("auth"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={
          auth ? <Dashboard isAdmin={true}/> : <Login setAuth={setAuth}/>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
