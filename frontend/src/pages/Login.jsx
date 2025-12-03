import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  localStorage.setItem("isLoggedIn", "false");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone === "1") {
      onLogin(true);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/home");
    } else {
      alert("Invalid phone number!");
    }
  };

  return (
    <div id="logInBox" style={{ padding: "2rem" }}>
      <Link to="/landing">
        <img src="leftArrow.svg"></img>
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
          Next <img src="rightArrow.svg"></img>
        </button>
      </form>
    </div>
  );
}
