
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">SkillSwap</h1>
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:text-yellow-400">Dashboard</Link>
            <Link to="/add-skill" className="hover:text-yellow-400">Add Skill</Link>
            <button onClick={logout} className="hover:text-red-400">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/signup" className="hover:text-blue-400">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
