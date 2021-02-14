
import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../context/context'
import {User} from '../context/types'
import './UserList.css'

interface LobbyInfo {
    users: string[],
    lobbyCode: string
}

function Userlist() {
    const [state, dispatch] = useContext(AppContext)
    const [userList, setUserList] = useState([] as string [])

    useEffect(() => {
        state.socket.on('lobby-updated', function ({users}: LobbyInfo) {
          setUserList(users)
        })
      }, [])

  return (
    <div id='userlist'>
      <div>Online ({userList.length})</div>
      {userList.map((username: string, i: number) => {
        const isSelf = username === state.authState.username
        return (
          <p
            key={i}
            style={{
              fontWeight: isSelf ? 'bold' : 'normal'
            }}
          >
            {username + (isSelf ? ' (You)' : '')}
          </p>
        )
      })}
    </div>
  )
}

export default Userlist