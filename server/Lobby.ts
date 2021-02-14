import { CommonGames, Game, GameSource, User } from '../client/src/context/types';

const LobbyChat = require('./LobbyChat')
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;


const twilioAccountSid = 'AC228815c2112277eaadeb9ec8e8fc08e9';
const twilioApiKey = 'SK9a85493643292f004062227a10df2587';
const twilioApiSecret = 'ewZugsyLQrcu9jZKDkFzUpDb8kAkfW72';
class Lobby {
  
  io: any // TODO
  db: any // TODO
  lobbyCode: string
  users: User[]
  steamGames: Game[]
  epicGames: Game[]
  freeGames: Game[]

  lobbyChat: typeof LobbyChat


  constructor(io, db, lobbyCode) {
    this.io = io
    this.db = db
    this.lobbyCode = lobbyCode
    this.users = []
    this.steamGames = []
    this.epicGames = []
    this.freeGames = []
    this.lobbyChat = new LobbyChat(this.users, this.sendMessageToAllUsers.bind(this))

    this.io.emit('test', 'hello world')
    console.log("Creating new lobby")
  }

  /*
   *  Creates an object to fully describe this objects state.
   */
  getLobbyInfo() {
    return {
      lobbyCode: this.lobbyCode,
      users: this.users ? this.users.map((u) => u.username) : [],
      commonGames: {steamGames: this.steamGames, epicGames: this.epicGames, freeGames: this.freeGames}
    }
  }

  /*
   *  Adds a user to a lobby.
   *  Will update all users in this lobby of the change.
   */
  addUserToLobby(username: string, socket) {
    if(!this.users) return
    this.users.push({ username, socket })
    socket.join(this.lobbyCode)
    console.log('sending joined-lobby to', username)
    socket.emit('joined-lobby', this.getLobbyInfo())
    this.resetListsOfAvailableGames(() => {
      this.sendMessageToAllUsers('lobby-updated', this.getLobbyInfo())
      this.sendMessageToAllUsers('available-games', {freeGames: this.freeGames, steamGames: this.steamGames, epicGames: this.epicGames})
    })
    this.lobbyChat.setupSocketConnectionsForUser(socket)

    // video
    socket.on('get-token', (username: string) => {
      const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret);
      token.identity = username;
      const videoGrant = new VideoGrant({ room: this.lobbyCode });
      token.addGrant(videoGrant);
      socket.emit('token', token.toJwt());
    })

  }

  removeUserFromLobby(username: string): boolean {
    if(!this.users) return false
    const user = this.users.find((u) => u.username === username)
    if (!user) return false
    user.socket.leave(this.lobbyCode)
    this.lobbyChat.removeSocketConnectionsForUser(user.socket)
    this.users = this.users.filter((u) => u.username !== username)
    this.resetListsOfAvailableGames(() => {
      this.sendMessageToAllUsers('lobby-updated', this.getLobbyInfo())
      this.sendMessageToAllUsers('available-games', {freeGames: this.freeGames, steamGames: this.steamGames, epicGames: this.epicGames})
    })


    return true
  }

  convertRowToGameObject(row): Game {
    const game = {
      name: row.name,
      multiplayer: true,
      website: row.website,
      appid: row.id,
      minPlayers: row.minPlayers,
      maxPlayers: row.maxPlayers,
      source: GameSource.Free
    }

    return game
  }

  convertSteamRowToGameObject(row): Game {
    const game = {
      name: row.name,
      multiplayer: row.multiplayer,
      website: row.website,
      appid: row.appid,
      minPlayers: row.minPlayers,
      maxPlayers: row.maxPlayers,
      source: GameSource.Steam
    }

    return game
  }

  resetListsOfAvailableGames(finishedCallback){

    let userGameList = [];

    const appendUserSteamGames = (rows) => {
      userGameList = userGameList.concat(rows.map((row) => this.convertSteamRowToGameObject(row)))
    }

    const filterFinalGames = (rows) => {
      // Get all steam games that have the same appid
      userGameList = userGameList.concat(rows.map((row) => this.convertSteamRowToGameObject(row)))

      const filteredSteamGames = [];
      userGameList.forEach((game) => {
        if(userGameList.filter((filteredGame) => game.appid === filteredGame.appid).length === this.users.length && !filteredSteamGames.some(filteredGame => filteredGame.appid === game.appid)) {
          filteredSteamGames.push(game)
        }
      })

      this.steamGames = filteredSteamGames;

      finishedCallback();
    }

    const populateFreeGamesAndPopulateSteamGames = (rows) => {
      this.freeGames = rows.map((row) => this.convertRowToGameObject(row))
      // Do some wild filtering shit

      const addUserInfo = (username, rows) =>{
        userGameList.push(rows.map((row) => this.convertRowToGameObject(row)))
      }
      for(let i = 0; i < this.users.length; i++){
        if(i + 1 !== this.users.length){
          this.db.getUserSteamGames(this.users[i].username, appendUserSteamGames)
        }
        else{
          this.db.getUserSteamGames(this.users[i].username, filterFinalGames)
        }
      }
    }

    this.db.getAllFreeGames(populateFreeGamesAndPopulateSteamGames)

  }

  lobbySize(): number {
    return this.users.length
  }

  /*
   *  Will send the provided message to all users in this lobby, including the host.
   *  Requires:
   *  - command: string key matcher for socket io connection
   *  - message: the message to broadcast to all users.
   */
  sendMessageToAllUsers(command: string, message: any) {
    // Long method why arent rooms working
    // if (this.users) console.log("USERS", this.users.map(u=>u.username))
    // if(this.users) this.users.forEach((user) => user.socket.emit(command, message))
    if (this.io) {
      // console.log("Sending command: " + command)
      this.io.to(this.lobbyCode).emit(command, message)
    }
  }

}

module.exports = Lobby