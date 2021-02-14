import { State } from "./types";
import { authState } from './state'

export const reducer = (state: State, action: Record<string, any>): State => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, authState: action.payload };
    case "LOGOUT":
      return { ...state, authState };
    case "GET_STEAM_INFO":
      return { ...state, profile: { ...state.profile, steam: action.payload } }
    case "SET_COMMON_GAMES":
      return {...state, commonGames: action.payload}
    default: {
      return state;
    }
  }
}