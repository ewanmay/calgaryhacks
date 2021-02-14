import { authStateClone, profileClone, commonGamesClone } from './state';
import { State } from "./types";

export const reducer = (state: State, action: Record<string, any>): State => {
  console.log(action.type)
  switch (action.type) {
    case "LOGIN":
      return { ...state, authState: action.payload };
    case "LOGOUT":
      return {
        ...state,
        authState: JSON.parse(authStateClone),
        profile: JSON.parse(profileClone),
        commonGames: JSON.parse(commonGamesClone)
      }
    case "GET_STEAM_INFO":
      return { ...state, profile: { ...state.profile, steam: action.payload } }
    case "SET_COMMON_GAMES":
      return { ...state, commonGames: action.payload }
    case "SET_FRIENDS":
      return { ...state, profile: { ...state.profile, friends: action.payload } }
    case "SET_INCOMING_FRIEND_REQUESTS":
      return { ...state, profile: { ...state.profile, incomingRequests: action.payload } }
    case "SET_OUTGOING_FRIEND_REQUESTS":
      return { ...state, profile: { ...state.profile, outgoingRequests: action.payload } }
    default: {
      return state;
    }
  }
}