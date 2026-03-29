import { useState } from "react";
import axios from "axios";

const API = "https://mak-mtg6.onrender.com";

function Login({ setAuth }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    const token = btoa(user + ":" + pass);

    axios.get(`${API}/api/manpower`, {
      headers: {
        Authorization: "Basic " + token
      }
    })
    .then(() => {
      localStorage.setItem("auth", token);
      setAuth(token);
      window.location.href = "/admin";
    })
    .catch(() => alert("Invalid login"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Username"
        onChange={e => setUser(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPass(e.target.value)}
      /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;