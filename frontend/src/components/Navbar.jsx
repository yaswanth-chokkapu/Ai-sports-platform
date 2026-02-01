import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="logo">Sports Analytics</div>

        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/performance">Performance</NavLink>
          <NavLink to="/injury">Injury & Fatigue</NavLink>
          <NavLink to="/coach">AI Voice Coach</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

