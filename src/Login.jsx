import { useState } from "react";
import axios from "axios";

function Login({ setAuth }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    const token = btoa(user + ":" + pass);

    axios.get("https://mak-mtg6.onrender.com/api/manpower", {
      headers: {
        Authorization: "Basic " + token
      }
    })
    .then(() => {
      localStorage.setItem("auth", token);
      setAuth(true);
    })
    .catch(() => alert("Invalid login"));
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input placeholder="Username" onChange={e => setUser(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPass(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
