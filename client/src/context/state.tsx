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
  steamGames: [],
  epicGames: [],
  freeGames: []
}

// For deep cloning
export const authStateClone = JSON.stringify(authState);
export const commonGamesClone = JSON.stringify(commonGames);
export const profileClone = JSON.stringify(profile);

export const initialState: State = {
  socket,
  authState: JSON.parse(authStateClone),
  profile: JSON.parse(profileClone),
  commonGames: JSON.parse(commonGamesClone)
}

