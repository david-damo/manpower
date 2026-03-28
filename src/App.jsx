import Admin from "./Admin";
import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/admin" element={<Admin />} />
  </Routes>
</BrowserRouter>
