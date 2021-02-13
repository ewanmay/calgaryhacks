import { State } from "./types";
import {authState} from './state'

export const reducer = (state: State, action: Record<string, any>): State => {
  switch (action.type) {
    case "LOGIN": 
      return {...state, authState: action.payload};
    case "LOGOUT": 
      return { ...state, authState};
    default: {
      return state;
    }
  }
}