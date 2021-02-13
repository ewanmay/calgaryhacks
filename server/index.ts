import { AuthState, LoginObj, User } from '../client/src/context/types';

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
})

const PORT = process.env.PORT || 5000
const LobbyList = require('./LobbyList')
const Database = require('./database')
const SteamApi = require('./SteamApi')

const db = new Database()
const lobbyList = new LobbyList(io, db)
const userSocketList: User[] = []
const steamApi = new SteamApi('A17C8B0E4812324814A2DCAB9579B3AF')

const removeUserFromLobbies = (socket) => {
  const index = userSocketList.findIndex(
    (u) => u.socket === socket.id
  )
  if (index != -1) {
    const user = userSocketList[index]
    userSocketList.splice(index, 1)
    lobbyList.removeUserFromLobbies(user.username)
  }
} 

io.on('connection', (socket) => {
  console.log('User Connected')

  socket.on('login', ({username, password}: LoginObj) => {
    if (!username || !password) {
      return
    }
    const sendResponseToClient = (user) => {
      let id = null
      let email = ''
      let loggedIn = false
      let errorMessage = ''
      // emits an AuthState object
      if (!user) {
        errorMessage = 'Incorrect username or password. Please try again.'
      }
      else if (user?.id === undefined) {
        // See sqlite docs, this is the variable it stores error messages in.
        console.log('LOGIN ERROR', user.message)
        errorMessage = 'We encountered an error. Please try again.'
      }
      else { // success
          id=user.id,
          loggedIn=true
          email = user.email
          console.log(username, 'logged in')
      }
      const response: AuthState = {
        id,
        username,
        email,
        loggedIn,
        errorMessage
      }
      socket.emit('login-response', response)
    }

    db.login(username, password, sendResponseToClient)
  })


  socket.on('logout', () => {
    removeUserFromLobbies(socket);
  });


  socket.on('register', ({ username, password, email }) => {
    const sendResponseToClient = (user) => {
      let id = null
      let loggedIn = false
      let errorMessage = ''
      // emits an AuthState object
      if (!user?.id) {
        errorMessage='This username or email are already taken.'
      }
      else {
        id=user.id,
        loggedIn=true
          console.log(username, 'registered')
      }
      const response: AuthState = {
        id,
        username,
        email,
        loggedIn,
        errorMessage
      }
      socket.emit('register-response', response)
    }

    db.addNewUser(username, password, email, sendResponseToClient)
  })

  
  socket.on('add-steamId', (username, steamId) => {
    const sendResponseToClient = (success) => {
      socket.emit('steamId-added', success)
    }
    db.addSteamId(username, steamId, sendResponseToClient)
  })


  socket.on('create-lobby', (username: string) => {
    const lobbyCode = lobbyList.addNewLobby()
    lobbyList.addUserToLobby(lobbyCode, username, socket)
  })

  socket.on('join-lobby', (msg) => {
    const lobbyCode = msg.lobbyCode
    const username = msg.username
    lobbyList.addUserToLobby(lobbyCode, username, socket)
  })

  socket.on('leave-lobby', (username: string) => {
    lobbyList.removeUserFromLobbies(username)
  })

  socket.on('get-games-list', (username: string) => {
    const sendResponseToClient = (gameList) => {
      if(gameList){
        socket.emit('get-games-list-response', gameList);
      }
      else{
        // TODO: Error response
      }
    }

    const sendApiRequest = (row) => {
      if(row && row.steam_id){
        steamApi.getUserGameList(row.steam_id, sendResponseToClient);   
      }
      else{
        // TODO: Error response
      }
    }

    db.getUserInfo(username, sendApiRequest);
  })

  socket.on('disconnect', () => {
    // TODO anything?
  })

})

http.listen(PORT, () => console.log(`Listening on port ${PORT}`))