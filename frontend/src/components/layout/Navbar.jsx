import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          <span className="navbar__logo">📚</span>
          <span>Book Trading Club</span>
        </Link>

        <button 
          className="navbar__toggle" 
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          {/* Public Links */}
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/books" 
              className={({ isActive }) => 
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
              onClick={closeMenu}
            >
              Alle Bücher
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/users" 
              className={({ isActive }) => 
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
              onClick={closeMenu}
            >
              User
            </NavLink>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <NavLink 
                  to="/my-books" 
                  className={({ isActive }) => 
                    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                  }
                  onClick={closeMenu}
                >
                  Meine Bücher
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to="/add-book" 
                  className={({ isActive }) => 
                    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                  }
                  onClick={closeMenu}
                >
                  Buch hinzufügen
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to="/requests" 
                  className={({ isActive }) => 
                    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                  }
                  onClick={closeMenu}
                >
                  Requests
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to="/trades" 
                  className={({ isActive }) => 
                    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                  }
                  onClick={closeMenu}
                >
                  Trades
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to="/chat" 
                  className={({ isActive }) => 
                    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                  }
                  onClick={closeMenu}
                >
                  💬 Nachrichten
                </NavLink>
              </li>
            </>
          )}

          {isAuthenticated ? (
            <>
              <li>
                <span className="navbar__user-name">
                  👤 {user?.username}
                </span>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="navbar__link"
                  onClick={closeMenu}
                >
                  Profil
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="navbar__link navbar__link--logout"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className="navbar__link"
                  onClick={closeMenu}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="navbar__link"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;