import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/context';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.css'
import { faUser, faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { faSignOutAlt, faHome, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar() {
  const [state, dispatch] = useContext(AppContext)

  useEffect(() => {
  }, [])

  const history = useHistory()

  const signout = () => {
    history.push("/");
    dispatch({ type: "LOGOUT" })
  }

  return (
    <BootstrapNavbar expand="lg" className="navbar fit">
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <div className="col-12 p-0 flex space-between">
          <div className="col-auto flex center">
            <Link className="navlink p-1" to="/home">
              <FontAwesomeIcon icon={faHome} className='ic'/>
              Home
            </Link>
            <Link className="navlink p-1" to="/profile">
              <FontAwesomeIcon icon={faUserCircle} className='ic'/>
              Profile
            </Link>
            <Link className="navlink p-1" to="/groups">
              <FontAwesomeIcon icon={faUsers} className='ic'/>
              Groups
            </Link>
          </div>

          <div className="p-1" style={{marginRight: 190}}>
            Games Night
          </div>

          <div className="p-1 pointer" onClick={signout}>            
            <FontAwesomeIcon icon={faSignOutAlt} className='ic' style={{marginBottom: -1}}/>
            Logout
          </div>

        </div>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}

