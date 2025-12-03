import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <div>
      <h1 class="blackText">Settings Page</h1>
      <Link to="/landing">Log out</Link>
    </div>
  );
}
