import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/context';
import './Landing.css'
function Landing() {
  const [state, dispatch] = useContext(AppContext)

  useEffect(() => {
  }, [])


  return (
    <div className="col-12 p-0 flex fill center top landing">
      <div className="col-8 p-0 fill left top">
        Welcome back, {state.authState.username}
        <div className="col-12 p-0 header">
          Activity
      </div>

        <div className="col-12 p-0 header">
          Find Group
      </div>

        <div className="col-12 p-0 header">
          Recent Games
      </div>

        <div className="col-12 p-0 header">
          Join chat
      </div>

        <div className="col-12 p-0 header">

        </div>
      </div>
    </div>
  );
}

export default Landing;
