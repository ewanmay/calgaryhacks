export interface State {
  socket: SocketIOClient.Socket,
  authState: AuthState,
  profile: UserProfile
}

export interface AuthState {
  id: number,
  username: string,  
  email: string,
  loggedIn: boolean,
  errorMessage: string
}

export interface LoginObj {
  username: string,
  password: string
}

export interface Test {
  id: Number;
}

export interface User {
  username: string,
  socket: any
}

export interface ClientMessage {
  messageContents: string,
  username: string
}

export interface ServerMessage {
  messageContents: string,
  username: string,
  date: string
}

export interface MessageLog {
  messages: ServerMessage[]
}

export interface UserProfile {
  name: string,
  steam: Steam
}

export interface Steam {
  steamUsername: string
  steamError: string,
  profileUrl: string,
  avatarUrl: string,
  games: Game[]
}

export interface Game {
  name: string,
  multiplayer: boolean,
  website: string
}

