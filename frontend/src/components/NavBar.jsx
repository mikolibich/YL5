import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav id="navBar" class="centerAlign">
      <Link to="/home">Home</Link>
      <Link to="/tickets">Saved Events</Link>
      <Link to="/settings">Settings</Link>
      <Link to="/Login">Log Out</Link>
    </nav>
  );
}
