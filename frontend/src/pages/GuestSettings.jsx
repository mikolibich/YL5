import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

export default function GuestSettings() {
  return (
    <div>
      <Link to="/guest">
        <img
          src="leftArrow.svg"
          alt="back"
          id="backArrowGuest"
          style={{ marginTop: "10px" }}
        />
      </Link>
      <h1 class="blackText">Settings Page</h1>
      <Link to="/landing" id="logOutButton">
        Log out
      </Link>
    </div>
  );
}
