import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/context';
import './Landing.css';

function Landing() {
  const [state, dispatch] = useContext(AppContext)

  useEffect(() => {
  }, [])


  return (
    <div className="col-12 p-0 flex fill center landing">  
          <div className="col-12 p-0" style={{ position: 'absolute', top: 0, fontSize: 20, fontStyle: 'italic'}} >
            Welcome back, {state.authState.username}
          </div>
          <div className='test'>
            <div className="col-12 p-0 header">
              Activity
            </div>
            <div className="col-12 p-0 header">
                Find Group
            </div>
            <div className="col-12 p-0 header">
                Recent Games
            </div>
          </div>
    </div>
  );
}

export default Landing;
