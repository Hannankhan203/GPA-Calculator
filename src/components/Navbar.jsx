import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthStore } from "../context/store";

const Navbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="nav-logo">📚</span>
          <span className="nav-title">GPA Calculator</span>
        </Link>

        <div className="nav-menu">
          {user ? (
            <div className="nav-user">
              <span className="nav-welcome">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="nav-logout">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-login">
                Login
              </Link>
              <Link to="/signup" className="nav-signup">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
