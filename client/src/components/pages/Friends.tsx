import React, { useContext } from 'react';
import { AppContext } from '../../context/context';
import { Game } from '../../context/types';
import './Landing.css';


export default function Friends() {
  const [state, dispatch] = useContext(AppContext)

  return (
    <div className="col-12 p-0 flex game-list-item space-between">
      <div>
        <h4>Friends List</h4>
        <div>
          
        </div>
      </div>
    </div>
  );
}

