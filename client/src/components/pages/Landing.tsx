import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/context';

function Landing() {
  const [state, dispatch] = useContext(AppContext)
  
  useEffect(() => {
  }, [])


  return (
    <div className="col-12 p-0 flex fill">
      Landing Page
    </div>
  );
}

export default Landing;
