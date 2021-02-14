import { AxiosResponse } from 'axios';
import { AuthState, LoginObj, User, Steam, Game } from '../client/src/context/types';

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

  socket.on('login', ({ username, password }: LoginObj) => {
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
        id = user.id,
          loggedIn = true
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
        errorMessage = 'This username or email are already taken.'
      }
      else {
        id = user.id,
          loggedIn = true
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


  socket.on('add-steamid', (username, steamId) => {
    console.log('adding steam id: ', username, steamId)
    const sendResponseToClient = (success) => {
      console.log('success: ', success)
      socket.emit('steamid-added', success)
      getSteamInfo(username)
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

  const getSteamInfo = (username: string) => {
    console.log('get-steam-info', username)

    const response: Steam = {
      steamUsername: '',
      steamError: '',
      profileUrl: '',
      avatarUrl: '',
      games: []
    }

    const populateGameList = async (res) => {

      const gameList = res.response?.games

      // const idsToGet = []

      const apiCallback = (result: any, appid) => {
        const game: Game = { 
          name: '',
          multiplayer: false,
          website: '',
          appid:appid
        }
        const appResponse = result[appid];
        if (appResponse.success) {
          const appData = appResponse.data;
          game.name = appData.name || '';
          game.website = appData.website || '';
          game.multiplayer = appData.categories?.some(c => c.id == 1);
        }

        db.addSteamGame(appid, game, username, () => { })
        response.games.push(game)
      }

      const dbCallback = (result: any, id: string) => {
        if (result && result?.appid) {
          response.games.push(
            {
              name: result.name,
              website: result.website,
              multiplayer: result.multiplayer,
              appid:id
            }
          )
        }
        else {
          console.log(id);
          steamApi.getGameInfo(id,apiCallback)
        }
      }

      if(gameList){
        gameList?.map((game) => db.getSteamGame(game.appid, dbCallback))
      }
      else {
        response.steamError += 'Unable to find games. ';
      }
    }

    const populateUserData = (res) => {
      const player = res.response?.players[0]
      if (player) {
        response.steamUsername = player.personaname || '';
        response.avatarUrl = player.avatar || '';
        response.profileUrl = player.profileurl || '';
      }
      else {
        response.steamError += 'Unable to find user data. ';
      }

    }

    const sendApiRequests = async (row) => {
      console.log('got row', row)
      if (row && row.steam_id) {
        await steamApi.getUserGameList(row.steam_id, populateGameList);
        await steamApi.getUserInfo(row.steam_id, populateUserData);

        response.games = response.games.filter(g => g.name)
        socket.emit('get-steam-info-response', response);
      }
      else {
        response.steamError += 'Unable to find steam id. ';

      }
    }

    db.getUserInfo(username, sendApiRequests);
  }


  socket.on('get-steam-info', (username: string) => getSteamInfo(username))

  socket.on('disconnect', () => {
    // TODO anything?
  })

})

http.listen(PORT, () => console.log(`Listening on port ${PORT}`))