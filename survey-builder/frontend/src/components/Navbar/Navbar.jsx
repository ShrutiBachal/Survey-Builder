import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Survey Builder</div>

      <ul className="nav-links">
        <li>Surveys</li>
        <li>Templates</li>
        <li>Help</li>
      </ul>

      <div className="profile">JD</div>
    </nav>
  );
}

export default Navbar;