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
    avatarUrl: "",
    games: []
  }
}

export const initialState: State = {
  socket,
  authState,
  profile
}
