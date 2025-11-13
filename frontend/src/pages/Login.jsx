import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  localStorage.setItem("isLoggedIn", "false");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "User1" && password === "Password1") {
      onLogin(true); // set user as logged in
      localStorage.setItem("isLoggedIn", "true");
      navigate("/home"); // redirect to home page
    } else {
      alert("Invalid username or password!");
    }
  };

  return (
    <div id="logInBox" style={{ padding: "2rem" }}>
      <h1 class="blackText">Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
