import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  // Always reset login state on page load
  localStorage.setItem("isLoggedIn", "false");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Load users object
    const users = JSON.parse(localStorage.getItem("users")) || {};

    // Check if the phone exists
    if (users[phone]) {
      // Successful login
      onLogin(true);
      localStorage.setItem("isLoggedIn", "true");

      // Optional: store user info for later use
      localStorage.setItem("fname", users[phone].fname);
      localStorage.setItem("lname", users[phone].lname);
      localStorage.setItem("phone", phone);

      navigate("/home");
    } else {
      alert("No account found with that phone number!");
    }
  };

  return (
    <div id="logInBox" style={{ padding: "2rem" }}>
      <Link to="/landing">
        <img src="leftArrow.svg" alt="Back" />
      </Link>
      <h1 className="blackText">Phone Number</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <br />
        <button type="submit" className="nextButton">
          Next <img src="rightArrow.svg" alt="Next" />
        </button>
      </form>
    </div>
  );
}
