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
      console.error("Logout error", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="gpa-link">
        <Link to="/">GPA Calculator</Link>
      </div>
      {user ? (
        <div className="welcome-message">
          <span>Welcome, {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="not-logged-in-message">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
