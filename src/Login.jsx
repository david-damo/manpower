import { useState } from "react";
import Dashboard from "./Dashboard";

function Login() {
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {
    const token = btoa("admin:admin123");
    localStorage.setItem("auth", token);
    setLoggedIn(true);
  };

  if (loggedIn) {
    return <Dashboard isAdmin={true} />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Login</h2>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;