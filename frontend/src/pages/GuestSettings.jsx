import { Link, useNavigate } from "react-router-dom";

export default function GuestSettings() {
  const navigate = useNavigate();

  return (
    <div id="settingsWrapper">
      <Link to="/guest">
        <img
          src="leftArrow.svg"
          alt="back"
          id="backArrowGuest"
          style={{ marginTop: "10px" }}
        />
      </Link>
      <h1 className="blackText">Settings Page</h1>
      <button id="logInButton" onClick={() => navigate("/landing")}>
        Log In
      </button>
      <button id="creditsLink" onClick={() => navigate("/credits")}>
        Credits
      </button>
    </div>
  );
}
