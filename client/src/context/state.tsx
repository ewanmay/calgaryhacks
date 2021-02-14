import { State } from "./types";
import { socket } from './socket';

export const authState = {
  loggedIn: false,
  username: '',
  email: '',
  id: 0,
  errorMessage: ''    
}

export const profile = {
  name: "",
  steam: {
    steamUsername: "",
    profileUrl: "",    
    steamId: "",
    avatarUrl: "",
    games: [],
    steamError: ""
  },
  friends: [],
  incomingRequests: [],
  outgoingRequests: []
}

export const commonGames = {  
  steamGames:  [],
  epicGames:  [],
  freeGames: []
}

export const initialState: State = {
  socket,
  authState,
  profile,
  commonGames
}
