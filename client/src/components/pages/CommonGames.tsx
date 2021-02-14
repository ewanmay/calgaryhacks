import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/context';
import './Landing.css'
function CommonGames() {
  const [state, dispatch] = useContext(AppContext)

  useEffect(() => {
    state.socket.emit('get-games')    
    state.socket.emit('select-random-game')
  }, [])


  return (
    <div className="col-12 p-0 flex fill center top landing">
      <div className="col-8 p-0 fill left top">        
      </div>
    </div>
  );
}

export default CommonGames;

