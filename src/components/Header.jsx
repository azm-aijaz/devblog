import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMenuOutline, IoCloseOutline, IoMoon, IoSunny, IoSearchOutline } from 'react-icons/io5';

function Header({ theme, toggleTheme }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header>
      <div className="container">
        <nav className="navbar">
          <Link to="/">
            <img src="/images/logo-light.svg" alt="logo" width="170" height="40" className="logo-light" />
            <img src="/images/logo-dark.svg" alt="logo" width="170" height="40" className="logo-dark" />
          </Link>

          <div className="btn-group">
            <Link to="/search" className="theme-btn-mobile">
              <IoSearchOutline />
            </Link>
            <button className={`theme-btn theme-btn-mobile ${theme === 'light-theme' ? 'light' : 'dark'}`} onClick={toggleTheme}>
              <IoMoon className="moon" />
              <IoSunny className="sun" />
            </button>

            <button className="nav-menu-btn" onClick={toggleNav}>
              <IoMenuOutline />
            </button>
          </div>

          <div className="flex-wrapper">
            <ul className="desktop-nav">
              <li>
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li>
                <Link to="/create" className="nav-link">Write</Link>
              </li>
              <li>
                <Link to="/search" className="nav-link">Search</Link>
              </li>
              <li>
                <Link to="#" className="nav-link">About Me</Link>
              </li>
              <li>
                <Link to="#" className="nav-link">Contact</Link>
              </li>
            </ul>

            <button className={`theme-btn theme-btn-desktop ${theme === 'light-theme' ? 'light' : 'dark'}`} onClick={toggleTheme}>
              <IoMoon className="moon" />
              <IoSunny className="sun" />
            </button>
          </div>

          <div className={`mobile-nav ${isNavOpen ? 'active' : ''}`}>
            <button className="nav-close-btn" onClick={toggleNav}>
              <IoCloseOutline />
            </button>

            <div className="wrapper">
              <p className="h3 nav-title">Main Menu</p>
              <ul>
                <li className="nav-item">
                  <Link to="/" className="nav-link" onClick={toggleNav}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/create" className="nav-link" onClick={toggleNav}>Create Post</Link>
                </li>
                <li className="nav-item">
                  <Link to="/search" className="nav-link" onClick={toggleNav}>Search</Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link" onClick={toggleNav}>About Me</Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link" onClick={toggleNav}>Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="h3 nav-title">Topics</p>
              <ul>
                <li className="nav-item">
                  <Link to="#" className="nav-link" onClick={toggleNav}>Database</Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link" onClick={toggleNav}>Accessibility</Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link" onClick={toggleNav}>Web Performance</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;