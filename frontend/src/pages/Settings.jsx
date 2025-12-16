import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");

    navigate("/Landing", { replace: true });
  };

  return (
    <div id="settingsWrapper">
      <h1 className="blackText">Settings</h1>

      <button id="logOutButton" onClick={handleLogout}>
        Log out
      </button>

      <button id="creditsLink" onClick={() => navigate("/credits")}>
        Credits
      </button>
    </div>
  );
}
