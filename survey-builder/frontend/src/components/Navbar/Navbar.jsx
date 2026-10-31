
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { useAuth } from "../../context/useAuth";

function Navbar() {
  const { logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">Survey Builder</div>

      <ul className="nav-links">
        <li>Surveys</li>
        <li>Templates</li>
        <li>Help</li>
      </ul>

      <div className="profile-container" ref={profileRef}>
        <button
          type="button"
          className="profile"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
        >
          <span className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </span>
        </button>

        {isDropdownOpen && (
          <div className="profile-dropdown" role="menu">
            <div className="dropdown-user-info">
              <strong>{user?.username || "User"}</strong>
              <span>{user?.email || ""}</span>
            </div>

            <button
              type="button"
              className="logout-button"
              role="menuitem"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
