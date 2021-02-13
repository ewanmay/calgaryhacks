import { User, ClientMessage, ServerMessage } from '../client/src/context/types';

class LobbyChat {
  users: User[]
  sendMessageToAllUsers: (command: string, message: any) => void
  messageLog: ServerMessage[]

  constructor(users: User[], sendMessageToAllUsers: (command: string, message: any) => void){
    this.users = users
    this.sendMessageToAllUsers = sendMessageToAllUsers
    this.messageLog = [] 
  }

  setupSocketConnectionsForUser(socket){
    socket.on('add-chat-message', (msg: ClientMessage) => {
      console.log("Received chat message from: " + msg.username)
      const serverMessage = {username: msg.username, messageContents: msg.messageContents, date: this.formattedDate(new Date())}
      this.messageLog.push(serverMessage);
      if (this.messageLog.length > 200)
      {
         this.messageLog.shift();
      }

      this.sendMessageToAllUsers('chat-message', serverMessage)
      this.sendMessageToAllUsers('message-log', this.messageLog)
    })

    socket.emit('message-log', this.messageLog)
  }

  removeSocketConnectionsForUser(socket){
    socket.removeAllListeners('add-chat-message')
  }

  formattedDate(date: any): string
  {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
  }

}

module.exports = LobbyChat