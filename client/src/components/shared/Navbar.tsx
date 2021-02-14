import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/context';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.css'

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
            <Link className="navlink p-1" to="/home">Home</Link>
            <Link className="navlink p-1" to="/profile">Profile</Link>
            <Link className="navlink p-1" to="/groups">Groups</Link>

          </div>
          <div className="p-1">Welcome, {state.authState.username}</div>
          <div className="p-1 pointer" onClick={signout}>Logout</div>
        </div>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}

