import { User, ClientMessage, ServerMessage } from '../client/src/context/types';

class LobbyChat {
  users: User[]
  sendMessageToAllUsers: (command: string, message: any) => void
  sendMessageToOthers: (command: string, message: any) => void
  messageLog: ServerMessage[]

  constructor(users: User[], sendMessageToAllUsers: (command: string, message: any) => void, sendMessageToOthers: (command: string, message: any) => void){
    this.users = users
    this.sendMessageToAllUsers = sendMessageToAllUsers
    this.sendMessageToOthers = sendMessageToOthers
    this.messageLog = [] 
  }

  setupSocketConnectionsForUser(socket){
    socket.on('add-chat-message', (msg: ClientMessage) => {
      console.log("add-chat-message from:",msg.username,":", msg.messageContents)
      const serverMessage = {username: msg.username, messageContents: msg.messageContents, date: new Date().toUTCString()}
      this.messageLog.push(serverMessage);
      if (this.messageLog.length > 200) {
         this.messageLog.shift();
      }
      // this.sendMessageToOthers('chat-message', serverMessage)
      console.log('sending messageLog')
      this.sendMessageToAllUsers('message-log', this.messageLog)
    })

    socket.emit('message-log', this.messageLog)
  }

  removeSocketConnectionsForUser(socket){
    socket.removeAllListeners('add-chat-message')
  }

}

module.exports = LobbyChat