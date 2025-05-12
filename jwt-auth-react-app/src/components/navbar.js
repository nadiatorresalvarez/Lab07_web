import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">JWT Auth App</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        
        {user ? (
          <>
            {user.roles.includes("ROLE_ADMIN") && (
              <Link to="/admin" className="nav-link">
                <i className="fas fa-shield-alt"></i> Admin
              </Link>
            )}
            {user.roles.includes("ROLE_MODERATOR") && (
              <Link to="/moderator" className="nav-link">
                <i className="fas fa-user-shield"></i> Moderator
              </Link>
            )}
            <Link to="/user" className="nav-link">
              <i className="fas fa-user"></i> Profile
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
      
      {user && (
        <div className="navbar-user">
          <span className="welcome-text">Welcome, {user.username}!</span>
          <button onClick={logout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;