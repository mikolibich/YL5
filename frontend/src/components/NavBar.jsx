import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav id="navBar" class="centerAlign">
      <Link to="/home">
        <img src="home.svg" className="homeIcon"></img>
      </Link>
      <Link to="/tickets">
        <img src="bookmark.svg" className="bookmarkIcon"></img>
      </Link>
      <Link to="/Login">
        <img src="calendar.svg" className="calendarIcon"></img>
      </Link>
      <Link to="/settings">
        <img src="settings.svg" className="settingsIcon"></img>
      </Link>
    </nav>
  );
}
