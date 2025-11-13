import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div id="landingPage">
      <div id="logo">
        <img
          src="https://www.programrose.org/wp-content/uploads/2023/06/ROSE-Foundation.png"
          alt="Logo"
        />
      </div>
      <div id="landingButtons">
        <Link to="/login">
          <button type="button">Log In</button>
        </Link>
        <Link to="/signup">
          <button type="button">Sign Up</button>
        </Link>
        <Link to="/adminsignup">
          <button type="button">Sign Up as Administrator</button>
        </Link>
      </div>
    </div>
  );
}
