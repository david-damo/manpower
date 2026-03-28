import { useState } from "react";

function Admin() {
  const [role, setRole] = useState("");
  const [count, setCount] = useState("");

  const handleSubmit = async () => {
    await fetch("https://mak-mtg6.onrender.com/api/admin/manpower", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role, count })
    });

    alert("Data added!");
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <input placeholder="Role" onChange={(e) => setRole(e.target.value)} />
      <input placeholder="Count" onChange={(e) => setCount(e.target.value)} />

      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}

export default Admin;