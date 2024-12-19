import React, { useContext } from 'react'; // Import useContext here
import { Link } from 'react-router-dom';
import '../assets/css/navbar.css';
import { UserContext } from '../App';


const Navbar = () => {
  const { user,setUser } = useContext(UserContext);

  return (
    <div className='navbar'>
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          CONTACT MS
        </Link>
      </div>
      <div className="navbar-right">
        {/*<Link to="/about" className="navbar-link">About</Link>*/}
        {
          user ? (
            <>
              <Link to="/dashboard" className="navbar-link">Contacts</Link>
              <span className="navbar-link">{user.name}</span>
              <Link to="/logout" className="navbar-link" onClick={() => setUser(null)}>Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )
        }
      </div>
    </div>
  );
};

export default Navbar;
