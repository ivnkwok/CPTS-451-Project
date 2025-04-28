import './Navbar.css'
import { Link } from '@tanstack/react-router'
import { FaBasketShopping, FaUser, FaMagnifyingGlass } from 'react-icons/fa6'

/**
 * Navbar component for the Dining Hall Management System.
 * Provides navigation links and quick access icons.
 *
 * @returns {JSX.Element} A navigation bar with links and action buttons.
 */
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo" aria-label='Navigate back to the menu.'>
          Dining Hall Management System
        </Link>
      </div>
      <div className="navbar-center">
        <ul>
          <li>
            <Link to="/" activeProps={{ style: { color: 'cyan' } }} aria-label='Menu link.' title='Menu'>
              Menu
            </Link>
          </li>
          <li>
            <Link to="/about" activeProps={{ style: { color: 'cyan' } }} aria-label='About us link.' title='About us'>
              About
            </Link>
          </li>
          <li>
            <Link to="/faq" activeProps={{ style: { color: 'cyan' } }} aria-label='Frequently asked questions link.' title='Frequently asked questions'>
              FAQ
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <button className="icon-button" aria-label='Search food button.' title='Search food'>
          <FaMagnifyingGlass size={20} />
        </button>
        <button className="icon-button" aria-label='Your cart button.' title='Your cart'>
          <FaBasketShopping size={20} />
        </button>
        <Link to="/login" className="icon-button" aria-label="Login button." title="Login">
          <FaUser size={20} />
        </Link>
      </div>
    </nav>
  )
}

export default Navbar