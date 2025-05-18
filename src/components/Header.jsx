import { useState } from 'react';
import { IoMenuOutline, IoCloseOutline, IoMoon, IoSunny, IoServerOutline, IoAccessibilityOutline, IoRocketOutline } from 'react-icons/io5';

function Header({ theme, toggleTheme }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header>
      <div className="container">
        <nav className="navbar">
          <a href="#">
            <img src="/assets/images/logo-light.svg" alt="Devblog's logo" width="150" height="40" className="logo-light" />
            <img src="/assets/images/logo-dark.svg" alt="Devblog's logo" width="150" height="40" className="logo-dark" />
          </a>

          <div className="btn-group">
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
                <a href="#" className="nav-link">Home</a>
              </li>
              <li>
                <a href="#" className="nav-link">About Me</a>
              </li>
              <li>
                <a href="#" className="nav-link">Contact</a>
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
                  <a href="#" className="nav-link">Home</a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">About Me</a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">Contact</a>
                </li>
              </ul>
            </div>

            <div>
              <p className="h3 nav-title">Topics</p>
              <ul>
                <li className="nav-item">
                  <a href="#" className="nav-link">Database</a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">Accessibility</a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">Web Performance</a>
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