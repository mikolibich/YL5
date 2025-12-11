import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup({ onSignup }) {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Ensure logged-out state on page load
  useEffect(() => {
    localStorage.setItem("isLoggedIn", "false");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || {};

    // Store users indexed by phone number
    users[phone] = {
      fname,
      lname,
      phone,
      password,
    };

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("isLoggedIn", "true");

    onSignup(true);
    navigate("/home");
  };

  return (
    <div id="logInBox" style={{ padding: "2rem" }}>
      <Link to="/landing">
        <img src="leftArrow.svg" alt="back" />
      </Link>

      <h1 className="blackText" id="signup-text">
        Signing up
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Last name"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />

        <button type="submit" className="nextButton">
          Next <img src="rightArrow.svg" alt="next" />
        </button>
      </form>
    </div>
  );
}
