import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();

  // Scroll spy for active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "contact"];
      for (let id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();         // clear cookies or token
      setMenuOpen(false);     // close menu if open
      navigate("/");          // redirect to homepage
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-black bg-opacity-80 backdrop-blur-md text-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-bold text-purple-400">
          SkillSwap
        </Link>

        {/* Center: Page Links (scrolling) */}
        <div className="hidden md:flex space-x-10 font-medium text-gray-300">
          {["home", "about", "contact"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`transition ${
                activeSection === id
                  ? "text-purple-400 font-semibold"
                  : "hover:text-purple-300"
              }`}
            >
              {id === "contact" ? "Contact Us" : id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </div>

        {/* Right: Auth Actions */}
        <div className="hidden md:flex items-center space-x-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-purple-300">
                Dashboard
              </Link>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md font-semibold text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="border border-purple-500 hover:bg-purple-600 text-purple-300 px-4 py-1 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-md"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-300 ml-4"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 pt-2 space-y-3 text-gray-200 bg-black bg-opacity-90">
          {["home", "about", "contact"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="block hover:text-purple-300"
              onClick={() => setMenuOpen(false)}
            >
              {id === "contact" ? "Contact Us" : id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
          <hr className="border-gray-700" />
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="block hover:text-purple-300"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:text-purple-300"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block hover:text-purple-300"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
