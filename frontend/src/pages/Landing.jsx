import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div id="landingPage">
      <div id="logo">
        <img src="halfLogo.svg" alt="Logo" />
      </div>
      <div id="landingButtons">
        <Link to="/login">
          <button type="button">Log In</button>
        </Link>
        <Link to="/signup">
          <button type="button">Sign Up</button>
        </Link>
        <Link to="/guest">
          <button type="button">Sign in as guest</button>
        </Link>
        <Link
          to="http://127.0.0.2:8000/rose-staff-portal/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button type="button">Sign Up as Administrator</button>
        </Link>
      </div>
    </div>
  );
}
