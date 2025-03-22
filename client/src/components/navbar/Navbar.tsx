import './Navbar.css';
import { Link } from '@tanstack/react-router';

const Navbar = () => {
  return (
    <nav>
      <div className="navbar-left">
        <a href="/" className="logo">
          Dining Hall Management System
        </a>
      </div>
      <div className="navbar-right">
        <ul>
          <li>
            <Link to="/" activeProps={{ style: { color: 'cyan' } }}>
              Home
            </Link>
          </li>
          <li>
            <a href="/menu" style={{ color: 'inherit', textDecoration: 'none' }}>
              Menu
            </a>
          </li>
          <li>
            <Link to="/about" activeProps={{ style: { color: 'cyan' } }}>
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;