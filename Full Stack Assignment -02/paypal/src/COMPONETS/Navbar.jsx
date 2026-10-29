import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo-link" aria-label="Home">
          <img
            src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
            alt="PayPal"
            className="paypal-logo"
          />
        </Link>

        <div className="nav-links">
          <span className="nav-item">Personal</span>
          <span className="nav-item">Business</span>
          <span className="nav-item">Partners</span>
          <span className="nav-item">Useful Info</span>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-light">
            Log In
          </Link>

          <Link to="/signup" className="btn btn-dark">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;