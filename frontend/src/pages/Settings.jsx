import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <div id="settingsWrapper">
      <h1 class="blackText">Settings</h1>
      <Link to="/landing" id="logOutButton">
        Log out
      </Link>
    </div>
  );
}
